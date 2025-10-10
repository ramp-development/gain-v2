// types/animations.ts
export interface TimelineConfig {
  timeline: gsap.core.Timeline;
  scrollTriggerConfig?: ScrollTrigger.Vars;
}

export type AnimationFactory = (element: HTMLElement) => TimelineConfig;

export interface AnimationRegistry {
  [key: string]: AnimationFactory;
}

export interface AnimationInstance {
  timeline: gsap.core.Timeline;
  scrollTrigger?: ScrollTrigger;
  scrollTriggerConfig?: ScrollTrigger.Vars;
  relinked?: boolean;
}

export interface QueuedAnimation {
  element: HTMLElement;
  timeline: gsap.core.Timeline;
  scrollTrigger?: ScrollTrigger;
  scrollTriggerConfig?: ScrollTrigger.Vars;
}
