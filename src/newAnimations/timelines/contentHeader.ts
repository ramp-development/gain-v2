import { attrs, values } from '$config/constants';

import { BaseAnimation } from './base/baseAnimation';

export class ContentHeaderTimeline extends BaseAnimation {
  protected createTimeline(): void {
    this.timeline.vars.defaults = { ease: 'expo.out' };
    // Find elements to animate
    const heading = this.queryElement(`[${attrs.elements}="${values.heading}"] > *`);
    const paragraphs = this.queryElements(`[${attrs.elements}="${values.paragraph}"] > *`);
    const buttons = this.queryElements(`[${attrs.elements}="${values.button}"]`);
    let isFirstInSequence = true;

    // Build animation sequence
    if (heading) {
      const splitHeading = new SplitText(heading, { type: 'lines', mask: 'lines' });
      this.timeline.from(splitHeading.lines, { yPercent: 100, stagger: 0.1 });
      isFirstInSequence = false;
    }

    if (paragraphs.length > 0) {
      paragraphs.forEach((paragraph, index) => {
        const splitParagraph = new SplitText(paragraph, { type: 'lines', mask: 'lines' });
        this.timeline.from(
          splitParagraph.lines,
          { yPercent: 100, stagger: 0.1 },
          index === 0 && isFirstInSequence ? 0 : index === 0 ? '<0.2' : '<0.05'
        );
      });
      isFirstInSequence = false;
    }

    if (buttons.length > 0) {
      this.timeline.from(
        buttons,
        { opacity: 0, x: '1rem', stagger: 0.1 },
        isFirstInSequence ? 0 : '<0.2'
      );
    }
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'clamp(top 80%)',
      // end: 'clamp(center center)',
      scrub: false,
    };
  }
}
