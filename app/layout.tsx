import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polka.Search",
  description: "Find local businesses and events near you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
