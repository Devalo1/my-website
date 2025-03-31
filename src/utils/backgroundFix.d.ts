/**
 * Type definitions for backgroundFix.js
 */

/**
 * Applies all background image fixes in the correct order
 * This includes:
 * - Injecting critical CSS
 * - Verifying background images
 * - Preloading the background image
 * - Setting up event listeners for continuous checks
 */
export function applyBackgroundFixes(): void;

/**
 * Sets the background image directly on the body element
 * This is used as a last resort fallback method and will
 * switch to an SVG fallback if the JPEG fails to load
 */
export function applyDirectBodyBackground(): void;
