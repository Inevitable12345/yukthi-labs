import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/components/layout/JsonLd";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { SITE, siteUrl } from "@/lib/metadata/site";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-plex-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE.titleDefault, template: SITE.titleTemplate },
  description: SITE.description,
  applicationName: SITE.name,
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: siteUrl(),
    title: SITE.titleDefault,
    description: SITE.description,
    images: [{ url: "/og", width: 1200, height: 630, alt: SITE.titleDefault }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.titleDefault,
    description: SITE.description,
    images: ["/og"],
  },
  icons: {
    icon: [{ url: "/icons/mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/mark.svg" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#070808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={SITE.lang}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-void text-bone antialiased">
        <SkipLink />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="relative focus:outline-none">
          {children}
        </main>
        <Footer />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
