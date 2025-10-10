import { BaseAnimation } from './base/baseAnimation';

export class DitlTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const ditlItems = this.queryElements('.ditl_item');
    // Build animation sequence
    this.timeline.fromTo(
      ditlItems,
      { opacity: 0, y: '2rem' },
      { opacity: 1, y: 0, stagger: 0.1 },
      '-=50%'
    );
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'top 80%',
      scrub: false,
    };
  }
}
