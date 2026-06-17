import { debug } from '$utils/debug';
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
    const sub = this.queryElement(`[${attr}="sub"]`);
    const prompt = this.queryElement(`[${attr}="prompt"]`);
    const rings = this.queryElements(`[${attr}="ring"]`);
    const assets = this.queryElements(`[${attr}="asset"]`);

    if (!logo || !this.content || !background || !title || !sub || !prompt || !rings || !assets) {
      debug('warn', 'homeHeroTimeline', {
        logo,
        content: this.content,
        background,
        title,
        sub,
        prompt,
        rings,
        assets,
      });
      return;
    }

    this.setBaseVars();

    const firstAsset = assets[0];
    const allOtherAssets = assets.slice(1).filter((asset) => !!getVariable('--ha-width', asset));
    allOtherAssets.forEach((asset) => this.setAssetRadius(asset));
    this.scaleAssetPositions(assets);

    const titleSplit = new SplitText(title, { type: 'lines', mask: 'lines' });
    const subSplit = new SplitText(sub, { type: 'lines', mask: 'lines' });
    const promptSplit = new SplitText(prompt, { type: 'lines', mask: 'lines' });

    // Build animation sequence
    gsap.set(this.content, { clipPath: 'inset(50%)' });
    gsap.set(background, { opacity: 0, width: '0%', height: '0%' });

    this.timeline.to(background, { opacity: 1, duration: 0.25 });
    this.timeline.to(this.content, { clipPath: 'inset(0%)' }, '<');
    this.timeline.to(background, { width: '100%', height: '100%' }, '<');

    this.timeline.from(titleSplit.lines, { yPercent: 100, stagger: 0.1 }, '<0.1');
    this.timeline.from(subSplit.lines, { yPercent: 100, stagger: 0.1 }, '<0.1');
    this.timeline.from(promptSplit.lines, { yPercent: 100, stagger: 0.1 }, '<0.5');

    this.timeline.to(promptSplit.lines, { yPercent: -100, stagger: 0.1 }, '>-0.5');
    this.timeline.from(
      firstAsset,
      { opacity: 0, scale: 0.5, transformOrigin: 'center center' },
      '<'
    );
    this.timeline.to(title, { opacity: 0 }, '<');
    this.timeline.to(sub, { opacity: 0 }, '<');

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
      };

      if (top) fromOptions[topVar] = top * 2;
      if (bottom) fromOptions[bottomVar] = bottom * 2;
      if (left) fromOptions[leftVar] = left * 2;
      if (right) fromOptions[rightVar] = right * 2;

      const toOptions: Record<string, number | string> = {
        opacity: 1,
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

    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (lastWidth === window.innerWidth) return;
      lastWidth = window.innerWidth;
      this.setBaseVars();
      allOtherAssets.forEach((asset) => this.setAssetRadius(asset));
      this.scaleAssetPositions(assets);
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
    const scaleVar = '--hv-scale';

    // Reset the variables
    this.content.style.removeProperty(widthVar);
    this.content.style.removeProperty(heightVar);

    // Get the base design dimensions (these should be the original design values)
    const baseWidth = getVariable(widthVar, this.content);
    const baseHeight = getVariable(heightVar, this.content);
    if (!baseWidth || !baseHeight) return;

    // Get current container dimensions
    const contentRect = this.content.getBoundingClientRect();

    // Calculate scale factors for both dimensions
    const scaleX = contentRect.width / baseWidth;
    const scaleY = contentRect.height / baseHeight;

    // Use the smaller scale to maintain aspect ratio (contain mode)
    // Or use Math.max for cover mode
    const scale = Math.min(scaleX, scaleY);

    // Apply scaled dimensions
    const scaledWidth = baseWidth * scale;
    const scaledHeight = baseHeight * scale;

    // Store the scale factor for potential use with positioning
    gsap.set(this.content, {
      [widthVar]: scaledWidth,
      [heightVar]: scaledHeight,
      [scaleVar]: scale,
    });

    // // Debug info
    // debug('info', 'homeHeroTimeline:setBaseVars', {
    //   baseWidth,
    //   baseHeight,
    //   containerWidth: contentRect.width,
    //   containerHeight: contentRect.height,
    //   scaleX,
    //   scaleY,
    //   finalScale: scale,
    //   scaledWidth,
    //   scaledHeight,
    // });
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

  protected scaleAssetPositions(assets: HTMLElement[]): void {
    if (!this.content) return;

    // Get the current scale factor from the content element
    const scale = getVariable('--hv-scale', this.content);
    if (!scale) return;

    const positionVars = ['--ha-top', '--ha-bottom', '--ha-left', '--ha-right'];

    assets.forEach((asset) => {
      positionVars.forEach((varName) => {
        const baseValue = getVariable(
          varName.replace('--ha-', '--hl-'),
          asset.parentElement as HTMLElement
        );
        if (baseValue !== null && baseValue !== undefined) {
          // Apply the scale to the position value
          const scaledValue = baseValue * scale;
          asset.style.setProperty(varName, `${scaledValue}px`);
        }
      });
    });
  }
}
