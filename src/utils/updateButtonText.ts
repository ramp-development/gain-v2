import { queryElement } from './queryElement';
import { queryElements } from './queryElements';

export const updateButtonText = (button: HTMLDivElement, text: string) => {
  const clickableTexts = queryElements<HTMLSpanElement>('[data-element="clickable-text"]', button);
  const buttonText = queryElement<HTMLDivElement>('[data-element="button-text"]', button);

  clickableTexts.forEach((clickableText) => {
    clickableText.textContent = text;
  });

  buttonText!.textContent = text;
};
