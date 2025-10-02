import type { TimelineConfig } from 'src/types/newAnimations';

import { App } from '$app';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

/**
 * Base class for creating consistent animation factories
 */
export abstract class BaseAnimation {
  protected app: App;
  protected element: HTMLElement;
  protected timeline: gsap.core.Timeline;

  constructor(element: HTMLElement) {
    this.app = App.getInstance();
    this.element = element;
    this.timeline = gsap.timeline({ paused: true });
  }

  /**
   * Define the animation timeline
   */
  protected abstract createTimeline(): void;

  /**
   * Override to provide ScrollTrigger configuration
   */
  protected getScrollTriggerConfig(): ScrollTrigger.Vars | null {
    return null;
  }

  /**
   * Build and return the complete configuration
   */
  public build(): TimelineConfig {
    this.createTimeline();

    const config: TimelineConfig = {
      timeline: this.timeline,
    };

    const scrollConfig = this.getScrollTriggerConfig();
    if (scrollConfig) {
      config.scrollTriggerConfig = scrollConfig;
    }

    return config;
  }

  /**
   * Helper methods for common animations
   */
  protected queryElement(selector: string): HTMLElement | undefined {
    return queryElement<HTMLElement>(selector, this.element);
  }

  protected queryElements(selector: string): HTMLElement[] {
    return queryElements<HTMLElement>(selector, this.element);
  }

  /**
   * Override to handle resize events
   */
  protected onResize() {}
}
