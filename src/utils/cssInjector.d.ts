/**
 * Type definitions for the CSS injector utility
 */

/**
 * Injects critical CSS styles directly into the document at runtime
 * These styles ensure that background images and other critical CSS
 * are properly loaded even when CSS variables might not be resolved.
 */
export function injectCriticalStyles(): void;
