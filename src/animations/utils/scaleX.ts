/**
 * Calculate the scale X value based on the container max-width CSS variable
 * Returns the ratio of container max-width to window width
 */
export const scaleX = (): number => {
  // Get the CSS variable value
  const containerMaxWidth = getComputedStyle(document.documentElement)
    .getPropertyValue('--max-width--container')
    .trim();

  // Parse the value (handle px, rem, em, etc.)
  let maxWidth = 0;

  if (containerMaxWidth.includes('px')) {
    maxWidth = parseFloat(containerMaxWidth);
  } else if (containerMaxWidth.includes('rem')) {
    // Convert rem to px (1rem = root font size)
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    maxWidth = parseFloat(containerMaxWidth) * rootFontSize;
  } else if (containerMaxWidth.includes('em')) {
    // Convert em to px (1em = root font size for root element)
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    maxWidth = parseFloat(containerMaxWidth) * rootFontSize;
  } else {
    // Fallback to parsing as number
    maxWidth = parseFloat(containerMaxWidth);
  }

  // Return the ratio, with fallback to 0.88 if something goes wrong
  return maxWidth > 0 ? maxWidth / window.innerWidth : 0.88;
};
