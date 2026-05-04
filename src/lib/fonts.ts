import { Inter, Playfair_Display } from "next/font/google";

/** UI copy (matches reference: sans subtitle/body) */
export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Card + section titles (high-contrast display serif, reference look) */
export const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});
