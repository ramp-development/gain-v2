import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const cardFadeTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  console.log('cardFadeTimeline', { element, context });

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: context?.duration || 1.5, ease: context?.ease || 'expo.inOut' },
  });

  // Find elements to animate
  const cards = queryElements('[data-element="card"]', element);
  if (!cards.length) return;

  // Build animation sequence
  cards.forEach((card, index) => {
    const background = queryElement<HTMLElement>('[data-card="background"]', card);
    tl.from(card, { y: '2rem', opacity: 0 }, `${index * 0.2}`);
    if (background) tl.from(background, { height: '0%' }, '<');
  });

  return tl;
};

export const cardFlipTriggerConfig: ScrollTriggerConfig = {
  start: 'top center',
  end: 'bottom center',
  scrub: false,
  toggleActions: 'play none none none',
};
