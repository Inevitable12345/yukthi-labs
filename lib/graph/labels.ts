/**
 * Wraps a diagram label onto at most `maxLines` lines.
 *
 * SVG has no text wrapping, and a truncated label in a causal diagram is a
 * missing fact rather than a cosmetic problem — so the wrap is done here, at a
 * width chosen to fit the layout, and long single words are allowed to overhang
 * rather than being cut.
 */
export function wrapLabel(label: string, maxCharacters = 20, maxLines = 2): string[] {
  const words = label.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharacters || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }

  const remaining = words.slice(lines.join(" ").split(/\s+/).filter(Boolean).length);
  if (lines.length < maxLines) {
    lines.push(current || remaining.join(" "));
  }

  const used = lines.join(" ").split(/\s+/).filter(Boolean).length;
  if (used < words.length && lines.length > 0) {
    lines[lines.length - 1] = `${lines[lines.length - 1]} ${words.slice(used).join(" ")}`;
  }

  return lines.filter(Boolean);
}
