import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElements } from '$utils/queryElements';

/**
 * Panels animation - scrubbed animation tied to scroll
 * Creates parallax and reveal effects as user scrolls
 */
export const panelsTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  // Check if this is the last panel element within its parent
  const parent = element.closest('.panels_list');
  const isLastPanel = (() => {
    if (!parent) return true;

    // Get all panel siblings after this element
    const allPanels = queryElements('[data-animation="panel"]', parent);
    const currentIndex = allPanels.indexOf(element);

    // Check if there are any panel elements after this one
    return currentIndex === allPanels.length - 1;
  })();

  if (isLastPanel) return;

  // Build animation sequence
  const tl = gsap.timeline({ defaults: { ease: context?.ease || 'expo.out' } });
  tl.to(element, { opacity: 0, scale: 0.8, transformOrigin: 'center bottom', duration: 1 });

  return tl;
};

/**
 * ScrollTrigger configuration for scrubbed panels animation
 * Scrubs through animation as user scrolls
 */
export const panelsTriggerConfig: ScrollTriggerConfig = {
  start: 'top top',
  end: 'bottom top',
  scrub: 1,
};
