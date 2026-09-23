import type { Metadata } from "next";
import { Fraunces, Oswald, Source_Sans_3 } from "next/font/google";
import { Shell } from "@/components/shell";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "MP Stina — obiteljska kuhinja od 2008.",
  description: "Ručak kuhan u Šmrici, vožen rutama u Rijeku. Naruči tanjur, plati, odaberi točku ili vrata.",
  icons: { icon: "/favicon.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#120e0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hr" className={`${serif.variable} ${sans.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
