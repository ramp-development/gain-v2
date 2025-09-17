import { scaleX, scaleY } from '$config/constants';
import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';

export const footerTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({ defaults: { duration: context?.duration || 1, ease: 'none' } });

  // Find child elements to animate
  const inner = queryElement('[data-element="inner"]');
  const footer = queryElement('footer', element);

  if (inner) {
    tl.fromTo(
      inner,
      { y: 0, scaleX: 1, scaleY: 1 },
      {
        y: 'calc(var(--radius--section) * 100)',
        transformOrigin: 'center bottom',
        scaleX: () => scaleX(),
        scaleY: () => scaleY(),
      }
    );
  }

  if (footer) {
    tl.from(footer, { opacity: 0.5, yPercent: 10 }, 0);
  }

  return tl;
};

export const footerTriggerConfig: ScrollTriggerConfig = {
  start: 'top center',
  end: 'bottom bottom',
  scrub: 1,
};
