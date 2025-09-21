import { Thresholds } from 'src/types/thresholds';

export const containerThreshold = (
  container: HTMLElement,
  threshold: Thresholds | number,
  direction: 'above' | 'below' = 'below'
) => {
  // find out how many rems the container is using the root font size not 16
  const rootFontSize = parseFloat(getComputedStyle(document.body).fontSize);

  const containerRect = container.getBoundingClientRect();
  const containerWidthInRems = containerRect.width / rootFontSize;

  if (direction === 'above') return containerWidthInRems >= threshold;
  return containerWidthInRems < threshold;
};
