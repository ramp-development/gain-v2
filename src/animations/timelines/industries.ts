import { Thresholds } from 'src/types/thresholds';

import { debug } from '$utils/debug';

import { BaseAnimation } from './base/baseAnimation';

export class IndustriesTimeline extends BaseAnimation {
  protected attr = 'data-industry';
  protected track: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);

    this.track = this.queryElement(`[${this.attr}="track"]`) as HTMLElement;
  }

  protected createTimeline(): void {
    // Find elements to animate
    const sticky = this.queryElement(`[${this.attr}="sticky"]`);
    const assetsCollection = this.queryElement(`[${this.attr}="assets-collection"]`);
    const assetsList = this.queryElement(`[${this.attr}="assets-list"]`);
    const assets = this.queryElements(`[${this.attr}="asset"]`);
    const namesWrap = this.queryElement(`[${this.attr}="names-wrap"]`);
    const names = this.queryElements(`[${this.attr}="name"]`);

    if (
      !sticky ||
      !assetsCollection ||
      !assetsList ||
      assets.length === 0 ||
      !namesWrap ||
      names.length === 0
    ) {
      debug('warn', 'industriesTimeline', {
        sticky,
        assetsCollection,
        assetsList,
        assets,
        namesWrap,
        names,
      });
      return;
    }

    // Build animation sequence
    const assetsTl = gsap.timeline({ defaults: { ease: 'none' } });
    const namesTl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    namesTl.set(names, { yPercent: 100 * 2 });
    names.forEach((name, index) => {
      if (index === 0) return;
      const position = 200 + -100 * index;
      namesTl.to(names, { yPercent: position });
    });

    // Build animation sequence
    this.element.observeContainer(`(width < ${Thresholds.medium}em)`, (match) => {
      if (match) {
        // get the height of the assets list including padding and margin
        // const stickyHeight = sticky.getBoundingClientRect().height;
        const assetWidth = assets[0].getBoundingClientRect().width;
        const moveListBy = assetWidth * (assets.length - 1);
        const elementHeight = this.element.getBoundingClientRect().height;
        const listHeight = assetsList.getBoundingClientRect().height;

        // Build the animation sequence
        const trackHeight = elementHeight - listHeight + moveListBy;
        gsap.set(this.track, { height: `${trackHeight}px` });

        assetsTl.fromTo(assets, { x: 0 }, { x: -moveListBy });
      } else {
        // get the height of the assets list including padding and margin
        const stickyHeight = sticky.getBoundingClientRect().height;
        const assetsCollectionHeight = assetsCollection.getBoundingClientRect().height;
        const assetsListHeight = assetsList.getBoundingClientRect().height;
        const moveListBy = assetsListHeight - assetsCollectionHeight;

        // Build the animation sequence
        const trackHeight = stickyHeight - assetsCollectionHeight + assetsListHeight;
        gsap.set(this.track, { height: `${trackHeight}px` });

        assets.forEach((asset, index) => {
          const position = (moveListBy / assets.length) * (index + 1) * -1;
          assetsTl.to(assets, { y: position });
        });
      }
    });

    assetsTl.duration(1);
    namesTl.duration(1);

    this.timeline.add(assetsTl);
    this.timeline.add(namesTl, '<');
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    };
  }
}
