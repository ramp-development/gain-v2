import { Thresholds } from 'src/types/thresholds';

// import { containerThreshold } from '$utils/containerThreshold';
import { BaseAnimation } from './base/baseAnimation';

export class CardFlipTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const cards = this.queryElements('[data-element="card"]');
    if (!cards.length) return;

    const numberOfCards = cards.length;
    const remainder = numberOfCards % 2;
    const numberOfCardsNeeded = numberOfCards - remainder;

    const leftCards = cards.slice(0, numberOfCardsNeeded / 2);
    const rightCards = cards.slice(numberOfCards - numberOfCardsNeeded / 2);

    // Build animation sequence
    this.timeline.set(cards, {
      height: () => `${Math.max(...cards.map((card) => card.getBoundingClientRect().height))}px`,
      zIndex: (index) => numberOfCards - index,
      opacity: (index) => 1 - index * 0.2,
    });

    // Observe container size
    this.element.observeContainer(`(width < ${Thresholds.medium}rem)`, (match) => {
      if (match) {
        this.timeline.set(cards, {
          x: (index) => `${index}rem`,
          yPercent: (index) => index * -100,
        });
        this.timeline.to(cards, {
          x: 0,
          opacity: 1,
          yPercent: 0,
          duration: 1,
          ease: 'back.inOut',
          stagger: 0.1,
        });
      } else {
        this.timeline.set(leftCards, { xPercent: 100 });
        this.timeline.set(rightCards, { xPercent: -100 });
        this.timeline.set(cards, { y: (index) => `${index}rem` });

        this.timeline.to(cards, {
          y: 0,
          duration: 0.5,
          ease: 'back.inOut',
          stagger: 0.1,
        });
        this.timeline.to(
          cards,
          { xPercent: 0, opacity: 1, duration: 0.5, ease: 'back.inOut', stagger: 0.1 },
          '<0.2'
        );
      }
    });
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    // const isBelowThreshold = containerThreshold(this.element, Thresholds.medium, 'below');
    return {
      // trigger: this.element,
      // start: 'clamp(top bottom)',
      // end: isBelowThreshold ? 'clamp(top top)' : 'clamp(top center)',
      // scrub: 1,
      trigger: this.element,
      start: 'clamp(top 75%)',
      // end: 'clamp(center center)',
      scrub: false,
    };
  }
}
