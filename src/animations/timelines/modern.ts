import { debug } from '$utils/debug';

import { BaseAnimation } from './base/baseAnimation';

export class ModernTimeline extends BaseAnimation {
  protected createTimeline(): void {
    this.timeline.vars.defaults = { ease: 'expo.out' };

    // Find elements to animate
    const eyebrowMarker = this.queryElement('.eyebrow_marker');
    const eyebrowText = this.queryElement('.eyebrow_text');
    const contentBlocks = this.queryElements('.c-heading > *');

    if (!eyebrowMarker || !eyebrowText || !contentBlocks) {
      debug('warn', 'modernTimeline', { eyebrowMarker, eyebrowText, contentBlocks });
      return;
    }

    // Build animation sequence
    this.timeline.from(eyebrowMarker, { opacity: 0, scale: 0.9, duration: 1 });

    const splitTitle = new SplitText(eyebrowText, { type: 'lines', mask: 'lines' });
    this.timeline.from(
      splitTitle.lines,
      {
        opacity: 0,
        x: '-1rem',
        duration: 1.5,
        stagger: 0.1,
      },
      '<'
    );

    contentBlocks.forEach((block, index) => {
      const splitTitle = new SplitText(block, { type: 'lines', mask: 'lines' });
      const position = index === 0 ? '<' : '<0.1';

      this.timeline.from(splitTitle.lines, { yPercent: 100, stagger: 0.1 }, position);
    });
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'clamp(top 80%)',
      scrub: false,
    };
  }
}
