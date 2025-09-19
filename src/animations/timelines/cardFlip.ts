import { Thresholds } from 'src/types/thresholds';

import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { containerThreshold } from '$utils/containerThreshold';
import { queryElements } from '$utils/queryElements';

export const cardFlipTimeline: TimelineCreator = (
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

  const numberOfCards = cards.length;
  const remainder = numberOfCards % 2;
  const numberOfCardsNeeded = numberOfCards - remainder;

  const leftCards = cards.slice(0, numberOfCardsNeeded / 2);
  const rightCards = cards.slice(numberOfCards - numberOfCardsNeeded / 2);

  const isAboveThreshold = containerThreshold(element, Thresholds.medium, 'above');

  // Main content reveal
  cards.forEach((card, index) => {
    gsap.set(card, {
      zIndex: 4 - index,
      opacity: 1 - index * 0.2,
      y: isAboveThreshold ? `${(index + 1) * 1}rem` : `${index * -100}%`,
    });
  });

  leftCards.forEach((card) => {
    gsap.set(card, { xPercent: isAboveThreshold ? 100 : 0 });
  });

  rightCards.forEach((card) => {
    gsap.set(card, { xPercent: isAboveThreshold ? -100 : 0 });
  });

  // Build animation sequence
  tl.to(cards, { xPercent: 0, opacity: 1, y: 0, stagger: 0.1 });

  return tl;
};

export const cardFlipTriggerConfig: ScrollTriggerConfig = {
  start: 'top 80%',
  end: 'bottom center',
  scrub: false,
  toggleActions: 'play none none none',
};
