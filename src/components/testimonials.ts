import { Thresholds } from 'src/types/thresholds';

import { containerThreshold } from '$utils/containerThreshold';
import { queryElement } from '$utils/queryElement';

type Threshold = 'small' | 'medium' | 'large';
export const testimonials = () => {
  const attr = 'data-testimonials';
  const component = queryElement<HTMLElement>(`.splide[${attr}="component"]`);
  if (!component) return;

  const getThreshold = (): Threshold => {
    const isBelowLarge = containerThreshold(component, Thresholds.large, 'below');
    const isBelowMedium = containerThreshold(component, Thresholds.medium, 'below');
    return isBelowMedium ? 'small' : isBelowLarge ? 'medium' : 'large';
  };

  let threshold = getThreshold();
  handleOverlay(threshold);

  const createOptions = (threshold: Threshold) => {
    return {
      type: 'loop',
      perPage: threshold === 'small' ? 1 : threshold === 'medium' ? 2 : 3,
      gap: 'var(--site--gutter)',
      autoplay: true,
      interval: 4000,
      pagination: false,
      arrows: false,
    };
  };

  let splide = new Splide(component, createOptions(threshold));
  splide.mount();

  window.addEventListener('resize', () => {
    const newThreshold = getThreshold();
    if (newThreshold !== threshold) {
      threshold = newThreshold;
      splide.destroy(true);
      splide = new Splide(component, createOptions(threshold));
      splide.mount();
      handleOverlay(threshold);
    }
  });

  function handleOverlay(threshold: Threshold) {
    const overlay = queryElement<HTMLElement>(`[${attr}="overlay"]`);
    if (!overlay) return;

    if (threshold === 'large') overlay.style.removeProperty('display');
    else overlay.style.display = 'none';
  }
};
