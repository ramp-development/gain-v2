import { App } from '$app';

/**
 * Initialize GSAP with global defaults
 * Should be called once on app initialization
 */
export const defaults = (): void => {
  const app = App.getInstance();

  // Global GSAP defaults
  gsap.defaults({
    duration: 2,
    ease: 'expo.inOut',
  });

  // ScrollTrigger global defaults
  ScrollTrigger.defaults({
    markers: app.debug, // Show markers if debug
  });
};
