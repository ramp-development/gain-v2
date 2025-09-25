import type { ScrollTriggerConfig, TimelineCreator } from '$types';
import { debug } from '$utils/debug';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

/**
 * Hero animation - typically plays on page load
 * Animates the main hero section with staggered reveals
 */
export const homeHeroTimeline: TimelineCreator = (
  element: HTMLElement,
  context?: Record<string, string>
) => {
  debug('log', 'homeHeroTimeline', { element, context });
  const tl = gsap.timeline({ defaults: { ease: context?.ease || 'expo.inOut' } });

  // Find child elements to animate
  const attr = 'data-home-hero';
  const logo = queryElement<HTMLElement>(`[${attr}="logo"]`, element);
  const content = queryElement<HTMLElement>(`[${attr}="content"]`, element);
  const background = queryElement<HTMLElement>(`[${attr}="background"]`, element);
  const title = queryElement<HTMLElement>(`[${attr}="title"]`, element);
  const prompt = queryElement<HTMLElement>(`[${attr}="prompt"]`, element);
  const rings = queryElements<HTMLElement>(`[${attr}="ring"]`, element);
  const assets = queryElements<HTMLElement>(`[${attr}="asset"]`, element);

  if (!logo || !content || !background || !title || !prompt || !rings || !assets) {
    console.warn('homeHeroTimeline', { logo, content, background, title, prompt, rings, assets });
    return;
  }

  const firstAsset = assets[0];
  const allOtherAssets = assets.slice(1).filter((asset) => !!getPositionVar(asset, '--ha-width'));

  const titleSplit = new SplitText(title, { type: 'lines', mask: 'lines' });
  const promptSplit = new SplitText(prompt, { type: 'lines', mask: 'lines' });

  // Build animation sequence
  tl.set(content, { clipPath: 'inset(50%)' });
  tl.set(background, { opacity: 0, width: '0%', height: '0%' });

  tl.to(background, { opacity: 1, duration: 0.25 });
  tl.to(content, { clipPath: 'inset(0%)' }, '<');
  tl.to(background, { width: '100%', height: '100%' }, '<');

  tl.from(titleSplit.lines, { yPercent: 100, stagger: 0.1 }, '<0.1');
  tl.from(promptSplit.lines, { yPercent: 100, stagger: 0.1 }, '<0.5');

  tl.to(promptSplit.lines, { yPercent: -100, stagger: 0.1 });
  tl.from(firstAsset, { opacity: 0, scale: 0.5, transformOrigin: 'center center' }, '<');
  tl.to(title, { opacity: 0 }, '<');

  tl.from(
    rings,
    { opacity: 0, width: (index, trigger) => trigger.offsetWidth / 2, stagger: 0.1 },
    '<0.25'
  );

  allOtherAssets.forEach((asset, index) => {
    const top = getPositionVar(asset, '--hl-top');
    const bottom = getPositionVar(asset, '--hl-bottom');
    const left = getPositionVar(asset, '--hl-left');
    const right = getPositionVar(asset, '--hl-right');

    const fromOptions: Record<string, number> = {
      opacity: 0,
      duration: 0.25,
    };

    if (top) fromOptions['--ha-top'] = top * 2;
    if (bottom) fromOptions['--ha-bottom'] = bottom * 2;
    if (left) fromOptions['--ha-left'] = left * 2;
    if (right) fromOptions['--ha-right'] = right * 2;

    const toOptions: Record<string, number> = {
      opacity: 1,
    };

    if (top) toOptions['--ha-top'] = top;
    if (bottom) toOptions['--ha-bottom'] = bottom;
    if (left) toOptions['--ha-left'] = left;
    if (right) toOptions['--ha-right'] = right;

    tl.fromTo(asset, fromOptions, toOptions, index === 0 ? '>-1' : `<${index * 0.005}`);
  });

  return tl;
};

export const homeHeroTriggerConfig: ScrollTriggerConfig = {
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1,
};

function getPositionVar(element: HTMLElement, varName: string) {
  const computedStyle = getComputedStyle(element);
  const value = computedStyle.getPropertyValue(varName);
  if (value === '') return null;
  return parseFloat(value);
}
