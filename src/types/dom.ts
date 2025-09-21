/**
 * Container observer callback function type
 */
export type ContainerObserverCallback = (match: boolean) => void;

/**
 * Extended HTMLElement interface with observeContainer method
 * This extends the native HTMLElement to include the observeContainer method
 * provided by the match-container.js library
 */
declare global {
  interface HTMLElement {
    /**
     * Observe container for media query matches
     * @param mediaQuery - CSS media query string (e.g., '(width < 48rem)')
     * @param callback - Function called when media query match state changes
     */
    observeContainer(mediaQuery: string, callback: ContainerObserverCallback): void;
  }
}

/**
 * Type guard to check if an element has the observeContainer method
 * Useful for runtime checks when the library might not be loaded
 */
export function hasObserveContainer(element: HTMLElement): element is HTMLElement & {
  observeContainer(mediaQuery: string, callback: ContainerObserverCallback): void;
} {
  return (
    typeof (element as unknown as { observeContainer?: unknown }).observeContainer === 'function'
  );
}

export {};
