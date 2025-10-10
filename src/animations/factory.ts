import type { AnimationFactory, TimelineConfig } from 'src/types/animations';

import type { BaseAnimation } from './timelines/base/baseAnimation';

/**
 * Constructor type for animation classes
 */
type AnimationConstructor = new (element: HTMLElement) => BaseAnimation;

/**
 * Factory function to create animations with consistent API
 */
export const createAnimationFactory = (AnimationClass: AnimationConstructor): AnimationFactory => {
  return (element: HTMLElement): TimelineConfig => {
    const animation = new AnimationClass(element);
    return animation.build();
  };
};
