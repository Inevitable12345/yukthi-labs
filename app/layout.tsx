import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { JsonLd, organizationSchema } from "@/components/layout/JsonLd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/ui/SkipLink";
import { SITE } from "@/lib/metadata/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.mission}`,
    template: `%s — ${SITE.name}`,
  },
  description: `${SITE.name} is building ${SITE.bet.toLowerCase()} ${SITE.positioning}`,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Optional cookieless analytics. Absent unless the operator configures it (§43). */
function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC?.trim();
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim();
  if (!src) return null;
  return <Script src={src} data-domain={domain} strategy="afterInteractive" defer />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.locale}>
      <body className="antialiased">
        <SkipLink />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd schema={organizationSchema()} />
        <Analytics />
      </body>
    </html>
  );
}
