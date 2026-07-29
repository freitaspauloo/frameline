import type { Metadata } from "next";
import { Geist, Inter, Syne } from "next/font/google";
import { GeistPixelCircle, GeistPixelSquare } from "geist/font/pixel";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

/** Preset b3Y8ryeGJ6 — body: Inter, heading: Geist */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistHeading = Geist({
  subsets: ["latin"],
  variable: "--font-heading",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frameline",
  description:
    "Design assets for the AI era — shippable surface so builders don’t ship the default AI look.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "h-full antialiased",
        inter.variable,
        geistHeading.variable,
        syne.variable,
        GeistPixelSquare.variable,
        GeistPixelCircle.variable,
        "font-sans",
      )}
      lang="en"
    >
      <body className="min-h-full font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
