import { Thresholds } from 'src/types/thresholds';

import { attrs } from '$config/constants';

// import { containerThreshold } from '$utils/containerThreshold';
import { BaseAnimation } from './base/baseAnimation';

export class CardFlipTimeline extends BaseAnimation {
  protected duration: number;

  constructor(element: HTMLElement) {
    super(element);

    this.duration = 1;
  }

  protected createTimeline(): void {
    // Find elements to animate
    const cards = this.queryElements(`[${attrs.elements}="card"]`);
    if (!cards.length) return;

    const numberOfCards = cards.length;
    const remainder = numberOfCards % 2;
    const numberOfCardsNeeded = numberOfCards - remainder;

    const leftCards = cards.slice(0, numberOfCardsNeeded / 2);
    const rightCards = cards.slice(numberOfCards - numberOfCardsNeeded / 2);

    // Build animation sequence
    this.timeline.set(cards, {
      height: () => `${Math.max(...cards.map((card) => card.offsetHeight))}px`,
      zIndex: (index) => numberOfCards - index,
      opacity: (index) => 1 - index * 0.2,
    });

    // Observe container size
    this.element.observeContainer(`(width < ${Thresholds.medium}rem)`, (match) => {
      if (match) {
        this.timeline.set(cards, {
          x: (index) => `${index * 0.5}rem`,
          yPercent: (index) => index * -100,
        });
        this.timeline.to(cards, {
          x: 0,
          opacity: 1,
          yPercent: 0,
          duration: this.duration,
          ease: 'back.inOut',
          stagger: 0.05,
        });
      } else {
        this.timeline.set(leftCards, { xPercent: 100 });
        this.timeline.set(rightCards, { xPercent: -100 });
        this.timeline.set(cards, { y: (index) => `${index}rem` });

        this.timeline.addLabel('cardStart');
        this.timeline.to(cards, {
          y: gsap.utils.random(-8, 8),
          duration: this.duration / 2,
        });
        this.timeline.to(cards, {
          y: 0,
          duration: this.duration / 2,
          ease: 'back.inOut',
          stagger: 0.05,
        });
        this.timeline.to(
          cards,
          { xPercent: 0, opacity: 1, duration: this.duration, ease: 'back.inOut', stagger: 0.05 },
          'cardStart+=0.1'
        );
      }
    });
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'clamp(top 90%)',
      scrub: false,
    };
  }
}
