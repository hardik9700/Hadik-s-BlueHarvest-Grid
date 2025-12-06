/**
 * Formats a number to exactly 3 decimal places.
 * Used for strict scientific monitoring display.
 */
export const formatDecimal = (value: number): string => {
  return value.toFixed(3);
};

/**
 * Formats a number to exactly 4 decimal places.
 * Used for high-precision sensors (GPS, etc).
 */
export const formatPrecision = (value: number): string => {
  return value.toFixed(4);
};

export const generateRandomVariance = (base: number, variance: number): number => {
  return base + (Math.random() * variance * 2 - variance);
};