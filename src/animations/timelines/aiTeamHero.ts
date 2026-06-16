import { BaseAnimation } from './base/baseAnimation';

export class AITeamHeroTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const profiles = this.queryElements('[data-profile]').reverse();

    let rotationIndex = 0;

    // Build animation sequence
    profiles.forEach((profile, index) => {
      const isEven = index % 2 === 0;
      if (!isEven) rotationIndex += 1;
      const rotateZ = isEven ? rotationIndex * -4 : rotationIndex * 4;
      this.timeline.fromTo(
        profile,
        { opacity: 0, y: '2rem', rotateZ: 0 },
        { opacity: 1, y: 0, rotateZ },
        `${index === 0 ? 0 : '<0.1'}`
      );
    });
  }
}
