import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const appendAnchor = () => {
  const attr = 'data-append-anchor';
  const components = queryElements<HTMLAnchorElement>(`[${attr}]`);

  components.forEach((component) => {
    const anchor = component.dataset.appendAnchor;
    if (!anchor) return;

    const link = queryElement<HTMLAnchorElement>('[href]', component);
    if (!link) return;

    link.href = `${link.href}#${anchor}`;
  });
};
