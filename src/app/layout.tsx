import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Matches the reference storefront's own type pairing: Poppins for body/UI
// copy, Open Sans for headings. Variable names match the tokens globals.css
// expects directly (--font-sans / --font-heading) rather than routing
// through an intermediate alias.
const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Uroboros — Papelería y regalos",
    template: "%s · Uroboros",
  },
  description: "Stickers, tarjetas fotográficas y más — papelería familiar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} ${openSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
