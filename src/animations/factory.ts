import type { ScrollTriggerConfig } from '$types';

import { ANIMATION_DEFAULTS, TRIGGER_DEFAULTS } from './config';
import { timelineRegistry } from './registry';

/**
 * Factory for creating animation timelines with their configurations
 */
export class AnimationFactory {
  /**
   * Create a timeline with its configuration
   */
  public create(
    type: string,
    element: HTMLElement,
    context?: Record<string, string>
  ): {
    timeline: gsap.core.Timeline | undefined;
    triggerConfig?: ScrollTriggerConfig;
  } {
    const definition = timelineRegistry[type];

    if (!definition) {
      console.warn(`Animation type "${type}" not found in registry`);
      // Return a dummy timeline that does nothing
      const timeline = gsap.timeline({ paused: true });
      return { timeline };
    }

    // Get the trigger type
    const trigger = element.getAttribute('data-trigger') || definition.defaultTrigger || 'entrance';

    // Get animation defaults for this trigger type
    const animationDefaults =
      trigger === 'load'
        ? ANIMATION_DEFAULTS.load
        : trigger === 'entrance'
          ? ANIMATION_DEFAULTS.entrance
          : trigger === 'scrub'
            ? ANIMATION_DEFAULTS.scrub
            : {};

    // Merge context with animation defaults
    const mergedContext = {
      ...animationDefaults,
      ...context,
    };

    // Create the timeline with merged context
    const timeline = definition.create(element, mergedContext);

    // Get trigger configuration
    let triggerConfig: ScrollTriggerConfig | undefined;

    if (definition.triggerConfig) {
      // Use timeline-specific config
      triggerConfig = definition.triggerConfig;
    } else {
      // Use default config based on trigger type
      const trigger =
        element.getAttribute('data-trigger') || definition.defaultTrigger || 'entrance';

      if (trigger === 'entrance') {
        triggerConfig = TRIGGER_DEFAULTS.entrance;
      } else if (trigger === 'scrub') {
        triggerConfig = TRIGGER_DEFAULTS.scrub;
      }
    }

    return {
      timeline,
      triggerConfig,
    };
  }

  /**
   * Check if an animation type exists
   */
  public has(type: string): boolean {
    return type in timelineRegistry;
  }

  /**
   * Get all available animation types
   */
  public getAvailableTypes(): string[] {
    return Object.keys(timelineRegistry);
  }
}
