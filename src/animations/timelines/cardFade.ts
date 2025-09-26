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

  // set the min-height of the cards to the tallest card
  const setHeights = () => {
    cards.forEach((card) => card.style.removeProperty('min-height'));
    const maxHeight = Math.max(...cards.map((card) => card.getBoundingClientRect().height));
    cards.forEach((card) => {
      card.style.minHeight = `${maxHeight}px`;
    });
  };

  setHeights();
  window.addEventListener('resize', setHeights);

  // Build animation sequence
  cards.forEach((card, index) => {
    tl.set(card, {
      minHeight: () => Math.max(...cards.map((card) => card.getBoundingClientRect().height)),
    });
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
