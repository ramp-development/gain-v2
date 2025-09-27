import { attrs, values } from '$config/constants';
import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const contentHeaderTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: context?.duration || 1.5, ease: context?.ease || 'expo.inOut' },
  });

  // Find elements to animate
  const heading = queryElement(`[${attrs.elements}="${values.heading}"] > *`, element);
  const paragraphs = queryElements(`[${attrs.elements}="${values.paragraph}"] > *`, element);
  const buttons = queryElements(`[${attrs.elements}="${values.button}"]`, element);
  let isFirstInSequence = true;

  // Main content reveal
  if (heading) {
    const splitHeading = new SplitText(heading, { type: 'lines', mask: 'lines' });
    tl.from(splitHeading.lines, { yPercent: 100, stagger: 0.1 });
    isFirstInSequence = false;
  }

  if (paragraphs.length > 0) {
    paragraphs.forEach((paragraph, index) => {
      const splitParagraph = new SplitText(paragraph, { type: 'lines', mask: 'lines' });
      tl.from(
        splitParagraph.lines,
        { yPercent: 100, stagger: 0.1 },
        index === 0 && isFirstInSequence ? 0 : index === 0 ? '<0.2' : '<0.05'
      );
    });
    isFirstInSequence = false;
  }

  if (buttons.length > 0) {
    tl.from(buttons, { opacity: 0, x: '1rem', stagger: 0.1 }, isFirstInSequence ? 0 : '<0.2');
  }

  return tl;
};

export const contentHeaderTriggerConfig: ScrollTriggerConfig = {
  start: 'top 80%',
  end: 'bottom top',
  scrub: false,
  toggleActions: 'play none none none',
};
