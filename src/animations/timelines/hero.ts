import { attrs } from '$config/constants';
import { Events } from '$events';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

import { panelScale } from '../utils/panelScale';
import { BaseAnimation } from './base/baseAnimation';

export class HeroTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find child elements to animate
    const attr = 'data-hero';
    const nav = queryElement(`.nav_component`);
    const outer = queryElement(`[${attrs.elements}="outer"]`);
    const inner = queryElement(`[${attrs.elements}="inner"]`);
    const background = this.queryElement(`[${attr}="background"]`);
    const title = this.queryElement('h1');

    if (!nav || !outer || !inner || !background || !title) return;

    const firstSpacer = queryElement('.u-section-spacer', inner);
    const sections = queryElements('section', inner);

    // Build animation sequence
    this.timeline.from(nav, { opacity: 0, y: '-1rem' }, '<');
    this.timeline.from(
      inner,
      {
        y: () => firstSpacer?.getBoundingClientRect().height || 128,
        opacity: 0,
        onStart: () => {
          setTimeout(() => {
            this.app.eventBus.emit(Events.HERO_STATIC);
          }, 1000);
        },
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      },
      0
    );
    this.timeline.from(background, { height: '125%' }, '<0.1');

    const splitTitle = new SplitText(title, { type: 'lines', mask: 'lines' });
    this.timeline.from(splitTitle.lines, { yPercent: 100, stagger: 0.01 }, '<0.1');
    this.timeline.from(inner, { scale: () => panelScale() }, '<0.1');
    this.timeline.from(sections, { opacity: 0 }, '<');

    this.timeline.eventCallback('onComplete', () => {
      ScrollTrigger.refresh();
    });
  }
}
