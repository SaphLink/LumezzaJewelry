import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b8860b",
};

export const metadata: Metadata = {
  title: "Lumezza Jewelry - Elevated Jewelry, Normalized Pricing",
  description: "Discover exquisite fine jewelry at Lumezza. Elevated craftsmanship, normalized pricing. Shop luxury jewelry with transparent pricing.",
  keywords: "jewelry, fine jewelry, luxury jewelry, gold jewelry, diamond jewelry, affordable luxury, jewelry store, Lumezza",
  authors: [{ name: "Lumezza Jewelry" }],
  creator: "Lumezza Jewelry",
  publisher: "Lumezza Jewelry",
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/logo.png?v=5", type: "image/png", sizes: "any" },
    ],
    shortcut: [
      { url: "/logo.png?v=5", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png?v=5", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Lumezza Jewelry - Elevated Jewelry, Normalized Pricing",
    description: "Discover exquisite fine jewelry at Lumezza. Elevated craftsmanship, normalized pricing.",
    type: "website",
    locale: "en_US",
    siteName: "Lumezza Jewelry",
    images: [
      {
        url: "/logo.png",
        width: 220,
        height: 88,
        alt: "Lumezza Jewelry Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumezza Jewelry - Elevated Jewelry, Normalized Pricing",
    description: "Discover exquisite fine jewelry at Lumezza. Elevated craftsmanship, normalized pricing.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-new.png?v=4" type="image/png" />
        <link rel="shortcut icon" href="/favicon-new.png?v=4" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-new.png?v=4" />
        <link rel="canonical" href="https://lumezza.com" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              "name": "Lumezza Jewelry",
              "description": "Elevated Jewelry, Normalized Pricing. Discover exquisite fine jewelry with transparent pricing.",
              "url": "https://lumezza.com",
              "logo": "https://lumezza.com/logo.png",
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "zivwand@gmail.com"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}