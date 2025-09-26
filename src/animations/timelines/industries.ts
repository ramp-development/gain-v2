import { Thresholds } from 'src/types/thresholds';

import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { debug } from '$utils/debug';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

/**
 * Hero animation - typically plays on page load
 * Animates the main hero section with staggered reveals
 */
export const industriesTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  debug('log', 'industriesTimeline', { element, context });
  // Find child elements to animate
  const attr = 'data-industry';
  const track = queryElement<HTMLElement>(`[${attr}="track"]`, element);
  const sticky = queryElement<HTMLElement>(`[${attr}="sticky"]`, element);
  const assetsCollection = queryElement<HTMLElement>(`[${attr}="assets-collection"]`, element);
  const assetsList = queryElement<HTMLElement>(`[${attr}="assets-list"]`, element);
  const assets = queryElements<HTMLElement>(`[${attr}="asset"]`, element);
  const namesWrap = queryElement<HTMLElement>(`[${attr}="names-wrap"]`, element);
  const names = queryElements<HTMLElement>(`[${attr}="name"]`, element);

  if (
    !track ||
    !sticky ||
    !assetsCollection ||
    !assetsList ||
    assets.length === 0 ||
    !namesWrap ||
    names.length === 0
  ) {
    debug('warn', 'industriesTimeline', {
      track,
      sticky,
      assetsCollection,
      assetsList,
      namesWrap,
      names,
    });
    return;
  }

  const assetsTl = gsap.timeline({ defaults: { ease: 'none' } });
  const namesTl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  const masterTl = gsap.timeline();

  namesTl.set(names, { yPercent: 100 * 2 });
  names.forEach((name, index) => {
    if (index === 0) return;
    const position = 200 + -100 * index;
    namesTl.to(names, { yPercent: position });
  });

  // Build animation sequence
  // element.observeContainer(`(width < ${Thresholds.medium})rem`, (match) => {
  element.observeContainer(`(width < ${Thresholds.medium}em)`, (match) => {
    if (match) {
      // get the height of the assets list including padding and margin
      // const stickyHeight = sticky.getBoundingClientRect().height;
      const assetWidth = assets[0].getBoundingClientRect().width;
      const moveListBy = assetWidth * (assets.length - 1);

      // Build the animation sequence
      const trackHeight = moveListBy;
      masterTl.set(track, { height: `${trackHeight}px` });

      assetsTl.to(assets, { x: -moveListBy });
    } else {
      // get the height of the assets list including padding and margin
      const stickyHeight = sticky.getBoundingClientRect().height;
      const assetsCollectionHeight = assetsCollection.getBoundingClientRect().height;
      const assetsListHeight = assetsList.getBoundingClientRect().height;
      const moveListBy = assetsListHeight - assetsCollectionHeight;

      // Build the animation sequence
      const trackHeight = stickyHeight - assetsCollectionHeight + assetsListHeight;
      masterTl.set(track, { height: `${trackHeight}px` });

      assets.forEach((asset, index) => {
        const position = (moveListBy / assets.length) * (index + 1) * -1;
        assetsTl.to(assets, { y: position });
      });
    }
  });

  assetsTl.duration(1);
  namesTl.duration(1);

  masterTl.add(assetsTl);
  masterTl.add(namesTl, '<');

  return masterTl;
};

export const industriesTriggerConfig: ScrollTriggerConfig = {
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1,
};
