import type { Metadata } from "next";
import { Geist, Instrument_Serif, Inter, Syne } from "next/font/google";
import { GeistPixelCircle, GeistPixelSquare } from "geist/font/pixel";
import { Analytics } from "@/components/analytics";
import { CopiesQuotaProvider } from "@/components/copies-quota-widget";
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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://frameline.ai"),
  title: {
    default: "Frameline",
    template: "%s · Frameline",
  },
  description:
    "Design assets for the AI era — shippable surface so builders don’t ship the default AI look.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://frameline.ai",
    siteName: "Frameline",
    title: "Frameline",
    description:
      "Design assets for the AI era — shippable surface so builders don’t ship the default AI look.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frameline",
    description:
      "Design assets for the AI era — shippable surface so builders don’t ship the default AI look.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/relay/logo-02.svg", type: "image/svg+xml" }],
  },
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
        instrumentSerif.variable,
        syne.variable,
        GeistPixelSquare.variable,
        GeistPixelCircle.variable,
        "font-sans",
      )}
      lang="en"
    >
      <body className="min-h-full font-sans antialiased">
        <CopiesQuotaProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </CopiesQuotaProvider>
        <Analytics />
      </body>
    </html>
  );
}
