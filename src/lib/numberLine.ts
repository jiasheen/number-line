export const LINE_MIN = 0
export const LINE_MAX = 20

/** Constrain a value to the range [min, max]. */
export function clamp(value: number, min = LINE_MIN, max = LINE_MAX): number {
  return Math.min(max, Math.max(min, value))
}

/** Every whole number on the line, e.g. [0, 1, ..., 20]. */
export function getTicks(min = LINE_MIN, max = LINE_MAX): number[] {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
}

/** Horizontal position of a value along the line, as a percentage (0–100). */
export function toPercent(value: number, min = LINE_MIN, max = LINE_MAX): number {
  return ((value - min) / (max - min)) * 100
}
