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
    component.removeAttribute('style');
    tagWrap.removeAttribute('style');
    list.removeAttribute('style');
    items.forEach((item) => {
      item.removeAttribute('style');
    });
    cta.removeAttribute('style');
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
      item.style.paddingTop = `${paddingTop}px`;

      paddingTop += endHeightOfItem;
    });

    cta.style.paddingTop = `${paddingTop}px`;

    const totalHeight = paddingTop + cta.getBoundingClientRect().height; // come back to this???
    if (isAboveThreshold()) tagWrap.style.height = `${totalHeight}px`;

    const ctaPaddingBottom1 = totalHeight - cta.getBoundingClientRect().height;
    cta.style.paddingBottom = `${ctaPaddingBottom1}px`;
    component.style.marginBottom = `${ctaPaddingBottom1 * -1}px`;

    const reversedItems = [...items].reverse();
    reversedItems.forEach((item) => {
      const paddingBottom = totalHeight - item.getBoundingClientRect().height;
      item.style.paddingBottom = `${paddingBottom}px`;
    });

    items.forEach((item, index) => {
      if (index === 0) return;

      const computedStyleOfCurrentItem = getComputedStyle(item);
      const previousItem = items[index - 1];
      const computedStyleOfPreviousItem = getComputedStyle(previousItem);

      const paddingBottom = parseFloat(computedStyleOfPreviousItem.paddingBottom);
      const paddingTop = parseFloat(computedStyleOfCurrentItem.paddingTop);
      const marginTop = paddingBottom + paddingTop;

      item.style.marginTop = `${marginTop * -1}px`;
    });

    const ctaComputedStyleOfCurrentItem = getComputedStyle(cta);
    const ctaPreviousItem = items[items.length - 1];
    const ctaComputedStyleOfPreviousItem = getComputedStyle(ctaPreviousItem);

    const ctaPaddingBottom2 = parseFloat(ctaComputedStyleOfPreviousItem.paddingBottom);
    const ctaPaddingTop = parseFloat(ctaComputedStyleOfCurrentItem.paddingTop);
    const ctaMarginTop = ctaPaddingBottom2 + ctaPaddingTop;

    cta.style.marginTop = `${ctaMarginTop * -1}px`;
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
