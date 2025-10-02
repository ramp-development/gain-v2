import { queryElements } from '$utils/queryElements';

import { BaseAnimation } from './base/baseAnimation';

export class PanelTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Check if this is the last panel element within its parent
    const parent = this.element.closest('.panels_list');
    const isLastPanel = (() => {
      if (!parent) return true;

      // Get all panel siblings after this element
      const allPanels = queryElements('[data-animation="panel"]', parent);
      const currentIndex = allPanels.indexOf(this.element);

      // Check if there are any panel elements after this one
      return currentIndex === allPanels.length - 1;
    })();

    if (isLastPanel) return;

    // Build animation sequence
    this.timeline.to(this.element, {
      opacity: 0,
      scale: 0.8,
      transformOrigin: 'center bottom',
      duration: 1,
    });
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    };
  }
}
