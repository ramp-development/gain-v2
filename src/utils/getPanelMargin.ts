import { queryElement } from './queryElement';

export const getPanelMargin = () => {
  const panelHorizontal = queryElement('.u-panel-horizontal');
  return panelHorizontal?.getBoundingClientRect().width;
};
