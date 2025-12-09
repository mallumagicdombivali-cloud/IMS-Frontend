import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mallu Magic"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We removed the variable class. Just keep standard classes here. */}
      <body suppressHydrationWarning={true} className="antialiased">
        {children}
      </body>
    </html>
  );
}