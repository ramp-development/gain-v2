import { BaseAnimation } from './baseAnimation';

export class TemplateTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    // Build animation sequence
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
    };
  }
}
