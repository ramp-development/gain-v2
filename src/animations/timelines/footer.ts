import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const footerTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    defaults: { duration: context?.duration || 1, ease: 'none', clearProps: true },
  });

  // Find child elements to animate
  const inner = queryElement('[data-element="inner"]');
  const footer = queryElement('footer', element);

  if (inner) {
    tl.fromTo(
      inner,
      { y: 0, scaleX: 1, scaleY: 1 },
      {
        y: () => {
          const spacers = queryElements('.u-section-spacer');
          const lastSpacer = spacers[spacers.length - 1];
          return (lastSpacer ? lastSpacer.getBoundingClientRect().height : 160) * -1;
        },
        transformOrigin: 'center bottom',
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
