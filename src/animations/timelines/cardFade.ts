import { Thresholds } from 'src/types/thresholds';

import { attrs } from '$config/constants';

// import { queryElement } from '$utils/queryElement';
import { BaseAnimation } from './base/baseAnimation';

export class CardFadeTimeline extends BaseAnimation {
  protected cards: HTMLElement[];
  protected numberOfCards: number;
  protected leftCards: HTMLElement[];
  protected rightCards: HTMLElement[];
  protected remainder: number;
  protected duration: number;

  constructor(element: HTMLElement) {
    super(element);

    this.cards = this.queryElements(`[${attrs.elements}="card"]`);

    this.numberOfCards = this.cards.length;
    this.remainder = this.numberOfCards % 2;
    const numberOfCardsNeeded = this.numberOfCards - this.remainder;

    this.leftCards = this.cards.slice(0, numberOfCardsNeeded / 2);
    this.rightCards = this.cards.slice(this.numberOfCards - numberOfCardsNeeded / 2);

    this.duration = 1;
    this.timeline.vars.defaults = { stagger: 0.05, duration: this.duration, ease: 'back.inOut' };
  }

  protected createTimeline(): void {
    // Build animation sequence
    this.cards.forEach((card, index) => {
      this.timeline.set(card, {
        height: () => `${Math.max(...this.cards.map((card) => card.offsetHeight))}px`,
        zIndex: this.numberOfCards - index,
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
        x: `${index * 0.5}rem`,
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
      this.timeline.set(card, { y: `${index * 0.5}rem` });
    });

    this.timeline.addLabel('cardStart');
    this.timeline.to(this.cards, {
      y: gsap.utils.random(-8, 8),
      duration: this.duration / 2,
    });
    this.timeline.to(this.cards, { y: 0, duration: this.duration / 2 });
    this.timeline.to(this.cards, { xPercent: 0, opacity: 1 }, 'cardStart+=0.1');
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'clamp(top 90%)',
      scrub: false,
    };
  }
}
