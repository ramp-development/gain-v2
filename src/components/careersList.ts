import { attrs } from '$config/constants';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

export const careersList = () => {
  const component = queryElement<HTMLDivElement>(`[${attrs.elements}="careers"]`);
  if (!component) return;

  const items = queryElements<HTMLDivElement>(`[${attrs.elements}="careers-item"]`, component);
  updateHeaderText(items);
  items.forEach(handleButtonMailto);

  function updateHeaderText(items: HTMLDivElement[]) {
    const count = queryElement<HTMLSpanElement>(`[${attrs.elements}="careers-count"]`, component);
    const plural = queryElement<HTMLSpanElement>(`[${attrs.elements}="careers-plural"]`, component);

    if (count) {
      count.textContent = items.length.toString();
    }

    if (plural) {
      const singular = plural.textContent;
      if (items.length !== 1) plural.textContent = `${singular}s`;
    }
  }

  function handleButtonMailto(item: HTMLDivElement) {
    const button = queryElement<HTMLAnchorElement>(`a[href^="mailto:"]`, item);
    if (!button) return;

    const subject = queryElement<HTMLInputElement>(`input[name="subject"]`, item);
    const body = queryElement<HTMLInputElement>(`input[name="body"]`, item);

    const mailto = button.href;

    // encode the subject and body
    const subjectValue = subject?.value || '';
    const bodyValue = body?.value.replace(/\\n/g, '\n\n') || '';
    const encodedSubject = encodeURIComponent(subjectValue);
    const encodedBody = encodeURIComponent(bodyValue);

    button!.href = `${mailto}?subject=${encodedSubject}&body=${encodedBody}`;
  }
};
