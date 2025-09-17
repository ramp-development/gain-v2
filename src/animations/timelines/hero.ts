import { scaleX, scaleY } from '$config/constants';
import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';

/**
 * Hero animation - typically plays on page load
 * Animates the main hero section with staggered reveals
 */
export const heroTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: context?.duration || 2, // Use context duration or default
      ease: context?.ease || 'expo.inOut',
    },
  });

  // Find child elements to animate
  const nav = queryElement(`.nav_component`);
  const inner = queryElement('[data-element="inner"]');
  const title = queryElement('h1', element);

  // Build animation sequence
  if (nav) {
    tl.from(nav, {
      opacity: 0,
      y: '-1rem',
    });
  }

  if (inner) {
    tl.from(
      inner,
      {
        opacity: 0,
        y: '10rem',
        transformOrigin: 'center top',
        scaleX: () => scaleX(), // Call the function to get current value
        scaleY: () => scaleY(),
      },
      0
    );
  }

  if (title) {
    // Create SplitText instance to split the title into lines
    const splitTitle = new SplitText(title, {
      type: 'lines',
      mask: 'lines',
    });

    // Animate the masks to reveal the text
    tl.from(
      splitTitle.lines,
      {
        yPercent: 100,
        stagger: 0.01,
      },
      0.2
    );
  }

  // Add any context-specific modifications
  if (context?.speed === 'fast') {
    tl.timeScale(1.5);
  } else if (context?.speed === 'slow') {
    tl.timeScale(0.7);
  }

  return tl;
};

/**
 * Hero doesn't use ScrollTrigger - it's triggered on load
 */
export const heroTriggerConfig: ScrollTriggerConfig = {
  start: 'bottom bottom',
  end: 'bottom top',
  scrub: false,
  toggleActions: 'play none none none',
};
