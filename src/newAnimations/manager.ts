import type { AnimationInstance, QueuedAnimation, TimelineConfig } from 'src/types/newAnimations';

import { App } from '$app';
import { Events } from '$events';
import { queryElements } from '$utils/queryElements';

import { registry } from './registry';

export class AnimationManager {
  private app: App;
  private animationInstances: Map<Element, AnimationInstance> = new Map();
  private onLoadAnimations: QueuedAnimation[] = [];
  private onScrollAnimations: QueuedAnimation[] = [];
  private relinkScrollAnimations: Set<Element> = new Set();

  private constructor() {
    this.app = App.getInstance();
  }

  public init(): void {
    const elements = queryElements<HTMLElement>('[data-animation]');
    if (!elements.length) return;

    elements.forEach((element) => {
      const animationType = element.dataset.animation;
      if (!animationType) return;

      const factory = registry[animationType];

      if (!factory) {
        // eslint-disable-next-line no-console
        console.warn(`Animation type "${animationType}" not found`);
        return;
      }

      const config = factory(element);
      this.processAnimation(element, config);
    });

    // Set data-loaded attribute to indicate animations are loaded
    document.body.setAttribute('data-loaded', 'true');

    this.app.eventBus.on(Events.HERO_STATIC, () => {
      this.createDeferredScrollTriggers();
    });

    this.playLoadSequence();
    this.storeAnimations([...this.onLoadAnimations, ...this.onScrollAnimations]);
  }

  private processAnimation(element: HTMLElement, config: TimelineConfig): void {
    const { animation } = element.dataset;
    const { timeline, scrollTriggerConfig } = config;

    // If no ScrollTrigger config, it's a load-only animation
    if (!scrollTriggerConfig) {
      this.onLoadAnimations.push({ element, timeline });
      return;
    }

    // Create ScrollTrigger to check if in view
    const scrollTrigger = ScrollTrigger.create({
      ...scrollTriggerConfig,
      animation: timeline,
    });

    if (
      this.onLoadAnimations.length <= 1 &&
      ScrollTrigger.isInViewport(element) &&
      animation !== 'homeHero'
    ) {
      scrollTrigger.kill();
      this.onLoadAnimations.push({
        element,
        timeline,
        scrollTriggerConfig,
      });
    } else {
      scrollTrigger.kill();
      this.onScrollAnimations.push({
        element,
        timeline,
        scrollTriggerConfig,
      });
    }
  }

  private playLoadSequence(): void {
    console.log('playLoadSequence', this.onLoadAnimations);
    if (this.onLoadAnimations.length === 0) {
      this.app.eventBus.emit(Events.HERO_STATIC);
      return;
    }

    // Kill ScrollTriggers for scroll-based animations that are in view on load
    this.onLoadAnimations.forEach(({ scrollTrigger, element }) => {
      if (scrollTrigger) {
        scrollTrigger.kill();
        this.relinkScrollAnimations.add(element);
      }
    });

    // Create master timeline for all load animations
    const master = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (this.relinkScrollAnimations.size > 0) {
          this.setupScrollRelinker();
        }
      },
    });

    // Add all animations (both load-only and temporarily killed scroll animations)
    this.onLoadAnimations.forEach(({ timeline }, index) => {
      // Unpause the timeline so the master can control it
      timeline.paused(false);
      const overlap = '50%';
      const position = index === 0 ? 0 : `-=${overlap}`;
      master.add(timeline, position);
    });

    master.play();
  }

  private createDeferredScrollTriggers(): void {
    this.onScrollAnimations.forEach(({ element, timeline, scrollTriggerConfig }) => {
      const scrollTrigger = ScrollTrigger.create({
        ...scrollTriggerConfig,
        animation: timeline,
      });

      this.animationInstances.set(element, {
        timeline,
        scrollTrigger,
        scrollTriggerConfig,
      });
    });
  }

  private setupScrollRelinker(): void {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: () => this.checkForRelinking(),
    });
  }

  private checkForRelinking(): void {
    this.relinkScrollAnimations.forEach((element) => {
      const instance = this.animationInstances.get(element);

      if (!instance) return;

      // If already relinked, skip
      if (instance.relinked) return;

      const { timeline, scrollTriggerConfig } = instance;

      if (!scrollTriggerConfig) return;

      // Create a test ScrollTrigger to check if element is out of view
      const testST = ScrollTrigger.create({
        trigger: scrollTriggerConfig.trigger,
        start: scrollTriggerConfig.start,
        end: scrollTriggerConfig.end,
      });

      const isOutOfView = (!testST.isActive && testST.progress === 0) || testST.progress === 1;

      if (isOutOfView) {
        // Kill test trigger
        testST.kill();

        // Re-link with original ScrollTrigger config
        const newST = ScrollTrigger.create({
          ...scrollTriggerConfig,
          animation: timeline,
          // Ensure timeline progress matches scroll position
          onUpdate: (self) => {
            timeline.progress(self.progress);
          },
        });

        // Update the instance
        instance.scrollTrigger = newST;
        instance.relinked = true;

        // Remove from load animations set
        this.relinkScrollAnimations.delete(element);

        // eslint-disable-next-line no-console
        console.log(`Relinked animation for element:`, element);
      } else {
        // Clean up test trigger if not ready to relink
        testST.kill();
      }
    });

    // If all animations are relinked, kill the watcher
    if (this.relinkScrollAnimations.size === 0) {
      // Find and kill the watcher ScrollTrigger
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === document.body && !st.animation) {
          st.kill();
        }
      });
    }
  }

  private storeAnimations(animations: QueuedAnimation[]): void {
    animations.forEach(({ element, timeline, scrollTrigger, scrollTriggerConfig }) => {
      this.animationInstances.set(element, {
        timeline,
        scrollTrigger,
        scrollTriggerConfig,
      });
    });
  }

  public refreshScrollTriggers(): void {
    ScrollTrigger.refresh();
  }
}
