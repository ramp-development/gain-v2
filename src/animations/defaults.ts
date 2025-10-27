/**
 * Initialize GSAP with global defaults
 * Should be called once on app initialization
 */
export const defaults = (debug: boolean = false): void => {
  // Global GSAP defaults
  gsap.defaults({
    duration: 2,
    ease: 'expo.inOut',
  });

  // ScrollTrigger global defaults
  ScrollTrigger.defaults({
    markers: debug, // Show markers if debug
  });

  // ScrollTrigger.normalizeScroll(true);
};
