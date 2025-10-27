import EventBus from 'js-event-bus';
import Lenis from 'lenis';

import { getEnvironment } from '$utils/getEnvironment';
import { getParams } from '$utils/getParams';

import { type Environment, Events } from './types';

export class App {
  private static _instance: App;
  public eventBus: EventBus;
  public initialised: boolean = false;
  public environment: Environment;
  public params: Record<string, string>;
  public lenis: Lenis;
  public debug: boolean = false;

  private constructor() {
    this.eventBus = new EventBus();
    this.environment = getEnvironment();
    this.params = getParams();
    this.lenis = new Lenis();
    this.debug = this.environment === 'staging' && this.params.debug !== undefined;
  }

  public static getInstance(): App {
    if (!App._instance) App._instance = new App();
    return App._instance;
  }

  public init(): void {
    if (this.initialised) {
      return;
    }

    this.smoothScroll();

    this.initialised = true;
    this.eventBus.emit(Events.APP_INITIALIZED);
  }

  private smoothScroll(): void {
    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    this.lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);
  }
}
