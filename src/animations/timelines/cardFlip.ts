import { Thresholds } from 'src/types/thresholds';

import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { containerThreshold } from '$utils/containerThreshold';
import { debug } from '$utils/debug';
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

  const isAboveThreshold = () => containerThreshold(element, Thresholds.large, 'above');

  // // Build animation sequence
  gsap.set(cards, {
    height: () => {
      const maxCardHeight = Math.max(...cards.map((card) => card.getBoundingClientRect().height));
      return `${maxCardHeight}px`;
    },
    zIndex: (index) => 4 - index,
    opacity: (index) => 1 - index * 0.2,
    y: (index) => (isAboveThreshold() ? `${index + 3}rem` : `${index * -100}%`),
  });

  element.observeContainer(`(width < ${Thresholds.large}rem)`, (match) => {
    if (match) {
      debug('log', 'cardFlipTimeline: (width < Thresholds.large)');
      gsap.set(cards, { x: (index) => `${index}rem` });
    } else {
      debug('log', 'cardFlipTimeline: (width >= Thresholds.large)');
      gsap.set(leftCards, { xPercent: 100 });
      gsap.set(rightCards, { xPercent: -100 });
    }
  });

  // Build animation sequence
  tl.to(cards, { x: 0, xPercent: 0, opacity: 1, y: 0, stagger: 0.2 });

  return tl;
};

export const cardFlipTriggerConfig: ScrollTriggerConfig = {
  start: 'top 80%',
  end: 'bottom center',
  scrub: false,
  toggleActions: 'play none none none',
};
