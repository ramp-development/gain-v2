import { queryElements } from '$utils/queryElements';

import { BaseAnimation } from './base/baseAnimation';

export class PanelTimeline extends BaseAnimation {
  protected createTimeline(): void {
    if (this.checkIfLastPanel()) return;

    // Build animation sequence
    this.timeline.to(this.element, {
      opacity: 0,
      ease: 'power2.inOut',
    });

    this.timeline.to(
      this.element,
      {
        scale: 0.8,
        transformOrigin: 'center bottom',
      },
      '<'
    );
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    };
  }

  protected checkIfLastPanel(): boolean {
    const parent = this.element.closest('.panels_list');
    if (!parent) return true;

    // Get all panel siblings after this element
    const allPanels = queryElements('[data-animation="panel"]', parent);
    const currentIndex = allPanels.indexOf(this.element);

    // Check if there are any panel elements after this one
    return currentIndex === allPanels.length - 1;
  }
}
