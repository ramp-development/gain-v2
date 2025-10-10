import { getVariable } from '$utils/getVariable';

import { BaseAnimation } from './base/baseAnimation';

export class HomeHeroTimeline extends BaseAnimation {
  protected content!: HTMLElement;

  protected createTimeline(): void {
    // Find child elements to animate
    const attr = 'data-home-hero';
    const logo = this.queryElement(`[${attr}="logo"]`);
    this.content = this.queryElement(`[${attr}="content"]`) as HTMLElement;
    const background = this.queryElement(`[${attr}="background"]`);
    const title = this.queryElement(`[${attr}="title"]`);
    const prompt = this.queryElement(`[${attr}="prompt"]`);
    const rings = this.queryElements(`[${attr}="ring"]`);
    const assets = this.queryElements(`[${attr}="asset"]`);

    if (!logo || !this.content || !background || !title || !prompt || !rings || !assets) return;

    this.setBaseVars();

    const firstAsset = assets[0];
    const allOtherAssets = assets.slice(1).filter((asset) => !!getVariable('--ha-width', asset));
    allOtherAssets.forEach((asset) => this.setAssetRadius(asset));

    const titleSplit = new SplitText(title, { type: 'lines', mask: 'lines' });
    const promptSplit = new SplitText(prompt, { type: 'lines', mask: 'lines' });

    // Build animation sequence
    this.timeline.set(this.content, { clipPath: 'inset(50%)' });
    this.timeline.set(background, { opacity: 0, width: '0%', height: '0%' });

    this.timeline.to(background, { opacity: 1, duration: 0.25 });
    this.timeline.to(this.content, { clipPath: 'inset(0%)' }, '<');
    this.timeline.to(background, { width: '100%', height: '100%' }, '<');

    this.timeline.from(titleSplit.lines, { yPercent: 100, stagger: 0.1 }, '<0.1');
    this.timeline.from(promptSplit.lines, { yPercent: 100, stagger: 0.1 }, '<0.5');

    this.timeline.to(promptSplit.lines, { yPercent: -100, stagger: 0.1 }, '>-0.5');
    this.timeline.from(
      firstAsset,
      { opacity: 0, scale: 0.5, transformOrigin: 'center center' },
      '<'
    );
    this.timeline.to(title, { opacity: 0 }, '<');

    this.timeline.from(
      rings,
      {
        opacity: 0,
        '--hr-width': (index: number, trigger: HTMLElement) => {
          const width = getVariable('--hr-width', trigger);
          return width ? width / 2 : trigger.offsetWidth / 2;
        },
        stagger: 0.1,
      },
      '<0.25'
    );

    const topVar = '--ha-top';
    const bottomVar = '--ha-bottom';
    const leftVar = '--ha-left';
    const rightVar = '--ha-right';

    allOtherAssets.forEach((asset, index) => {
      const top = getVariable(topVar, asset);
      const bottom = getVariable(bottomVar, asset);
      const left = getVariable(leftVar, asset);
      const right = getVariable(rightVar, asset);

      const fromOptions: Record<string, number | string> = {
        opacity: 0,
        duration: 0.25,
        // backdropFilter: 'blur(1rem)',
      };

      if (top) fromOptions[topVar] = top * 2;
      if (bottom) fromOptions[bottomVar] = bottom * 2;
      if (left) fromOptions[leftVar] = left * 2;
      if (right) fromOptions[rightVar] = right * 2;

      const toOptions: Record<string, number | string> = {
        opacity: 1,
        // backdropFilter: 'blur(1rem)',
      };

      if (top) toOptions[topVar] = top;
      if (bottom) toOptions[bottomVar] = bottom;
      if (left) toOptions[leftVar] = left;
      if (right) toOptions[rightVar] = right;

      this.timeline.fromTo(
        asset,
        fromOptions,
        toOptions,
        index === 0 ? '<1' : `<${index * 0.0075}`
      );
    });

    window.addEventListener('resize', () => {
      this.setBaseVars();
      allOtherAssets.forEach((asset) => this.setAssetRadius(asset));
      ScrollTrigger.refresh();
    });
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    };
  }

  protected setBaseVars() {
    if (!this.content) return;
    const widthVar = '--hv-width';
    const heightVar = '--hv-height';

    // Reset the width and height variables
    this.content.style.removeProperty(widthVar);
    this.content.style.removeProperty(heightVar);

    // Dynamically pull the width and height variables
    const widthDefault = getVariable(widthVar, this.content);
    const heightDefault = getVariable(heightVar, this.content);
    if (!widthDefault || !heightDefault) return;

    // Get the default and current aspect ratios
    const defaultAspectRatio = widthDefault / heightDefault;
    const contentRect = this.content.getBoundingClientRect();
    const currentAspectRatio = contentRect.width / contentRect.height;

    // Calculate the scale and width/height
    const scale = currentAspectRatio / defaultAspectRatio;
    const width = widthDefault * scale;
    const height = heightDefault * scale;
    gsap.set(this.content, { [widthVar]: width, [heightVar]: height });
  }

  protected setAssetRadius(asset: HTMLElement): void {
    // get the variables we have
    const hlRadius = getVariable('--hl-radius', asset);
    const hlWidth = getVariable('--hl-width', asset);

    if (!hlRadius || !hlWidth) return;

    // calculate the hl-height based on the hl-width and the aspect ratio
    const hlHeight = hlWidth * (asset.offsetHeight / asset.offsetWidth);

    // calculate and apply the radius
    const radius = (hlRadius * (asset.offsetWidth / hlWidth + asset.offsetHeight / hlHeight)) / 2;
    asset.style.borderRadius = `${radius}px`;
  }
}
