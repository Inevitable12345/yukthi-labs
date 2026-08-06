import type { Metadata, Viewport } from "next";
import { Inter, Merriweather, Sora } from "next/font/google";
import "./globals.css";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import {
  BackToTop,
  MobileCtaBar,
  ScrollProgress,
} from "@/components/layout/ScrollUtilities";
import { JsonLd } from "@/components/ui/JsonLd";
import { conference } from "@/content/conference";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["italic", "normal"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(conference.seo.siteUrl),
  title: {
    default: conference.seo.title,
    template: `%s | ${conference.acronym}`,
  },
  description: conference.seo.description,
  applicationName: conference.acronym,
  keywords: [
    "ICRTET 2026",
    "educational technology conference",
    "SCSVMV",
    "TNTEU",
    "Kanchipuram conference",
    "international conference education",
    "call for papers educational technology",
  ],
  authors: [{ name: "School of Education, SCSVMV" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: conference.seo.siteUrl,
    siteName: conference.acronym,
    title: conference.seo.title,
    description: conference.seo.description,
    images: [
      {
        url: conference.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${conference.acronym} — ${conference.fullTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: conference.seo.title,
    description: conference.seo.description,
    images: [conference.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#092B72",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${merriweather.variable}`}
    >
      <body>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />

        <ScrollProgress />
        <AnnouncementBar />
        <Header />

        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>

        <Footer />

        <BackToTop />
        <MobileCtaBar />
      </body>
    </html>
  );
}
