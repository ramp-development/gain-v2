import { debug } from '$utils/debug';
import { queryElement } from '$utils/queryElement';

import { BaseAnimation } from './base/baseAnimation';

export class RevealTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const attr = 'data-reveal';
    const container = this.element.closest<HTMLElement>(`[${attr}="container"]`);
    const background = this.queryElement(`[${attr}="background"]`);
    const bottom = this.queryElement(`[${attr}="bottom"]`);
    const top = this.queryElement(`[${attr}="top"]`);

    if (!container || !background || !bottom || !top) {
      debug('warn', 'revealTimeline', { container, background, bottom, top });
      return;
    }

    // Build animation sequence
    container.observeContainer('(width < 48rem)', (match) => {
      if (match) {
        gsap.set(top, { minHeight: bottom.getBoundingClientRect().height });
        this.timeline.fromTo(
          background,
          { height: top.getBoundingClientRect().height },
          { height: '100%' }
        );
        this.timeline.from(bottom, { yPercent: -100 }, '<');
      } else {
        this.timeline.from(background, { width: '50%' });
        this.timeline.from(bottom, { xPercent: 50 }, '<');
        this.timeline.from(top, { xPercent: -50 }, '<');
      }
    });
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: this.getStart(),
      end: 'bottom center',
      scrub: 1,
    };
  }

  private getStart(): string {
    const firstReveal = queryElement<HTMLElement>('[data-animation="reveal"]');
    if (!firstReveal) return 'top center';

    const firstRect = firstReveal.getBoundingClientRect();
    const { top, height } = firstRect;

    const windowHeight = window.innerHeight;
    const center = windowHeight / 2;

    const belowCenterDistance = center + height;
    const belowCenterPercentage = belowCenterDistance / windowHeight;

    const startingPositionPercentage = top / windowHeight;

    const percentage =
      startingPositionPercentage >= 1
        ? belowCenterPercentage
        : startingPositionPercentage >= belowCenterPercentage
          ? startingPositionPercentage
          : belowCenterPercentage;

    return `top ${percentage * 100}%`;
  }
}
