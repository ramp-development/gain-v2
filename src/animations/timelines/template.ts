import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const templateTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: context?.duration || 1.5, ease: context?.ease || 'expo.inOut' },
  });

  // Find elements to animate

  // Main content reveal

  return tl;
};

export const templateTriggerConfig: ScrollTriggerConfig = {
  start: 'top 80%',
  end: 'bottom top',
  scrub: false,
  toggleActions: 'play none none none',
};
