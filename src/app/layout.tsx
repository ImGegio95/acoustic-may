import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MiniCart from "@/components/MiniCart";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://acousticmay.it"),
  title: {
    default: "Acoustic May | Diffusori Acustici Artigianali",
    template: "%s | Acoustic May"
  },
  description: "Diffusori acustici artigianali fatti a mano in Puglia. Scopri la purezza del suono con i nostri monitor da studio e sistemi Hi-Fi in legno.",
  openGraph: {
    title: "Acoustic May | Diffusori Acustici Artigianali",
    description: "Diffusori acustici artigianali fatti a mano in Puglia.",
    url: "https://www.acousticmay.it",
    siteName: "Acoustic May",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        {children}
        <MiniCart />
      </body>
    </html>
  );
}
