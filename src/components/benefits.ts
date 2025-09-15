import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const benefits = () => {
  console.log('benefits');

  const attr = 'data-benefits';

  const component = queryElement(`[${attr}="component"]`);
  if (!component) return;

  const tagWrap = queryElement(`[${attr}="tag-wrap"]`);
  const list = queryElement(`[${attr}="list"]`);

  if (!tagWrap || !list) return;

  const items = queryElements(`[${attr}="item"]`, list);
  if (!items) return;

  type FormatBenefitsProps = {
    component: HTMLElement;
    tagWrap: HTMLElement;
    list: HTMLElement;
    items: HTMLElement[];
  };

  const props: FormatBenefitsProps = { component, tagWrap, list, items: items as HTMLElement[] };

  resetBenefits(props);
  formatBenefits(props);
  window.addEventListener('resize', () => {
    resetBenefits(props);
    formatBenefits(props);
  });

  function resetBenefits({ component, tagWrap, list, items }: FormatBenefitsProps) {
    component.removeAttribute('style');
    tagWrap.removeAttribute('style');
    list.removeAttribute('style');
    items.forEach((item) => {
      item.removeAttribute('style');
    });
  }

  function formatBenefits({ tagWrap, items }: FormatBenefitsProps) {
    const lastItem = items[items.length - 1];
    const rect = lastItem?.getBoundingClientRect();
    const heightOfLastItem = rect?.height;

    let paddingTop = 0;
    items.forEach((item, index) => {
      const endHeightOfItem = getDistanceFromParagraphToTop(item);
      item.style.paddingTop = `${paddingTop}px`;

      if (index !== items.length - 1) {
        paddingTop += endHeightOfItem;
      }
    });

    const totalHeight = paddingTop + heightOfLastItem;
    tagWrap.style.height = `${totalHeight}px`;

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
