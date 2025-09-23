import { attrs } from '$config/constants';
import { queryElement } from '$utils/queryElement';

export const nav = () => {
  const nav = queryElement(`[${attrs.elements}="nav"]`);
  const inner = queryElement(`[${attrs.elements}="inner"]`);
  const main = queryElement('.page_main');
  const scrollElement = inner || main;
  if (!nav || !scrollElement) return;

  const variant = 'w-variant-144a276f-7272-627f-9552-6194bfeced8d';

  const velocityThreshold = 1000;

  const timeline = gsap.timeline({ paused: true });

  timeline.to(nav, { y: '-100%', duration: 1, ease: 'expo.inOut' });

  ScrollTrigger.create({
    trigger: scrollElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: false,
    onEnter: () => {
      if (inner) nav.classList.add(variant);
    },
    onLeaveBack: () => {
      if (inner) nav.classList.remove(variant);
    },
    onUpdate: (self) => {
      const { direction } = self;
      const velocity = self.getVelocity();

      if (direction === 1 && velocity >= velocityThreshold) {
        timeline.play();
      } else if (direction === -1) {
        timeline.reverse();
      }
    },
  });
};
