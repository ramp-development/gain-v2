import { Thresholds } from 'src/types/thresholds';

import { containerThreshold } from '$utils/containerThreshold';
import { getPanelMargin } from '$utils/getPanelMargin';

export const panelScale = () => {
  const isAboveLarge = containerThreshold(document.body, Thresholds.large, 'above');
  if (!isAboveLarge) return 1;

  const margin = getPanelMargin() || 0;
  const scale = (window.innerWidth - margin * 2) / window.innerWidth;
  return scale;
};
