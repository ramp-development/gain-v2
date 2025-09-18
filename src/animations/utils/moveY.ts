import { queryElement } from '$utils/queryElement';

let isUsed = false;
export const moveY = (using?: boolean) => {
  if (using) isUsed = true;
  const spacer = queryElement('.u-section-spacer');
  const height = spacer ? spacer.getBoundingClientRect().height : 160;
  return { height, isUsed };
};
