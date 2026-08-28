/** Joins conditional class names. Deliberately tiny — no runtime dependency. */
export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}
