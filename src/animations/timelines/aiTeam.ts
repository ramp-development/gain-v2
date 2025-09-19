import { attrs } from '$config/constants';
import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const aiTeamTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  // Find elements to animate
  const track = queryElement(`[${attrs.elements}="track"]`, element);
  if (!track) return;
  const wrap = queryElement(`[${attrs.elements}="wrap"]`, track);
  if (!wrap) return;

  const links = queryElements(`[${attrs.elements}="link"]`, wrap);
  const backgrounds = queryElements(`[${attrs.elements}="background"]`, wrap);
  const thumbnails = queryElements(`[${attrs.elements}="thumbnail"]`, wrap);
  const names = queryElements(`[${attrs.elements}="name"]`, wrap);
  const roles = queryElements(`[${attrs.elements}="role"]`, wrap);

  // Position elements as needed
  const wrapHeight = wrap.getBoundingClientRect().height;
  track.style.height = `${wrapHeight * 4}px`;
  wrap.style.top = `${(window.innerHeight - wrapHeight) / 2}px`;

  const tl = gsap.timeline({ defaults: { ease: context?.ease || 'none' } });

  links.forEach((link, index) => {
    if (index === 0) {
      gsap.set(link, {
        backgroundColor: 'var(--swatch--orange-2)',
        color: 'var(--swatch--dark-900)',
      });
    } else {
      gsap.set(backgrounds[index], { '--clip': '100%' });
      gsap.set(thumbnails[index], { '--clip': '100%' });
    }

    if (index !== 0)
      tl.to(link, {
        backgroundColor: 'var(--swatch--orange-2)',
        color: 'var(--swatch--dark-900)',
      });
    tl.to(
      links[index - 1],
      {
        backgroundColor: 'transparent',
        color: 'var(--swatch--white)',
      },
      '<'
    );
    tl.to(backgrounds[index], { '--clip': '0%' }, '<0.1');
    tl.to(thumbnails[index], { '--clip': '0%' }, '<0.1');
    tl.to(names, { yPercent: index * -100, stagger: 0.05 }, '<0.1');
    tl.to(roles, { yPercent: index * -100, stagger: 0.05 }, '<0.1');
  });
  return tl;
};

const getStartAndEnd = (): { start: string; end: string } => {
  const element = queryElement(`[${attrs.animations}="aiTeam"]`);
  if (!element) return { start: 'top top', end: 'bottom bottom' };
  const wrap = queryElement(`[${attrs.elements}="wrap"]`, element);
  if (!wrap) return { start: 'top top', end: 'bottom bottom' };
  const wrapHeight = wrap.getBoundingClientRect().height;
  const topAndBottom = (window.innerHeight - wrapHeight) / 2;
  return {
    start: `top ${topAndBottom}`,
    end: `bottom ${window.innerHeight - topAndBottom}`,
  };
};

/**
 * ScrollTrigger configuration for scrubbed panels animation
 * Scrubs through animation as user scrolls
 */
export const aiTeamTriggerConfig: ScrollTriggerConfig = {
  start: getStartAndEnd().start,
  end: getStartAndEnd().end,
  scrub: 1,
};
