import { getPanelMargin } from '$utils/getPanelMargin';

export const panelScale = () => {
  const scale = (window.innerWidth - (getPanelMargin() || 0)) / window.innerWidth;
  return scale;
};
