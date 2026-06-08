import { Thresholds } from 'src/types/thresholds';

import { attrs } from '$config/constants';
import { queryElement } from '$utils/queryElement';

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
    setTimeout(() => {
      // Build animation sequence
      const maxCardHeight = Math.max(...this.cards.map((card) => card.offsetHeight));
      const maxCardNumberHeight = Math.max(
        ...this.cards.map(
          (card) => queryElement(`[data-element="card-number"]`, card)?.offsetHeight || 0
        )
      );
      const maxCardTitleHeight = Math.max(
        ...this.cards.map(
          (card) => queryElement(`[data-element="card-title"]`, card)?.offsetHeight || 0
        )
      );
      const maxCardSubHeight = Math.max(
        ...this.cards.map(
          (card) => queryElement(`[data-element="card-sub"]`, card)?.offsetHeight || 0
        )
      );

      this.cards.forEach((card, index) => {
        const cardNumber = queryElement(`[data-element="card-number"]`, card);
        const cardTitle = queryElement(`[data-element="card-title"]`, card);
        const cardSub = queryElement(`[data-element="card-sub"]`, card);
        if (!cardNumber || !cardTitle || !cardSub) return;

        gsap.set(cardNumber, { height: `${maxCardNumberHeight}px` });
        gsap.set(cardTitle, { height: `${maxCardTitleHeight}px` });
        gsap.set(cardSub, { height: `${maxCardSubHeight}px` });
        gsap.set(card, {
          height: () => `${maxCardHeight}px`,
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
    }, 250);
  }

  protected thresholdSmall(): void {
    this.cards.forEach((card, index) => {
      gsap.set(card, {
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

    gsap.set(this.leftCards[0], {
      x: (index, trigger) => trigger.getBoundingClientRect().width / 2 - 2 * columnGap,
    });

    gsap.set(this.leftCards[1], {
      x: (index, trigger) => -(trigger.getBoundingClientRect().width / 2 + 2 * columnGap),
      y: '1rem',
    });

    gsap.set(this.rightCards[0], {
      x: (index, trigger) => trigger.getBoundingClientRect().width / 2 + columnGap,
      y: (index, trigger) => trigger.getBoundingClientRect().height * -1,
    });

    gsap.set(this.rightCards[1], {
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
      gsap.set(card, {
        xPercent: (this.leftCards.length - index - 1) * 100 + (this.remainder === 1 ? 0 : 50),
      });
    });

    this.rightCards.forEach((card, index) => {
      gsap.set(card, {
        xPercent: index * -100 - (this.remainder === 1 ? 0 : 50),
      });
    });

    this.cards.forEach((card, index) => {
      gsap.set(card, { y: `${index * 0.5}rem` });
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
