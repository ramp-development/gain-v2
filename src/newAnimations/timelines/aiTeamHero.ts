import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

import { BaseAnimation } from './base/baseAnimation';

export class AITeamHeroTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const backBtn = queryElement('[data-navigate]');
    const profiles = this.queryElements('[data-profile]');
    const ditlItems = queryElements('.ditl_item');

    // Build animation sequence
    if (profiles.length) {
      this.timeline.fromTo(
        profiles,
        { opacity: 0, y: '2rem', rotateZ: 0 },
        {
          opacity: 1,
          y: 0,
          rotateZ: (index) => {
            const isEven = index % 2 === 0;
            return isEven ? index * -8 : index * 8;
          },
          stagger: 0.1,
        }
      );
    }

    if (ditlItems.length) {
      this.timeline.fromTo(
        ditlItems,
        { opacity: 0, y: '2rem' },
        { opacity: 1, y: 0, stagger: 0.1 },
        '-=50%'
      );
    }

    if (backBtn) {
      this.timeline.from(backBtn, { opacity: 0, x: '0.5rem' }, '<0.5');
    }
  }
}
