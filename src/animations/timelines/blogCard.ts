import { BaseAnimation } from './base/baseAnimation';

export class BlogCardTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const parent = this.element.parentElement;

    // Build animation sequence
    this.timeline.set(this.element, { opacity: 0, yPercent: 10 });
    this.timeline.set(parent, { rotateX: 5 });
    this.timeline.to(this.element, { opacity: 1, yPercent: 0 });
    this.timeline.to(parent, { rotateX: 0 }, '<');
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'top bottom',
      scrub: false,
      toggleActions: 'play none none none',
    };
  }
}
