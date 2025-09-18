import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';

/**
 * Hero animation - typically plays on page load
 * Animates the main hero section with staggered reveals
 */
export const revealTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({ defaults: { ease: context?.ease || 'expo.inOut' } });

  // Find child elements to animate
  const background = queryElement('[data-reveal="background"]', element);
  const bottom = queryElement('[data-reveal="bottom"]', element);
  const top = queryElement('[data-reveal="top"]', element);
  if (!background || !bottom || !top) return;

  // Build animation sequence
  tl.from(background, { width: '50%' });
  tl.from(bottom, { xPercent: 50 }, '<');
  tl.from(top, { xPercent: -50 }, '<');

  // Add any context-specific modifications
  if (context?.speed === 'fast') {
    tl.timeScale(1.5);
  } else if (context?.speed === 'slow') {
    tl.timeScale(0.7);
  }

  return tl;
};

const getStart = (): string => {
  const firstReveal = queryElement('[data-animation="reveal"]');
  if (!firstReveal) return 'top center';

  const firstRect = firstReveal.getBoundingClientRect();
  const { height, top } = firstRect;

  const windowHeight = window.innerHeight;
  const center = windowHeight / 2;

  const belowCenterDistance = center + height;
  const belowCenterPercentage = belowCenterDistance / windowHeight;

  const startingPositionPercentage = top / windowHeight;

  const percentage =
    startingPositionPercentage >= 1
      ? belowCenterPercentage
      : startingPositionPercentage >= belowCenterPercentage
        ? startingPositionPercentage
        : belowCenterPercentage;

  return `top ${percentage * 100}%`;
};

export const revealTriggerConfig: ScrollTriggerConfig = {
  start: getStart(),
  end: 'bottom center',
  scrub: 1,
};
