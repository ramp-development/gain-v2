import { BaseAnimation } from './base/baseAnimation';

export class LogosTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const attr = 'data-logos';
    const logos = this.queryElements(`[${attr}="logo"]`);
    if (logos.length === 0) return;

    // Build animation sequence
    this.timeline.fromTo(logos, { yPercent: 100 }, { yPercent: 0, stagger: 0.1 });
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'top 80%',
      scrub: false,
      toggleActions: 'play none none none',
    };
  }
}
