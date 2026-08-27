/**
 * Long-form reading measure.
 *
 * Styling is applied by element rather than by utility classes on every child,
 * so page authors write plain semantic HTML and the typography stays consistent.
 */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        u-measure
        [&_h2]:u-display-3 [&_h2]:mt-20 [&_h2]:mb-6 [&_h2]:text-bone
        [&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:font-mono [&_h3]:text-[0.75rem] [&_h3]:tracking-[0.16em] [&_h3]:text-steel [&_h3]:uppercase
        [&_p]:u-body [&_p]:mt-5
        [&_ul]:mt-5 [&_ul]:space-y-3
        [&_li]:u-body [&_li]:relative [&_li]:pl-6
        [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em] [&_li]:before:h-px [&_li]:before:w-3 [&_li]:before:bg-steel-dim
        [&_strong]:font-normal [&_strong]:text-bone
        [&_em]:text-bone [&_em]:not-italic
        [&_blockquote]:my-10 [&_blockquote]:border-l-2 [&_blockquote]:border-gold-dim [&_blockquote]:pl-6
        [&_blockquote_p]:font-display [&_blockquote_p]:text-[1.375rem] [&_blockquote_p]:leading-snug [&_blockquote_p]:font-light [&_blockquote_p]:text-bone
        [&_a]:text-bone [&_a]:underline [&_a]:decoration-[color:var(--hairline-strong)] [&_a]:underline-offset-4 hover:[&_a]:decoration-gold
      "
    >
      {children}
    </div>
  );
}
