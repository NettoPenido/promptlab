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
      { url: "/favicon.svg", type: "image/svg+xml" },
      // fallback opcional (se quiser criar)
      // { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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