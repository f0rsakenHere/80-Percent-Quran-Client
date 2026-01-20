import type { Metadata } from "next";
import { Space_Grotesk, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/app-shell";
import { IslamicPattern } from "@/components/ui/islamic-pattern";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "80% Quran - Learn Quranic Vocabulary",
  description: "Master the most frequent words in the Quran and understand 80% of its content through interactive flashcards",
  keywords: ["Quran", "Arabic", "Vocabulary", "Islamic", "Learning", "Flashcards"],
  authors: [{ name: "80% Quran Team" }],
  manifest: "/manifest.json",
  themeColor: "#10b981", // Emerald green
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${notoNaskh.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <IslamicPattern />
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

