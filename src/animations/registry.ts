import type { TimelineDefinition } from '$types';

import { footerTimeline, footerTriggerConfig } from './timelines/footer';
import { heroTimeline, heroTriggerConfig } from './timelines/hero';
import { modernTimeline, modernTriggerConfig } from './timelines/modern';
import { panelsTimeline, panelsTriggerConfig } from './timelines/panels';
import { revealTimeline, revealTriggerConfig } from './timelines/reveal';

/**
 * Central registry of all available animations
 * Maps animation names to their timeline creators and configurations
 */
export const timelineRegistry: Record<string, TimelineDefinition> = {
  // Hero animation - typically loads on page load
  hero: {
    create: heroTimeline,
    triggerConfig: heroTriggerConfig,
    defaultTrigger: 'load',
  },

  // Modern section animation - entrance on scroll
  modern: {
    create: modernTimeline,
    triggerConfig: modernTriggerConfig,
    defaultTrigger: 'entrance',
  },

  // Panel animation - scrubs with scroll
  panel: {
    create: panelsTimeline,
    triggerConfig: panelsTriggerConfig,
    defaultTrigger: 'scrub',
  },

  footer: {
    create: footerTimeline,
    triggerConfig: footerTriggerConfig,
    defaultTrigger: 'scrub',
  },

  reveal: {
    create: revealTimeline,
    triggerConfig: revealTriggerConfig,
    defaultTrigger: 'scrub',
  },

  // Add more animations here as needed
  // Example structure:
  // fadeIn: {
  //   create: fadeInTimeline,
  //   triggerConfig: fadeInTriggerConfig,
  //   defaultTrigger: 'entrance',
  // },
};

/**
 * Get a timeline definition by name
 */
export function getTimelineDefinition(name: string): TimelineDefinition | undefined {
  return timelineRegistry[name];
}

/**
 * Check if a timeline exists
 */
export function hasTimeline(name: string): boolean {
  return name in timelineRegistry;
}

/**
 * Get all available timeline names
 */
export function getTimelineNames(): string[] {
  return Object.keys(timelineRegistry);
}
