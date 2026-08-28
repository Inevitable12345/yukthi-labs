import "@testing-library/jest-dom/vitest";

/**
 * jsdom implements neither of the browser APIs the exhibition leans on. Both
 * are stubbed permissively so that component tests exercise the *rendered
 * argument* rather than the observer plumbing.
 */
if (!("matchMedia" in window)) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!("IntersectionObserver" in window)) {
  class StubObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: StubObserver,
  });
}
