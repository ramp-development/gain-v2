import type { ScrollTriggerConfig, TimelineCreator } from '$types';

export const blogCardTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: context?.duration || 1.5,
      ease: context?.ease || 'expo.inOut',
      clearProps: true,
    },
  });

  // Find elements to animate
  const parent = element.parentElement;

  // Main content reveal
  gsap.set(element, { opacity: 0, yPercent: 10 });
  gsap.set(parent, { rotateX: 5 });
  tl.to(element, { opacity: 1, yPercent: 0 });
  tl.to(parent, { rotateX: 0 }, '<');

  return tl;
};

export const blogCardTriggerConfig: ScrollTriggerConfig = {
  start: 'top bottom',
  scrub: false,
  toggleActions: 'play none none none',
};
