import type { TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const aiTeamHeroTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  const tl = gsap.timeline({
    defaults: { duration: context?.duration || 1.5, ease: context?.ease || 'expo.inOut' },
  });

  // Find elements to animate
  const backBtn = queryElement('[data-navigate]');
  const profiles = queryElements('[data-profile]', element);
  const ditlItems = queryElements('.ditl_item');

  // Main content reveal
  if (profiles.length) {
    tl.fromTo(
      profiles,
      { opacity: 0, y: '2rem', rotateZ: 0 },
      {
        opacity: 1,
        y: 0,
        rotateZ: (index) => {
          const isEven = index % 2 === 0;
          return isEven ? index * -8 : index * 8;
        },
        stagger: 0.1,
      }
    );
  }

  if (ditlItems.length) {
    tl.fromTo(ditlItems, { opacity: 0, y: '2rem' }, { opacity: 1, y: 0, stagger: 0.1 }, '-=50%');
  }

  if (backBtn) {
    tl.from(backBtn, { opacity: 0, x: '0.5rem' }, '<0.5');
  }

  return tl;
};
