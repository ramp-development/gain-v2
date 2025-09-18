import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const scaleY = (): number => {
  const inner = queryElement('[data-element="inner"]');
  if (!inner) return 1;

  const spacers = queryElements('.u-section-spacer');
  const firstSpacer = spacers[0];
  const lastSpacer = spacers[spacers.length - 1];

  const firstSpacerHeight = firstSpacer?.getBoundingClientRect().height;
  const lastSpacerHeight = lastSpacer?.getBoundingClientRect().height;

  const innerHeight = inner.getBoundingClientRect().height;
  const scaleY = inner ? (innerHeight - firstSpacerHeight - lastSpacerHeight) / innerHeight : 1;

  return scaleY;
};
