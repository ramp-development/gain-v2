import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

/**
 * Modern section animation - entrance animation triggered by scroll
 * Animates content sections with smooth reveals
 */
export const modernTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: context?.duration || 1.5, // Use context duration or fallback
      ease: context?.ease || 'expo.inOut',
    },
  });

  // Find elements to animate
  const eyebrowMarker = queryElement('.eyebrow_marker', element);
  const eyebrowText = queryElement('.eyebrow_text', element);
  const contentBlocks = queryElements('.c-heading > *', element);

  // Main content reveal
  if (eyebrowMarker) {
    tl.from(eyebrowMarker, {
      opacity: 0,
      scale: 0.9,
      duration: 1.5,
    });
  }

  if (eyebrowText) {
    const splitTitle = new SplitText(eyebrowText, {
      type: 'lines',
      mask: 'lines',
    });

    tl.from(
      splitTitle.lines,
      {
        opacity: 0,
        x: '-1rem',
        duration: 1.5,
        stagger: 0.1,
      },
      0.1
    );
  }

  if (contentBlocks) {
    contentBlocks.forEach((block, index) => {
      const splitTitle = new SplitText(block, {
        type: 'lines',
        mask: 'lines',
      });

      const position = index === 0 ? 0.1 : '>-1.5';

      tl.from(
        splitTitle.lines,
        {
          yPercent: 100,
          stagger: 0.15,
        },
        position
      );
    });
  }

  return tl;
};

/**
 * ScrollTrigger configuration for modern animation
 * Triggers when element is 80% from top of viewport
 */
export const modernTriggerConfig: ScrollTriggerConfig = {
  start: 'top 80%',
  end: 'bottom top',
  scrub: false,
  toggleActions: 'play none none none',
};
