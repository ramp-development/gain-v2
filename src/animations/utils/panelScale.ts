import { getPanelMargin } from '$utils/getPanelMargin';

export const panelScale = () => {
  const margin = getPanelMargin() || 0;
  const scale = (window.innerWidth - margin * 2) / window.innerWidth;
  return scale;
};
