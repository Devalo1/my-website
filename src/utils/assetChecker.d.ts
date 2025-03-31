/**
 * Type declarations for assetChecker.js
 */

/**
 * Checks if an image exists at the provided path
 * @param imagePath - The URL path to the image
 * @returns A promise that resolves to a boolean indicating if the image exists
 */
export function checkImageExists(imagePath: string): Promise<boolean>;

/**
 * Verifies if the background image exists and provides fallbacks if not found
 * @returns A boolean indicating if a working path was found
 */
export function verifyBackgroundImage(): boolean;

/**
 * Injects placeholders for missing images in the DOM
 */
export function injectPlaceholders(): void;

/**
 * Verifies the existence of the cover image and logs the result
 */
export function verifyCoverImage(): void;
