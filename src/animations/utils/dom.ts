/**
 * DOM utility functions for animation system
 */

/**
 * Check if target element comes after reference element in DOM order
 */
export function isAfterInDOM(reference: HTMLElement, target: HTMLElement): boolean {
  // Use compareDocumentPosition
  const position = reference.compareDocumentPosition(target);
  // DOCUMENT_POSITION_FOLLOWING = 4
  return (position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

/**
 * Get all elements with a specific animation type
 */
export function getAnimationElements(type?: string): HTMLElement[] {
  const selector = type ? `[data-animation="${type}"]` : '[data-animation]';
  return Array.from(document.querySelectorAll<HTMLElement>(selector));
}

/**
 * Get the closest animation container
 */
export function getClosestAnimationContainer(element: HTMLElement): HTMLElement | null {
  return element.closest('[data-animation]');
}

/**
 * Check if element has a specific animation trigger
 */
export function hasAnimationTrigger(element: HTMLElement, trigger: string): boolean {
  return element.getAttribute('data-trigger') === trigger;
}

/**
 * Get animation context from element
 */
export function getAnimationContext(element: HTMLElement): Record<string, string> {
  const context: Record<string, string> = {};
  const { attributes } = element;

  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (attr.name.startsWith('data-context-')) {
      const key = attr.name.replace('data-context-', '');
      context[key] = attr.value;
    }
  }

  return context;
}
