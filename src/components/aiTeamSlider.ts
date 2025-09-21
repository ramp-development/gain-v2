import { queryElement } from '$utils/queryElement';

export const aiTeamSlider = () => {
  const attr = 'data-ai-team';
  const component = queryElement<HTMLElement>(`[${attr}="component"]`);
  if (!component) return;

  const slider = queryElement<HTMLElement>(`[${attr}="slider"]`, component);
  const button = queryElement<HTMLButtonElement>(`[${attr}="button"]`, component);
  if (!slider || !button) return;

  const buttonLink = queryElement<HTMLAnchorElement>('[href]', button);
  const buttonText = queryElement<HTMLDivElement>('.button_main_text', button);
  if (!buttonLink || !buttonText) return;

  const originalText = buttonText.textContent;

  // Function to create options based on current threshold
  const options = {
    type: 'slide',
    perPage: 1,
    gap: 'var(--site--gutter)',
    pagination: false,
    arrows: false,
  };

  // Initialize Splide slider
  const splide = new Splide(slider, options);

  splide.on('ready', () => {
    updateButton(splide.index);
  });

  splide.on('moved', (newIndex) => {
    updateButton(newIndex);
  });

  splide.mount();

  function updateButton(activeIndex: number) {
    const activeSlide = splide.Components.Slides.getAt(activeIndex)?.slide;
    if (!activeSlide) return;

    const name = activeSlide.dataset.aiEmployee;
    const link = queryElement<HTMLAnchorElement>('[href]', activeSlide);
    if (!name || !link) return;

    buttonText!.textContent = `${originalText} of ${name}`;
    buttonLink!.href = link.href;
  }
};
