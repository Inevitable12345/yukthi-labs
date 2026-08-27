/** First focusable element on every page. Visible the moment it receives focus. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="u-instrument sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-gold focus:bg-void focus:px-4 focus:py-3 focus:text-bone"
    >
      Skip to content
    </a>
  );
}
