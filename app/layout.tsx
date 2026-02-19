import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Banner Gen",
  description: "Generate and download icon pattern banners",
  openGraph: {
    title: "Banner Gen",
    description: "Generate and download icon pattern banners",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Banner Gen – icon pattern banner generator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banner Gen",
    description: "Generate and download icon pattern banners",
    images: ["/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
