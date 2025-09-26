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

  setBaseVars();

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
    {
      opacity: 0,
      '--hr-width': (index: number, trigger: HTMLElement) => {
        const width = getPositionVar(trigger, '--hr-width');
        return width ? width / 2 : trigger.offsetWidth / 2;
      },
      stagger: 0.1,
    },
    '<0.25'
  );

  const topVar = '--ha-top';
  const bottomVar = '--ha-bottom';
  const leftVar = '--ha-left';
  const rightVar = '--ha-right';

  allOtherAssets.forEach((asset, index) => {
    const top = getPositionVar(asset, topVar);
    const bottom = getPositionVar(asset, bottomVar);
    const left = getPositionVar(asset, leftVar);
    const right = getPositionVar(asset, rightVar);

    const fromOptions: Record<string, number | string> = {
      opacity: 0,
      duration: 0.25,
      backdropFilter: 'blur(1rem)',
    };

    if (top) fromOptions[topVar] = top * 2;
    if (bottom) fromOptions[bottomVar] = bottom * 2;
    if (left) fromOptions[leftVar] = left * 2;
    if (right) fromOptions[rightVar] = right * 2;

    const toOptions: Record<string, number | string> = {
      opacity: 1,
      backdropFilter: 'blur(1rem)',
    };

    if (top) toOptions[topVar] = top;
    if (bottom) toOptions[bottomVar] = bottom;
    if (left) toOptions[leftVar] = left;
    if (right) toOptions[rightVar] = right;

    tl.fromTo(asset, fromOptions, toOptions, index === 0 ? '>-1' : `<${index * 0.005}`);
  });

  function setBaseVars() {
    if (!content) return;
    const widthVar = '--hv-width';
    const heightVar = '--hv-height';

    // Reset the width and height variables
    content.style.removeProperty(widthVar);
    content.style.removeProperty(heightVar);

    // Dynamically pull the width and height variables
    const widthDefault = getPositionVar(content, widthVar);
    const heightDefault = getPositionVar(content, heightVar);
    if (!widthDefault || !heightDefault) return;

    // Get the default and current aspect ratios
    const defaultAspectRatio = widthDefault / heightDefault;
    const contentRect = content.getBoundingClientRect();
    const currentAspectRatio = contentRect.width / contentRect.height;

    // Calculate the scale and width/height
    const scale = currentAspectRatio / defaultAspectRatio;
    const width = widthDefault * scale;
    const height = heightDefault * scale;
    gsap.set(content, { [widthVar]: width, [heightVar]: height });
  }

  window.addEventListener('resize', () => {
    setBaseVars();
    ScrollTrigger.refresh();
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
