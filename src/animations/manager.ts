// GSAP and ScrollTrigger are loaded globally by Webflow

import { App } from '$app';
import { Events } from '$events';
import type { AnimationEventData, AnimationInstance, TriggerType } from '$types';

import { AnimationFactory } from './factory';

export class AnimationManager {
  private static instance: AnimationManager;
  private app: App;
  private factory: AnimationFactory;
  private instances: AnimationInstance[] = [];
  private animationQueue: AnimationInstance[] = [];
  private heroInstance: AnimationInstance | null = null;
  private isPlayingQueue = false;
  private instanceIdCounter = 0;
  private initialized = false;
  private allowNaturalTriggers = false; // Flag to control when natural triggers can fire

  private constructor() {
    this.app = App.getInstance();
    this.factory = new AnimationFactory();
  }

  public static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  /**
   * Initialize the animation system
   */
  public initialize(): void {
    if (this.initialized) return;

    console.log('Initializing animation system');

    // Step 1: Scan DOM and create all animations (none play automatically)
    this.scanAndCreateAnimations();

    console.log(`Created ${this.instances.length} animation instances`);
    console.log(this.instances);
    this.initialized = true;
  }

  /**
   * App is ready - determine what should play
   */
  public appReady(): void {
    console.log('App ready, determining animation playback order');

    // Step 2: Find hero and check if visible
    this.heroInstance = this.instances.find((i) => i.type === 'hero') || null;

    // Step 3: Check hero visibility
    let heroVisible = false;
    if (this.heroInstance && this.heroInstance.scrollTrigger) {
      heroVisible = this.heroInstance.scrollTrigger.isActive;

      if (!heroVisible) {
        // Set hero to final frame if not visible
        this.heroInstance.timeline.progress(1);
      }
    }

    // Step 4: Find visible entrance animations
    const visibleEntranceAnimations = this.instances.filter((instance) => {
      if (instance.trigger !== 'entrance') return false;
      if (!instance.scrollTrigger) return false;

      // Check if animation trigger has been passed
      return instance.scrollTrigger.isActive;
    });

    console.log(`Found ${visibleEntranceAnimations.length} visible entrance animations`);

    // Step 5: Build playback queue
    if (heroVisible && this.heroInstance) {
      this.animationQueue.push(this.heroInstance);
    }

    // Step 6: Add visible entrance animations to queue (in DOM order)
    visibleEntranceAnimations.forEach((animation) => {
      this.animationQueue.push(animation);
    });

    // Start playing the queue
    if (this.animationQueue.length > 0) {
      console.log(`Starting animation queue with ${this.animationQueue.length} animations`);
      this.playNextInQueue();
    }

    // Step 7: Allow natural ScrollTrigger animations after queue is set up
    this.allowNaturalTriggers = true;

    this.app.eventBus.on(Events.ANIMATION_COMPLETED, (eventData) => {
      if (eventData.type === 'hero') {
        this.refresh();
      }
    });
  }

  /**
   * Scan DOM for animation elements and create instances
   */
  private scanAndCreateAnimations(): void {
    const elements = document.querySelectorAll<HTMLElement>('[data-animation]');

    elements.forEach((element) => {
      const type = element.getAttribute('data-animation');
      if (!type) return;

      const trigger = (element.getAttribute('data-trigger') as TriggerType) || 'entrance';

      // Get context from data-context-* attributes
      const context = this.extractContext(element);

      // Create timeline and config from factory
      const { timeline, triggerConfig } = this.factory.create(type, element, context);
      if (!timeline) return;

      // Generate unique instance ID
      const id = `${type}_${(this.instanceIdCounter += 1)}`;

      const instance: AnimationInstance = {
        id,
        element,
        type,
        timeline,
        trigger,
        state: 'pending',
        triggerConfig,
        context,
      };

      // Set up ScrollTrigger for all scroll-based animations
      if ((trigger === 'entrance' || trigger === 'scrub' || trigger === 'load') && triggerConfig) {
        // For scrub animations, attach the timeline directly
        if (trigger === 'scrub') {
          instance.scrollTrigger = ScrollTrigger.create({
            trigger: element,
            ...triggerConfig,
            animation: timeline,
          });
        } else {
          // For entrance/load animations, create without animation
          // We'll control playback manually
          instance.scrollTrigger = ScrollTrigger.create({
            trigger: element,
            ...triggerConfig,
            onToggle: (self) => {
              // Only allow natural triggers after queue is built
              if (!this.allowNaturalTriggers) return;

              // For entrance animations not in queue, let them play naturally
              if (
                trigger === 'entrance' &&
                instance.state === 'pending' &&
                self.isActive &&
                !this.animationQueue.includes(instance)
              ) {
                console.log(`ScrollTrigger playing ${type} naturally`);
                this.playAnimation(instance);
              }
            },
          });
        }
      }

      // Set up event listener for event-triggered animations
      if (trigger === 'event') {
        const eventName = element.getAttribute('data-event') || type;
        this.app.eventBus.on(eventName, (data: Record<string, any>) => {
          if (instance.state === 'pending') {
            this.playAnimation(instance, data);
          }
        });
      }

      this.instances.push(instance);
    });

    // Emit initialization complete
    this.app.eventBus.emit(Events.ANIMATIONS_INITIALIZED, {
      instanceCount: this.instances.length,
    });
  }

