import { Thresholds } from 'src/types/thresholds';

import { containerThreshold } from '$utils/containerThreshold';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const benefits = () => {
  const attr = 'data-benefits';

  const component = queryElement<HTMLElement>(`[${attr}="component"]`);
  if (!component) return;

  const tagWrap = queryElement<HTMLElement>(`[${attr}="tag-wrap"]`);
  const list = queryElement<HTMLElement>(`[${attr}="list"]`);

  if (!tagWrap || !list) return;

  const items = queryElements<HTMLElement>(`[${attr}="item"]`, list);
  const cta = queryElement<HTMLElement>(`[${attr}="cta"]`, list);
  if (!items || !cta) return;

  type FormatBenefitsProps = {
    component: HTMLElement;
    tagWrap: HTMLElement;
    list: HTMLElement;
    items: HTMLElement[];
    cta: HTMLElement;
  };

  const props: FormatBenefitsProps = { component, tagWrap, list, items, cta };

  resetBenefits(props);
  formatBenefits(props);
  window.addEventListener('resize', () => {
    resetBenefits(props);
    formatBenefits(props);
  });

  function resetBenefits({ component, tagWrap, list, items, cta }: FormatBenefitsProps) {
    gsap.set(component, { style: '' });
    gsap.set(tagWrap, { style: '' });
    gsap.set(list, { style: '' });
    gsap.set(items, { style: '' });
    gsap.set(cta, { style: '' });
    ScrollTrigger.refresh();
  }

  function formatBenefits({ component, tagWrap, items, cta }: FormatBenefitsProps) {
    const isAboveThreshold = () => containerThreshold(component, Thresholds.medium, 'above');
    const grid = tagWrap.closest('.u-grid-above');
    if (!grid) return;

    const gridComputedStyle = getComputedStyle(grid);
    const gridGap = parseFloat(gridComputedStyle.getPropertyValue('row-gap'));

    let paddingTop = isAboveThreshold() ? 0 : tagWrap.getBoundingClientRect().height + gridGap;

    items.forEach((item) => {
      const endHeightOfItem = getDistanceFromParagraphToTop(item);
      gsap.set(item, { paddingTop: `${paddingTop}px` });

      paddingTop += endHeightOfItem;
    });

    gsap.set(cta, { paddingTop: `${paddingTop}px` });

    const totalHeight = paddingTop + cta.getBoundingClientRect().height; // come back to this???
    if (isAboveThreshold()) gsap.set(tagWrap, { height: `${totalHeight}px` });

    const ctaPaddingBottom1 = totalHeight - cta.getBoundingClientRect().height;
    gsap.set(cta, { paddingBottom: `${ctaPaddingBottom1}px` });
    gsap.set(component, { marginBottom: `${ctaPaddingBottom1 * -1}px` });

    const reversedItems = [...items].reverse();
    reversedItems.forEach((item) => {
      const paddingBottom = totalHeight - item.getBoundingClientRect().height;
      gsap.set(item, { paddingBottom: `${paddingBottom}px` });
    });

    items.forEach((item, index) => {
      if (index === 0) return;

      const computedStyleOfCurrentItem = getComputedStyle(item);
      const previousItem = items[index - 1];
      const computedStyleOfPreviousItem = getComputedStyle(previousItem);

      const paddingBottom = parseFloat(computedStyleOfPreviousItem.paddingBottom);
      const paddingTop = parseFloat(computedStyleOfCurrentItem.paddingTop);
      const marginTop = paddingBottom + paddingTop;

      gsap.set(item, { marginTop: `${marginTop * -1}px` });
    });

    const ctaComputedStyleOfCurrentItem = getComputedStyle(cta);
    const ctaPreviousItem = items[items.length - 1];
    const ctaComputedStyleOfPreviousItem = getComputedStyle(ctaPreviousItem);

    const ctaPaddingBottom2 = parseFloat(ctaComputedStyleOfPreviousItem.paddingBottom);
    const ctaPaddingTop = parseFloat(ctaComputedStyleOfCurrentItem.paddingTop);
    const ctaMarginTop = ctaPaddingBottom2 + ctaPaddingTop;

    gsap.set(cta, { marginTop: `${ctaMarginTop * -1}px` });
    ScrollTrigger.refresh();
  }

  function getDistanceFromParagraphToTop(item: HTMLElement): number {
    const paragraph = queryElement('.c-paragraph', item);
    if (!paragraph) return 0;

    const itemRect = item.getBoundingClientRect();
    const paragraphRect = paragraph.getBoundingClientRect();
    const distance = paragraphRect?.top - itemRect?.top;

    return distance;
  }
};
