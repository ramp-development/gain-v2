import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElements } from '$utils/queryElements';

export const logosTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: context?.duration || 1.5, ease: context?.ease || 'expo.inOut' },
  });

  // Find elements to animate
  const attr = 'data-logos';
  const logos = queryElements<HTMLElement>(`[${attr}="logo"]`, element);
  if (logos.length === 0) return;

  // Main content reveal
  tl.fromTo(logos, { yPercent: 100 }, { yPercent: 0, stagger: 0.1 });

  return tl;
};

export const logosTriggerConfig: ScrollTriggerConfig = {
  start: 'top 80%',
  scrub: false,
  toggleActions: 'play none none none',
};
