/**
 * Formats a given number by dividing it by 10 and adding a unit.
 * For example, 70 becomes "7.0 m".
 * @param value The number to format (e.g., height or weight).
 * @param unit The unit to append (e.g., "m" or "kg").
 * @returns The formatted string.
 */
export const formatPokemonValue = (value: number, unit: string): string => {
  return `${(value / 10).toFixed(1)} ${unit}`;
};