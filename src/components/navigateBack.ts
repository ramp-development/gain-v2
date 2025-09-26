import { queryElements } from '$utils/queryElements';

export const navigateBack = () => {
  const attr = 'data-navigate';
  const components = queryElements<HTMLElement>(`[${attr}]`);
  if (!components.length) return;

  components.forEach((component) => {
    component.addEventListener('click', (event) => {
      event.preventDefault();

      const link = component.dataset.navigate;

      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = link ?? '/';
      }
    });
  });
};
