import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { CHAPTERS, SITE_URL } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const description =
  "ARAANEX designs anatomy-mapped smart clothing: biomechanical textile engineering, 3D-knitted performance wear and sensing fabrics for the future of physiological wearables.";

const title = "ARAANEX | Biodesign Wearables, Smart Textiles & Anatomical Clothing";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ARAANEX",
      alternateName: "ARAANEX Research Labs",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      description,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "ARAANEX",
      description,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: title,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      primaryImageOfPage: `${SITE_URL}/opengraph-image.jpg`,
      hasPart: CHAPTERS.map((c) => ({
        "@type": "WebPageElement",
        name: c.name,
        url: `${SITE_URL}/#section-${c.index}`,
      })),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s | ARAANEX" },
  description,
  applicationName: "ARAANEX",
  formatDetection: { telephone: false, email: false, address: false },
  category: "technology",
  keywords: [
    "ARAANEX",
    "smart clothing",
    "smart textiles",
    "wearable technology",
    "biodesign wearables",
    "biomechanical clothing",
    "anatomical clothing",
    "performance wear",
    "3D knitting",
    "sensing textiles",
    "physiological wearables",
    "textile engineering",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  authors: [{ name: "ARAANEX Research Labs" }],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "ARAANEX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#05080f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
