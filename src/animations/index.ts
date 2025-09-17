import { App } from '$app';
import { Events } from '$events';

import { initGSAPDefaults } from './config';
import { AnimationManager } from './manager';

/**
 * Initialize the animation system
 * This should be called after APP_INITIALIZED
 */
export const initAnimations = (): void => {
  const app = App.getInstance();

  // Initialize GSAP defaults
  initGSAPDefaults();
  const manager = AnimationManager.getInstance();
  manager.initialize();

  // Set up animation manager after app initialization
  app.eventBus.on(Events.APP_INITIALIZED, () => {
    manager.appReady();
  });
};

// Export for direct access if needed
export * from './config';
export { AnimationManager } from './manager';
export { timelineRegistry } from './registry';
