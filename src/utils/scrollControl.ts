import { App } from '$app';

/**
 * Utility functions for controlling Lenis smooth scroll state
 */
export const scrollControl = {
  /**
   * Disable smooth scrolling (equivalent to body overflow hidden)
   */
  disable(): void {
    const app = App.getInstance();
    app.lenis.stop();
  },

  /**
   * Enable smooth scrolling (equivalent to removing body overflow hidden)
   */
  enable(): void {
    const app = App.getInstance();
    app.lenis.start();
  },

  /**
   * Check if smooth scrolling is currently disabled
   */
  isDisabled(): boolean {
    const app = App.getInstance();
    return app.lenis.isStopped;
  },

  /**
   * Toggle smooth scrolling state
   */
  toggle(): void {
    const app = App.getInstance();
    if (app.lenis.isStopped) {
      app.lenis.start();
    } else {
      app.lenis.stop();
    }
  },

  /**
   * Scroll to a specific position with optional smooth animation
   */
  scrollTo(target: number | string, options?: { immediate?: boolean; offset?: number }): void {
    const app = App.getInstance();
    app.lenis.scrollTo(target, options);
  },

  /**
   * Get current scroll position
   */
  getScroll(): number {
    const app = App.getInstance();
    return app.lenis.scroll;
  },
};
