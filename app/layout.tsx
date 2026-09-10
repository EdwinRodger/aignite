import type { Metadata, Viewport } from "next";
import { Nunito, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "AIgnite - Master Applied AI in 5-Minute Daily Sparks",
  description: "AIgnite (pronounced ignite, silent A) is the premier AI-specialized learning & career platform for SIH 2026. Interactive AI feeds, architecture games, weekly interview leagues, and verified recruiter discovery.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className={`${fontSans.className} min-h-full flex flex-col font-sans bg-background text-foreground`}>{children}</body>
    </html>
  );
}
