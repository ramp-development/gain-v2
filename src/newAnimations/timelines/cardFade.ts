import { Thresholds } from 'src/types/thresholds';

// import { queryElement } from '$utils/queryElement';
import { BaseAnimation } from './base/baseAnimation';

export class CardFadeTimeline extends BaseAnimation {
  protected cards!: HTMLElement[];
  protected leftCards!: HTMLElement[];
  protected rightCards!: HTMLElement[];
  protected remainder!: number;

  protected createTimeline(): void {
    this.timeline.vars.defaults = { stagger: 0.1, duration: 0.5, ease: 'back.inOut' };

    // Find elements to animate
    this.cards = this.queryElements('[data-element="card"]');
    if (!this.cards.length) return;

    const numberOfCards = this.cards.length;
    this.remainder = numberOfCards % 2;
    const numberOfCardsNeeded = numberOfCards - this.remainder;

    this.leftCards = this.cards.slice(0, numberOfCardsNeeded / 2);
    this.rightCards = this.cards.slice(numberOfCards - numberOfCardsNeeded / 2);

    // Build animation sequence
    this.cards.forEach((card, index) => {
      this.timeline.set(card, {
        height: () =>
          `${Math.max(...this.cards.map((card) => card.getBoundingClientRect().height))}px`,
        zIndex: numberOfCards - index,
        opacity: 1 - index * 0.2,
      });
    });

    // Observe container size
    this.element.observeContainer(`(width < ${Thresholds.large}rem)`, (match) => {
      if (match) {
        this.element.observeContainer(`(width < ${Thresholds.small}rem)`, (match) => {
          if (match) this.thresholdSmall();
          else this.thresholdMedium();
        });
      } else {
        this.thresholdLarge();
      }
    });
  }

  protected thresholdSmall(): void {
    this.cards.forEach((card, index) => {
      this.timeline.set(card, {
        x: `${index}rem`,
        y: `${index * -100}%`,
      });
    });

    this.timeline.to(this.cards, {
      x: 0,
      y: 0,
      opacity: 1,
    });
  }

  protected thresholdMedium(): void {
    const rowGap = parseFloat(getComputedStyle(this.element).getPropertyValue('row-gap'));
    const columnGap = parseFloat(getComputedStyle(this.element).getPropertyValue('column-gap'));

    this.timeline.set(this.leftCards[0], {
      x: (index, trigger) => trigger.getBoundingClientRect().width / 2 - 2 * columnGap,
    });

    this.timeline.set(this.leftCards[1], {
      x: (index, trigger) => -(trigger.getBoundingClientRect().width / 2 + 2 * columnGap),
      y: '1rem',
    });

    this.timeline.set(this.rightCards[0], {
      x: (index, trigger) => trigger.getBoundingClientRect().width / 2 + columnGap,
      y: (index, trigger) => trigger.getBoundingClientRect().height * -1,
    });

    this.timeline.set(this.rightCards[1], {
      x: (index, trigger) => -(trigger.getBoundingClientRect().width / 2 - columnGap),
      y: (index, trigger) => trigger.getBoundingClientRect().height * -1 + rowGap,
    });

    this.timeline.to(this.cards, {
      x: 0,
      y: 0,
      opacity: 1,
    });
  }

  protected thresholdLarge(): void {
    this.leftCards.forEach((card, index) => {
      this.timeline.set(card, {
        xPercent: (this.leftCards.length - index - 1) * 100 + (this.remainder === 1 ? 0 : 50),
      });
    });

    this.rightCards.forEach((card, index) => {
      this.timeline.set(card, {
        xPercent: index * -100 - (this.remainder === 1 ? 0 : 50),
      });
    });

    this.cards.forEach((card, index) => {
      this.timeline.set(card, { y: `${index}rem` });
    });

    this.timeline.to(this.cards, { y: 0 });
    this.timeline.to(this.cards, { xPercent: 0, opacity: 1 }, '<0.2');
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'clamp(top 75%)',
      // end: 'clamp(center center)',
      scrub: false,
    };
  }
}
