import { attrs } from '$config/constants';
import { debug } from '$utils/debug';
import { queryElement } from '$utils/queryElement';

import { panelScale } from '../utils/panelScale';
import { BaseAnimation } from './base/baseAnimation';

export class FooterTimeline extends BaseAnimation {
  private attr = 'data-footer';
  private inner: HTMLElement;
  private content: HTMLElement;
  private panel: HTMLElement;
  private contain: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);

    this.inner = queryElement(`[${attrs.elements}="inner"]`) as HTMLElement;
    this.content = this.queryElement(`[${this.attr}="content"]`) as HTMLElement;
    this.panel = this.queryElement(`[${this.attr}="panel"]`) as HTMLElement;
    this.contain = this.queryElement(`[${this.attr}="contain"]`) as HTMLElement;
  }

  protected createTimeline(): void {
    if (!this.inner || !this.content || !this.panel || !this.contain) {
      debug('warn', 'footerTimeline', {
        inner: this.inner,
        content: this.content,
        panel: this.panel,
        contain: this.contain,
      });
      return;
    }

    const firstSpacer = this.queryElement('.u-section-spacer');

    // Build animation sequence
    this.timeline.fromTo(
      this.content,
      {
        y: () => (firstSpacer?.offsetHeight || 128) * -1,
        ease: 'none',
        duration: 2,
      },
      { y: 0 }
    );

    this.timeline.fromTo(
      this.inner,
      { scale: 1 },
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
        if (!this.panel || !this.contain) return;

        const { start, end } = self;
        const distance = end - start;
        const position = (distance - this.panel.offsetHeight) / distance;
        const duration = this.timeline.duration() * (1 - position);

        this.timeline.fromTo(
          this.panel,
          {
            y: () => getComputedStyle(this.contain).paddingTop,
            scale: () => panelScale(),
            transformOrigin: 'center bottom',
            ease: 'power2.inOut',
            duration,
          },
          { y: 0, scale: 1 },
          `${position * 100}%`
        );

        this.timeline._panelInitialised = true;
      },
      onLeaveBack: () => {
        ScrollTrigger.refresh();
      },
      trigger: this.element,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1,
    };
  }
}
