import { App } from '$app';

/**
 * Initialize GSAP with global defaults
 * Should be called once on app initialization
 */
export const initGSAPDefaults = (): void => {
  const app = App.getInstance();

  // Global GSAP defaults
  gsap.defaults({
    duration: 2,
    ease: 'expo.inOut',
  });

  // ScrollTrigger global defaults
  ScrollTrigger.defaults({
    markers: app.environment === 'staging', // Show markers in staging
  });

  // Refresh ScrollTrigger on window events
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  });
};

/**
 * Animation-specific default configurations
 * These can be overridden in individual timeline definitions
 */
export const ANIMATION_DEFAULTS = {
  load: {
    duration: 2,
    stagger: 0.1,
  },
  entrance: {
    duration: 1.5,
    toggleActions: 'play none none none',
  },
  scrub: {
    scrub: 1,
    ease: 'expo.out',
    pin: false,
  },
} as const;

/**
 * Common ScrollTrigger configurations
 */
export const TRIGGER_DEFAULTS = {
  entrance: {
    start: 'top 80%',
    end: 'bottom top',
    toggleActions: 'play none none none',
  },
  scrub: {
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  },
} as const;
