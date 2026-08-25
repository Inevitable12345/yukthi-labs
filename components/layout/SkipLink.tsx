/** First tab stop on every page. Visible only when focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="u-no-print fixed top-3 left-3 z-[100] -translate-y-24 border border-gold bg-void px-4 py-3 font-mono text-xs tracking-[0.18em] text-gold uppercase transition-transform duration-200 focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
