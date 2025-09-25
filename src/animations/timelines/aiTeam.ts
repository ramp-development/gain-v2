import { attrs } from '$config/constants';
import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const aiTeamTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  console.log('aiTeamTimeline', { context });
  // Find elements to animate
  const track = queryElement(`[${attrs.elements}="track"]`, element);
  if (!track) return;
  const wrap = queryElement(`[${attrs.elements}="wrap"]`, track);
  if (!wrap) return;

  const links = queryElements<HTMLAnchorElement>(`[${attrs.elements}="link"]`, wrap);
  const backgrounds = queryElements<HTMLElement>(`[${attrs.elements}="background"]`, wrap);
  const thumbnails = queryElements<HTMLImageElement>(`[${attrs.elements}="thumbnail"]`, wrap);
  const names = queryElements<HTMLElement>(`[${attrs.elements}="name"]`, wrap);
  const roles = queryElements<HTMLElement>(`[${attrs.elements}="role"]`, wrap);
  const descriptions = queryElements<HTMLElement>(`[${attrs.elements}="description"]`, wrap);
  const mobileDescriptions = queryElements<HTMLElement>(
    `[${attrs.elements}="description-mobile"]`,
    wrap
  );

  // Position elements as needed
  const wrapHeight = wrap.getBoundingClientRect().height;
  track.style.height = `${wrapHeight * 4}px`;
  wrap.style.top = `${(window.innerHeight - wrapHeight) / 2}px`;

  const defaults = { ease: context?.ease || 'none' };
  const tl = gsap.timeline({ defaults });

  links.forEach((link, index) => {
    // if (index === 0) tl.addLabel(`link${index}`);

    if (index !== 0) {
      gsap.set(backgrounds[index], { '--clip': '100%' });
      gsap.set(thumbnails[index], { '--clip': '100%' });

      tl.from(link, { backgroundColor: 'transparent', color: 'var(--swatch--light-100)' }, '<');
      tl.to(
        links[index - 1],
        { backgroundColor: 'transparent', color: 'var(--swatch--light-100)' },
        '<'
      );

      tl.to(backgrounds[index], { '--clip': '0%' }, '<');
      tl.to(thumbnails[index], { '--clip': '0%' }, '<0.1');
    }

    // const nameSplit = createSplitText(names[index], defaults, 'words', index, names.length);
    // const roleSplit = createSplitText(roles[index], defaults, 'words', index, roles.length);
    // const descriptionSplit = createSplitText(
    //   descriptions[index],
    //   defaults,
    //   'lines',
    //   index,
    //   descriptions.length
    // );
    // const mobileDescriptionSplit = createSplitText(
    //   mobileDescriptions[index],
    //   defaults,
    //   'lines',
    //   index,
    //   mobileDescriptions.length,
    //   index !== 0 ? () => tl.addLabel(`link${index}`) : undefined
    // );

    // tl.add(nameSplit.animation, '<0.1');
    // tl.add(roleSplit.animation, '<0.1');
    // tl.add(descriptionSplit.animation, '<0.1');
    // tl.add(mobileDescriptionSplit.animation, '<');

    const nameSplit = new SplitText(names[index], { type: 'words', mask: 'words' });
    const roleSplit = new SplitText(roles[index], { type: 'words', mask: 'words' });
    const descriptionSplit = new SplitText(descriptions[index], { type: 'lines', mask: 'lines' });
    const mobileDescriptionSplit = new SplitText(mobileDescriptions[index], {
      type: 'lines',
      mask: 'lines',
    });

    if (index !== 0) {
      tl.from(nameSplit.words, { yPercent: 100, stagger: 0.05 }, '<0.1');
      tl.from(roleSplit.words, { yPercent: 100, stagger: 0.05 }, '<0.1');
      tl.from(descriptionSplit.lines, { yPercent: 100, stagger: 0.05 }, '<0.1');
      tl.from(mobileDescriptionSplit.lines, { yPercent: 100, stagger: 0.05 }, '<');
    }

    // if (index !== 0) tl.addLabel(`link${index}`);
    tl.addLabel(`link${index}`);

    if (index !== links.length - 1) {
      tl.to(nameSplit.words, { yPercent: -100, stagger: 0.05, duration: 1 }, '> 0.5');
      tl.to(roleSplit.words, { yPercent: -100, stagger: 0.05, duration: 1 }, '<');
      tl.to(descriptionSplit.lines, { yPercent: -100, stagger: 0.05, duration: 1 }, '<');
      tl.to(mobileDescriptionSplit.lines, { yPercent: -100, stagger: 0.05, duration: 1 }, '<');
    }

    link.addEventListener('click', () => {
      const { scrollTrigger } = tl;
      if (!scrollTrigger) return;

      const position =
        scrollTrigger.start +
        (scrollTrigger.end - scrollTrigger.start) * (tl.labels[`link${index}`] / tl.duration());

      window.scrollTo({ top: position, behavior: 'smooth' });
    });
  });

  return tl;
};

// function createSplitText(
//   element: HTMLElement,
//   defaults: Record<string, string>,
//   type: 'words' | 'lines',
//   index: number,
//   totalLength: number,
//   onComplete?: () => void
// ): SplitText & { animation: gsap.core.Timeline } {
//   let animation: gsap.core.Timeline;

//   const splitText = new SplitText(element, {
//     type,
//     mask: type,
//     autoSplit: true,
//     onSplit: (self) => {
//       const splitTl = gsap.timeline({ defaults });
//       const targets = self[type];

//       console.log('createSplitText', { targets, index, totalLength });

//       // Add the "from" animation (only for non-first items)
//       if (index !== 0) {
//         console.log('adding from animation');
//         splitTl.from(targets, { yPercent: 100, stagger: 0.05 }, '<0.1');
//       }

//       // Add the "to" animation (only for non-last items)
//       if (index !== totalLength - 1) {
//         console.log('adding to animation');
//         splitTl.to(targets, { yPercent: -100, stagger: 0.05 }, '<');
//       }

//       // Call the completion callback
//       if (onComplete) {
//         console.log('calling onComplete');
//         splitTl.call(onComplete);
//       }

//       // Store the animation reference
//       animation = splitTl;
//       return splitTl;
//     },
//   });

//   Object.defineProperty(splitText, 'animation', {
//     get: () => animation,
//     enumerable: true,
//     configurable: true,
//   });

//   return splitText as SplitText & { animation: gsap.core.Timeline };
// }

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
