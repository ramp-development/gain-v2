import { attrs } from '$config/constants';
import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';

import { BaseAnimation } from './base/baseAnimation';

export class AITeamTimeline extends BaseAnimation {
  protected createTimeline(): void {
    // Find elements to animate
    const track = this.queryElement(`[${attrs.elements}="track"]`);
    if (!track) return;
    const wrap = queryElement(`[${attrs.elements}="wrap"]`, track);
    if (!wrap) return;

    const links = queryElements<HTMLAnchorElement>(`[${attrs.elements}="link"]`, wrap);
    const backgrounds = queryElements<HTMLElement>(`[${attrs.elements}="background"]`, wrap);
    const thumbnails = queryElements<HTMLImageElement>(`[${attrs.elements}="thumbnail"]`, wrap);
    const names = queryElements<HTMLElement>(`[${attrs.elements}="name"]`, wrap);
    const roles = queryElements<HTMLElement>(`[${attrs.elements}="role"]`, wrap);
    const descriptions = queryElements<HTMLElement>(`[${attrs.elements}="description"]`, wrap);
    const mobileDescriptions = queryElements<HTMLElement>(
      `[${attrs.elements}="description-mobile"]`,
      wrap
    );

    // Position elements as needed
    const wrapHeight = wrap.getBoundingClientRect().height;
    this.timeline.set(track, { height: `${wrapHeight * 4}px` });
    this.timeline.set(wrap, { top: `${(window.innerHeight - wrapHeight) / 2}px` });
    ScrollTrigger.refresh();

    links.forEach((link, index) => {
      if (index !== 0) {
        gsap.set(backgrounds[index], { '--clip': '100%' });
        gsap.set(thumbnails[index], { '--clip': '100%' });

        this.timeline.from(
          link,
          { backgroundColor: 'transparent', color: 'var(--swatch--light-100)' },
          '<'
        );
        this.timeline.to(
          links[index - 1],
          { backgroundColor: 'transparent', color: 'var(--swatch--light-100)' },
          '<'
        );

        this.timeline.to(backgrounds[index], { '--clip': '0%' }, '<');
        this.timeline.to(thumbnails[index], { '--clip': '0%' }, '<0.1');
      }

      const nameSplit = new SplitText(names[index], { type: 'words', mask: 'words' });
      const roleSplit = new SplitText(roles[index], { type: 'words', mask: 'words' });
      const descriptionSplit = new SplitText(descriptions[index], { type: 'lines', mask: 'lines' });
      const mobileDescriptionSplit = new SplitText(mobileDescriptions[index], {
        type: 'lines',
        mask: 'lines',
      });

      if (index !== 0) {
        this.timeline.from(nameSplit.words, { yPercent: 100, stagger: 0.05 }, '<0.1');
        this.timeline.from(roleSplit.words, { yPercent: 100, stagger: 0.05 }, '<0.1');
        this.timeline.from(descriptionSplit.lines, { yPercent: 100, stagger: 0.05 }, '<0.1');
        this.timeline.from(mobileDescriptionSplit.lines, { yPercent: 100, stagger: 0.05 }, '<');
      }

      this.timeline.addLabel(`link${index}`);

      if (index !== links.length - 1) {
        this.timeline.to(nameSplit.words, { yPercent: -100, stagger: 0.05, duration: 1 }, '> 0.5');
        this.timeline.to(roleSplit.words, { yPercent: -100, stagger: 0.05, duration: 1 }, '<');
        this.timeline.to(
          descriptionSplit.lines,
          { yPercent: -100, stagger: 0.05, duration: 1 },
          '<'
        );
        this.timeline.to(
          mobileDescriptionSplit.lines,
          { yPercent: -100, stagger: 0.05, duration: 1 },
          '<'
        );
      }

      link.addEventListener('click', () => {
        const { scrollTrigger } = this.timeline;
        if (!scrollTrigger) return;

        const position =
          scrollTrigger.start +
          (scrollTrigger.end - scrollTrigger.start) *
            (this.timeline.labels[`link${index}`] / this.timeline.duration());

        window.scrollTo({ top: position, behavior: 'smooth' });
      });
    });
  }

  protected getScrollTriggerConfig(): ScrollTrigger.Vars {
    const config = {
      trigger: this.element,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    };

    const wrap = this.queryElement(`[${attrs.elements}="wrap"]`);
    if (wrap) {
      const wrapHeight = wrap.getBoundingClientRect().height;
      const topAndBottom = (window.innerHeight - wrapHeight) / 2;

      config.start = `top ${topAndBottom}`;
      config.end = `bottom ${window.innerHeight - topAndBottom}`;
    }

    return config;
  }
}
