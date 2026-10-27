import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const description =
  "Clothing evolved to protect us. Science will empower it to do more. An interactive exploration of biomechanical textile engineering and the future of physiological wearables.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ARAANEX — Biodesign Wearable Architecture",
  description,
  keywords: [
    "ARAANEX",
    "wearable science",
    "biomechanical clothing",
    "textile engineering",
    "anatomical design",
    "sensing textiles",
  ],
  authors: [{ name: "ARAANEX Research Labs" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "ARAANEX — Biodesign Wearable Architecture",
    description,
    url: "/",
    siteName: "ARAANEX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARAANEX — Biodesign Wearable Architecture",
    description: "Clothing evolved to protect us. Science will empower it to do more.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
