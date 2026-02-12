import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumos | Markdown Transformer",
  description: "Transform your ideas into slides and mind maps instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
