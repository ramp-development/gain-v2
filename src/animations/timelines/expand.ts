import { attrs } from '$config/constants';
import { debug } from '$utils/debug';

import { BaseAnimation } from './base/baseAnimation';

export class ExpandTimeline extends BaseAnimation {
  protected createTimeline(): void {
    const wrap = this.queryElement(`[${attrs.elements}="wrap"]`);
    if (!wrap) {
      debug('warn', 'expandTimeline', { wrap });
      return;
    }

    // Build animation sequence
    this.timeline.to(wrap, { scale: () => window.innerWidth / this.element.offsetWidth });
    this.timeline.to(wrap, { scale: 1 }, '>2');
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    };
  }
}
