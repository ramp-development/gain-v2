import { queryElement } from './queryElement';
import { queryElements } from './queryElements';

export const getButtonText = (button: HTMLDivElement): string | undefined => {
  const clickableTexts = queryElements<HTMLSpanElement>('[data-element="clickable-text"]', button);
  const buttonText = queryElement<HTMLDivElement>('[data-element="button-text"]', button);

  let text: string | undefined;

  clickableTexts.forEach((clickableText) => {
    if (text) return;
    text = clickableText.textContent || undefined;
  });

  if (!text) {
    text = buttonText?.textContent || undefined;
  }

  return text;
};
