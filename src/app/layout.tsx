import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ARANEX — Biomechanical Wearable Architecture",
  description:
    "Clothing evolved to protect us. Science will empower it to do more. An interactive exploration of biomechanical textile engineering and the future of physiological wearables.",
  keywords: [
    "ARANEX",
    "wearable science",
    "biomechanical clothing",
    "textile engineering",
    "anatomical design",
    "sensing textiles",
  ],
  authors: [{ name: "ARANEX Research Labs" }],
  openGraph: {
    title: "ARANEX — Biomechanical Wearable Architecture",
    description:
      "Clothing evolved to protect us. Science will empower it to do more. Explore the science, anatomy, and future of wearable textiles.",
    url: "https://aranex.science",
    siteName: "ARANEX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARANEX — Biomechanical Wearable Architecture",
    description: "Clothing evolved to protect us. Science will empower it to do more.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#05070A] text-[#F0EFEA] selection:bg-[#00E5C7] selection:text-[#05070A]">
        {children}
      </body>
    </html>
  );
}