  /**
   * Play the next animation in the queue
   */
  private playNextInQueue(): void {
    if (this.animationQueue.length === 0) {
      this.isPlayingQueue = false;
      console.log('Animation queue complete');
      return;
    }

    this.isPlayingQueue = true;
    const nextAnimation = this.animationQueue.shift()!;

    console.log(`Playing queued animation: ${nextAnimation.type} (${nextAnimation.id})`);

    // Set up completion handler to play next
    nextAnimation.timeline.eventCallback('onStart', () => {
      setTimeout(() => {
        this.playNextInQueue();
      }, 500);
    });
    nextAnimation.timeline.eventCallback('onComplete', () => {
      console.log('Animation completed', nextAnimation);
      this.handleAnimationComplete(nextAnimation);
    });

    this.playAnimation(nextAnimation);
  }

  /**
   * Play a specific animation
   */
  private playAnimation(instance: AnimationInstance, _eventData?: Record<string, any>): void {
    if (instance.state !== 'pending') return;

    console.log(`Playing animation: ${instance.type} (${instance.id})`);

    // Update state
    instance.state = 'playing';

    // Emit start event
    this.handleAnimationStart(instance);

    // Play timeline
    instance.timeline.restart(true);

    // Set up completion if not in queue (queue handles its own completion)
    if (!this.isPlayingQueue) {
      instance.timeline.eventCallback('onComplete', () => {
        this.handleAnimationComplete(instance);
      });
    }
  }

  /**
   * Extract context data from element attributes
   */
  private extractContext(element: HTMLElement): Record<string, any> {
    const context: Record<string, any> = {};
    const { attributes } = element;

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name.startsWith('data-context-')) {
        const key = attr.name.replace('data-context-', '');
        context[key] = attr.value;
      }
    }

    return context;
  }

  /**
   * Handle animation start
   */
  private handleAnimationStart(instance: AnimationInstance): void {
    const eventData: AnimationEventData = {
      id: instance.id,
      type: instance.type,
      element: instance.element,
      state: 'playing',
      context: instance.context,
    };

    // Emit generic animation started event
    this.app.eventBus.emit(Events.ANIMATION_STARTED, eventData);
  }

  /**
   * Handle animation completion
   */
  private handleAnimationComplete(instance: AnimationInstance): void {
    instance.state = 'completed';

    const eventData: AnimationEventData = {
      id: instance.id,
      type: instance.type,
      element: instance.element,
      state: 'completed',
      context: instance.context,
    };

    // Emit generic animation completed event
    this.app.eventBus.emit(Events.ANIMATION_COMPLETED, null, eventData);
  }

  /**
   * Get all instances of a specific animation type
   */
  public getInstancesByType(type: string): AnimationInstance[] {
    return this.instances.filter((i) => i.type === type);
  }

  /**
   * Get a specific instance by ID
   */
  public getInstance(id: string): AnimationInstance | undefined {
    return this.instances.find((i) => i.id === id);
  }

  /**
   * Manually trigger an animation
   */
  public trigger(type: string, context?: Record<string, any>): void {
    const instances = this.getInstancesByType(type);
    instances.forEach((instance) => {
      if (instance.state === 'pending') {
        this.playAnimation(instance, context);
      }
    });
  }

  /**
   * Refresh all ScrollTriggers
   */
  public refresh(): void {
    ScrollTrigger.refresh();
  }

  /**
   * Clean up all animations
   */
  public destroy(): void {
    this.instances.forEach((instance) => {
      instance.timeline.kill();
      instance.scrollTrigger?.kill();
    });
    this.instances = [];
    this.animationQueue = [];
    this.initialized = false;
  }
}
