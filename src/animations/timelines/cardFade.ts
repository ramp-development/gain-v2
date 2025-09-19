import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElements } from '$utils/queryElements';

export const cardFadeTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: context?.duration || 1.5, ease: context?.ease || 'expo.inOut' },
  });

  // Find elements to animate
  const cards = queryElements('[data-element="card"]', element);
  if (!cards.length) return;

  // Build animation sequence
  tl.from(cards, { y: '1.5rem', opacity: 0, stagger: 0.1 });

  return tl;
};

export const cardFlipTriggerConfig: ScrollTriggerConfig = {
  start: 'top center',
  end: 'bottom center',
  scrub: false,
  toggleActions: 'play none none none',
};
