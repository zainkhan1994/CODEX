/**
 * Computes the rotateY angle (in degrees) for a carousel item.
 *
 * @param positionIndex - Zero-based index of the item
 * @param totalItems    - Total number of items in the carousel
 * @returns Rotation in degrees
 */
export function getCarouselRotation(
  positionIndex: number,
  totalItems: number
): number {
  if (totalItems === 0) return 0;
  return positionIndex * (360 / totalItems);
}

/**
 * Computes the translateZ distance for a carousel given a target item width
 * and the number of items so items don't overlap.
 *
 * Formula: radius = (itemWidth / 2) / tan(π / n)
 *
 * @param itemWidth  - Width of a single card in pixels
 * @param totalItems - Total number of items
 * @returns Translate-Z distance in pixels (minimum 200 px)
 */
export function getCarouselRadius(
  itemWidth: number,
  totalItems: number
): number {
  if (totalItems <= 1) return 0;
  const angle = Math.PI / totalItems;
  return Math.max(200, Math.round((itemWidth / 2) / Math.tan(angle)));
}

/**
 * Clamps a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
