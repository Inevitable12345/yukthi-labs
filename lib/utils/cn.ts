/** Joins class names, dropping falsy values. Deliberately tiny — no variants engine. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
