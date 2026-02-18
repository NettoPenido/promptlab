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
  title: "Formação IA VÍDEO PRO - Aprenda a criar vídeos com Inteligência Artificial",
  description: "Domine as melhores ferramentas de IA para criar vídeos incríveis, do zero ao avançado. Aprenda ChatGPT, Midjourney, Runway, ElevenLabs e muito mais.",
  keywords: ["IA", "Inteligência Artificial", "vídeo", "criação de conteúdo", "ChatGPT", "Midjourney", "Runway", "curso"],
  authors: [{ name: "Tales Ramiro" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Formação IA VÍDEO PRO",
    description: "Domine as melhores ferramentas de IA para criar vídeos incríveis",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formação IA VÍDEO PRO",
    description: "Domine as melhores ferramentas de IA para criar vídeos incríveis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
