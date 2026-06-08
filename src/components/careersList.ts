import { attrs } from '$config/constants';
import { getButtonText } from '$utils/getButtonText';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';
import { updateButtonText } from '$utils/updateButtonText';

export const careersList = () => {
  const component = queryElement<HTMLDivElement>(`[${attrs.elements}="careers"]`);
  if (!component) return;

  const items = queryElements<HTMLDivElement>(`[${attrs.elements}="careers-item"]`, component);
  updateHeaderText(items);
  items.forEach((item) => {
    handleMailTo(item);
    handleDetails(item);
  });

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

  function handleMailTo(item: HTMLDivElement) {
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

  function handleDetails(item: HTMLDivElement) {
    const trigger = queryElement<HTMLDivElement>('[data-details-trigger]', item);
    const content = queryElement<HTMLDivElement>('[data-details-content]', item);

    if (!trigger) return;

    if (!content) {
      trigger.remove();
      return;
    }

    const contentHeight = content.getBoundingClientRect().height;
    gsap.set(content, { display: 'none', height: '0' });
    let isOpen = false;
    let originalText = getButtonText(trigger);
    if (!originalText) originalText = 'Show';

    trigger.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        gsap.to(content, {
          display: 'block',
          height: contentHeight,
          duration: 0.5,
          ease: 'power2.inOut',
        });
        updateButtonText(trigger, 'Hide');
      } else {
        gsap.to(content, {
          display: 'none',
          height: '0',
          duration: 0.5,
          ease: 'power2.inOut',
        });
        updateButtonText(trigger, originalText);
      }
    });
  }
};
