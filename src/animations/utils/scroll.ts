/**
 * Utility functions for ScrollTrigger operations
 * These wrap GSAP's built-in ScrollTrigger methods
 */

/**
 * Check ScrollTrigger progress to determine if animation should play
 * Progress > 0 means the trigger start point has been passed
 */
export function checkScrollTriggerProgress(scrollTrigger: ScrollTrigger): number {
  return scrollTrigger.progress;
}

/**
 * Check if a ScrollTrigger is currently in the active viewport range
 */
export function isScrollTriggerInView(scrollTrigger: ScrollTrigger): boolean {
  // isActive is true when scroll position is between start and end
  return scrollTrigger.isActive;
}

/**
 * Get the current scroll direction from ScrollTrigger
 */
export function getScrollDirection(scrollTrigger: ScrollTrigger): number {
  // Returns 1 for forward/down, -1 for backward/up
  return scrollTrigger.direction;
}

/**
 * Check if we've scrolled past a ScrollTrigger's start point
 */
export function hasPassedStart(scrollTrigger: ScrollTrigger): boolean {
  return scrollTrigger.progress > 0;
}

/**
 * Check if we've scrolled past a ScrollTrigger's end point
 */
export function hasPassedEnd(scrollTrigger: ScrollTrigger): boolean {
  return scrollTrigger.progress >= 1;
}

/**
 * Get the scroll position relative to a ScrollTrigger
 */
export function getScrollPosition(scrollTrigger: ScrollTrigger): {
  start: number;
  end: number;
  current: number;
  progress: number;
} {
  return {
    start: scrollTrigger.start,
    end: scrollTrigger.end,
    current: scrollTrigger.scroll(),
    progress: scrollTrigger.progress,
  };
}
