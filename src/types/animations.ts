import type { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Available trigger types for animations
 */
export type TriggerType = 'load' | 'entrance' | 'scrub' | 'event' | 'sequence';

/**
 * Animation instance state
 */
export type AnimationState = 'pending' | 'playing' | 'completed';

/**
 * Animation factory result
 */
export type AnimationFactoryResult = {
  timeline: gsap.core.Timeline | undefined;
  triggerConfig?: ScrollTriggerConfig;
};

/**
 * ScrollTrigger configuration for timeline
 */
export interface ScrollTriggerConfig {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  toggleActions?: string;
  markers?: boolean;
  invalidateOnRefresh?: boolean;
  refreshPriority?: number;
  onUpdate?: (self: ScrollTrigger) => void;
}

/**
 * Timeline creator function signature
 */
export type TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => gsap.core.Timeline | undefined;

/**
 * Timeline definition with its configuration
 */
export interface TimelineDefinition {
  create: TimelineCreator;
  triggerConfig?: ScrollTriggerConfig;
  defaultTrigger?: TriggerType;
}

/**
 * Animation instance tracking
 */
export interface AnimationInstance {
  id: string;
  element: HTMLElement;
  timeline: gsap.core.Timeline;
  type: string; // Animation name (hero, modern, etc.)
  trigger: TriggerType;
  state: AnimationState;
  scrollTrigger?: ScrollTrigger;
  triggerConfig?: ScrollTriggerConfig;
  context?: Record<string, string>;
}

/**
 * Animation registry entry
 */
export interface AnimationRegistryEntry {
  timeline: TimelineCreator;
  config?: ScrollTriggerConfig;
  defaultTrigger?: TriggerType;
}

/**
 * Animation event data
 */
export interface AnimationEventData {
  id: string;
  type: string;
  element: HTMLElement;
  state?: AnimationState;
  progress?: number;
  context?: Record<string, string>;
}

/**
 * Post-hero check result
 */
export interface PostHeroCheck {
  instance: AnimationInstance;
  shouldPlay: boolean;
  reason?: 'passed-trigger' | 'in-viewport' | 'not-ready';
}
