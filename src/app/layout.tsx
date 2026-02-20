import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prompt Lab — The AI Image Vault",
  description: "Prompts prontos. Resultados profissionais. Biblioteca premium com desbloqueio via Hotmart.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "android-chrome", url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { rel: "android-chrome", url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
  },
  openGraph: {
    title: "Prompt Lab — The AI Image Vault",
    description: "Biblioteca premium de prompts com imagens e desbloqueio via Hotmart.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Lab — The AI Image Vault",
    description: "Biblioteca premium de prompts com imagens e desbloqueio via Hotmart.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}