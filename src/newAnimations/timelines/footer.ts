import { attrs } from '$config/constants';
import { queryElement } from '$utils/queryElement';

import { panelScale } from '../utils/panelScale';
import { BaseAnimation } from './base/baseAnimation';

export class FooterTimeline extends BaseAnimation {
  private attr = 'data-footer';

  protected createTimeline(): void {
    // Find elements to animate
    const { attr } = this;
    const inner = queryElement(`[${attrs.elements}="inner"]`);
    const content = this.queryElement(`[${attr}="content"]`);
    const panel = this.queryElement(`[${attr}="panel"]`);
    const contain = this.queryElement(`[${attr}="contain"]`);

    if (!inner || !content || !panel || !contain) return;

    const firstSpacer = this.queryElement('.u-section-spacer');

    // Build animation sequence
    this.timeline.from(content, {
      y: () => (firstSpacer?.getBoundingClientRect().height || 128) * -1,
      ease: 'none',
      duration: 2,
    });

    this.timeline.to(
      inner,
      {
        scale: () => panelScale(),
        transformOrigin: 'center bottom',
        ease: 'power2.inOut',
        duration: 1.5,
      },
      '<0.5'
    );
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    this.timeline._panelInitialised = false;

    return {
      onEnter: (self) => {
        if (this.timeline._panelInitialised) return;
        const panel = this.queryElement(`[${this.attr}="panel"]`);
        const contain = this.queryElement(`[${this.attr}="contain"]`);
        if (!panel || !contain) return;

        const { start, end } = self;
        const distance = end - start;
        const position = (distance - panel.getBoundingClientRect().height) / distance;
        const duration = this.timeline.duration() * (1 - position);

        this.timeline.from(
          panel,
          {
            y: () => getComputedStyle(contain).paddingTop,
            scale: () => panelScale(),
            transformOrigin: 'center bottom',
            ease: 'none',
            duration,
          },
          `${position * 100}%`
        );

        this.timeline._panelInitialised = true;
      },
      onLeaveBack: () => {
        this.timeline.clearProps();
      },
      trigger: this.element,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1,
    };
  }
}
