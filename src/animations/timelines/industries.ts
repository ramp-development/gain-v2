import type { ScrollTriggerConfig, TimelineCreator } from '$types';
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
  console.log('industriesTimeline', { element, context });

  // Find child elements to animate
  const attr = 'data-industry';
  const track = queryElement<HTMLElement>(`[${attr}="track"]`, element);
  const sticky = queryElement<HTMLElement>(`[${attr}="sticky"]`, element);
  const assetsList = queryElement<HTMLElement>(`[${attr}="assets-list"]`, element);
  const assets = queryElements<HTMLElement>(`[${attr}="asset"]`, element);
  const namesWrap = queryElement<HTMLElement>(`[${attr}="names-wrap"]`, element);
  const names = queryElements<HTMLElement>(`[${attr}="name"]`, element);

  if (!track || !sticky || !assetsList || assets.length === 0 || !namesWrap || names.length === 0) {
    console.warn('industriesTimeline', { track, sticky, assetsList, assets, namesWrap, names });
    return;
  }

  // get the height of the assets list including padding and margin
  const stickyComputedStyle = getComputedStyle(sticky);
  const stickyPaddingTop = parseFloat(stickyComputedStyle.paddingTop);
  const stickyPaddingBottom = parseFloat(stickyComputedStyle.paddingBottom);
  const assetsListHeight = assetsList.getBoundingClientRect().height;

  const trackHeight = stickyPaddingTop + stickyPaddingBottom + assetsListHeight;
  track.style.height = `${trackHeight}px`;

  const numberOfAssets = assets.length;
  // const numberOfVisibleNames = getComputedStyle(namesWrap).getPropertyValue('--length');

  gsap.set(names, { yPercent: 100 * 2 });

  const assetsTl = gsap.timeline({ defaults: { ease: 'none' } });
  assetsTl.to(assets, { yPercent: -100 * (numberOfAssets - 1) }).duration(1);

  const namesTl = gsap.timeline({ defaults: { ease: context?.ease || 'expo.inOut' } });
  names.forEach((name, index) => {
    const percentage = (index / names.length) * 100;
    const position = 200 + -100 * index;

    namesTl.to(names, { yPercent: position }, `${percentage}%`);
  });
  namesTl.duration(1);

  const masterTl = gsap.timeline();
  masterTl.add(assetsTl);
  masterTl.add(namesTl, '<');

  return masterTl;
};

export const industriesTriggerConfig: ScrollTriggerConfig = {
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1,
};
