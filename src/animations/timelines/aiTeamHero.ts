import { BaseAnimation } from './base/baseAnimation';

export class AITeamHeroTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const profiles = this.queryElements('[data-profile]');

    // Build animation sequence
    profiles.forEach((profile, index) => {
      const isEven = index % 2 === 0;
      const rotateZ = isEven ? index * -4 : index * 4;
      this.timeline.fromTo(
        profile,
        { opacity: 0, y: '2rem', rotateZ: 0 },
        { opacity: 1, y: 0, rotateZ },
        `${index === 0 ? 0 : '<0.1'}`
      );
    });
  }
}
