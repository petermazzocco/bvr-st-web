import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import { CartProvider } from "@/components/cart/cart-context";
import { AuthProvider } from "@/components/auth/auth-context";
import { getCollections } from "@/lib/shopify";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BVR STR CO - Premium Streetwear & Independent Fashion",
  description: "Discover unique streetwear and fashion from independent brands and partner stores. Quality clothing, accessories, and lifestyle products curated for the modern streetwear enthusiast.",
  keywords: ["streetwear", "fashion", "independent brands", "clothing", "accessories", "lifestyle", "urban fashion", "partner stores"],
  authors: [{ name: "BVR STR CO" }],
  creator: "BVR STR CO",
  publisher: "BVR STR CO",
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    title: "BVR STR CO - Premium Streetwear & Independent Fashion",
    description: "Discover unique streetwear and fashion from independent brands and partner stores. Quality clothing, accessories, and lifestyle products curated for the modern streetwear enthusiast.",
    url: "https://bvrstrco.com",
    siteName: "BVR STR CO",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://bvrstrco.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BVR STR CO - Premium Streetwear & Independent Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BVR STR CO - Premium Streetwear & Independent Fashion",
    description: "Discover unique streetwear and fashion from independent brands and partner stores.",
    creator: "@bvrstrco",
    site: "@bvrstrco",
    images: ["https://bvrstrco.com/og-image.jpg"],
  },
  metadataBase: new URL("https://bvrstrco.com"),
  alternates: {
    canonical: "https://bvrstrco.com",
  },
};

const ibm = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartId = (await cookies()).get("cartId")?.value;

  const cart = getCart(cartId);

  const collections = await getCollections();
  return (
    <html lang="en">
      <body className={`${ibm.variable} antialiased min-h-screen`}>
        <ReactQueryProvider>
          <AuthProvider>
            <CartProvider cartPromise={cart}>
              <Navbar collections={collections} />
              <main>
                {children}
                <Toaster closeButton />
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
      <Script
        src="https://umami.bvrstrco.com/script.js"
        data-website-id="58e0fb69-5e77-4c91-b2af-f0dac2eddf69"
        defer
      />
    </html>
  );
}
