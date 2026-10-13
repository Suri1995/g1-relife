import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./global.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import BackToTop from "@/components/BackToTop";
import MotionProvider from "@/components/MotionProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // Only the optical-size axis is used for the display type treatment;
  // dropping SOFT/WONK keeps the self-hosted font file meaningfully smaller.
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://g1relifewellnesszone.example.com"),
  title: {
    default: "G1 RE-LIFE Wellness Zone | Personalized Wellness Coaching",
    template: "%s | G1 RE-LIFE Wellness Zone",
  },
  description:
    "G1 RE-LIFE Wellness Zone offers personalized wellness coaching with Veena Jeevan — weight & fat loss, muscle gain, nutrition, and lifestyle transformation programs in Dilsukhnagar, Hyderabad.",
  keywords: [
    "G1 RE-LIFE Wellness Zone",
    "Veena Jeevan wellness coach",
    "wellness coaching Hyderabad",
    "weight loss Dilsukhnagar",
    "nutrition advisor Hyderabad",
  ],
  openGraph: {
    title: "G1 RE-LIFE Wellness Zone | Personalized Wellness Coaching",
    description:
      "Personalized wellness solutions for a healthier, more balanced lifestyle — guided by Wellness Coach Veena Jeevan.",
    url: "https://g1relifewellnesszone.example.com",
    siteName: "G1 RE-LIFE Wellness Zone",
    images: [
      "https://mybusinessweb.in/uploads/vcards/covers/25341/WhatsApp-Image-2026-05-01-at-2.42.32-PM.jpeg",
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://mybusinessweb.in" />
        <link rel="dns-prefetch" href="https://mybusinessweb.in" />
      </head>
      <body className="bg-cream text-ink antialiased">
        <MotionProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-evergreen focus:text-cream focus:px-4 focus:py-2 focus:rounded-md"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <FloatingActions />
          <BackToTop />
        </MotionProvider>
      </body>
    </html>
  );
}
