import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl = "https://jourdanmarc.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jourdan Marc — Consultant IA pour PME",
    template: "%s | Jourdan Marc — Consultant IA",
  },
  description:
    "Consultant IA indépendant pour PME. Audit, automatisation et formation sur mesure pour intégrer l'intelligence artificielle dans votre entreprise avec des résultats concrets.",
  keywords: [
    "consultant IA PME",
    "consultant intelligence artificielle",
    "audit IA",
    "automatisation IA PME",
    "formation IA entreprise",
    "conseil intelligence artificielle",
    "Jourdan Marc",
  ],
  authors: [{ name: "Jourdan Marc" }],
  creator: "Jourdan Marc",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Jourdan Marc — Consultant IA",
    title: "Jourdan Marc — Consultant IA pour PME",
    description:
      "Audit, automatisation et formation IA sur mesure pour les dirigeants de PME. Des résultats concrets, sans jargon.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jourdan Marc — Consultant IA pour PME",
    description:
      "Audit, automatisation et formation IA sur mesure pour les dirigeants de PME.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#06070c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
