import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "evolUSG",
  description: "Plataforma para médicos ultrassonografistas.",
  icons: {
    // PENDING BRAND ASSET: símbolo oficial isolado para favicon.
    // Temporariamente usa a logomarca completa aprovada.
    icon: "/brand/evolusg-logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${GeistSans.variable} ${GeistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
