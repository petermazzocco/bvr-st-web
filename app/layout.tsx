import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import { CartProvider } from "@/components/cart/cart-context";
import { AuthProvider } from "@/components/auth/auth-context";
import { getCollections } from "@/lib/shopify";
import Script from "next/script";
import { comingSoonFlag, underConstructionFlag } from "@/lib/flags";
import { UnderConstructionPage } from "@/components/utils/under-construction-page";
import { ComingSoonPage } from "@/components/utils/coming-soon-page";
import {
  getAllPartneredStores,
  getPartneredStore,
} from "@/server/vendor/actions";
import {
  getUserDetails,
  getAuthTokenServer,
  getUserIdFromTokenServer,
} from "@/server/user/actions";

export const metadata: Metadata = {
  title: "BVR STR CO",
  description:
    "Discover unique streetwear and products for Oregon State fans that support the Oregon State University student-athletes.",
  keywords: [
    "oregon state beavers",
    "dam nation collective",
    "oregon state collective",
    "oregon state nil",
    "oregon state beavers nil collective",
    "dam nation nil",
    "dam nation",
    "nil oregon state beavers",
    "beaver football nil",
    "beaver football collective",
    "beaver football",
    "beaver baseball",
    "oregon state streetwear",
    "vintage oregon state",
    "hypebeast",
    "oregon state clothing",
    "oregon state accessories",
    "oregon state lifestyle",
    "oregon state fashion",
    "oregon state beavers clothing",
    "oregon state beavers streetwear",
  ],
  authors: [{ name: "BVR STR CO" }],
  creator: "BVR STR CO",
  publisher: "BVR STR CO",
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    title: "BVR STR CO",
    description:
      "Discover unique streetwear and products for Oregon State fans that support the Oregon State University student-athletes.",
    url: "https://bvrstrco.com",
    siteName: "BVR STR CO",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://bvrstrco.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BVR STR CO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BVR STR CO",
    description:
      "Discover unique streetwear and products for Oregon State fans that support the Oregon State University student-athletes.",
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
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  const cart = getCart(cartId);
  const collections = await getCollections();
  const partners = await getAllPartneredStores();

  // Get user membership status
  let isMember = false;
  try {
    const authToken = await getAuthTokenServer();
    const userId = await getUserIdFromTokenServer();

    if (authToken && userId) {
      const userResult = await getUserDetails(authToken, userId);
      if (userResult.success && userResult.data) {
        isMember = userResult.data.isMember || false;
      }
    }
  } catch (error) {
    // Continue without membership status if error occurs
    isMember = false;
  }

  const isUnderConstructionFlag = await underConstructionFlag();
  const isComingSoonFlag = await comingSoonFlag();

  return (
    <html lang="en">
      <body className={`${ibm.variable} antialiased min-h-screen`}>
        <AuthProvider initialIsMember={isMember}>
          <CartProvider cartPromise={cart}>
            {isUnderConstructionFlag ? (
              <UnderConstructionPage />
            ) : !isUnderConstructionFlag && isComingSoonFlag ? (
              <ComingSoonPage />
            ) : (
              <>
                <Navbar collections={collections} partners={partners} />
                <main>
                  {children}
                  <Toaster closeButton />
                </main>
                <Footer />
              </>
            )}
          </CartProvider>
        </AuthProvider>
      </body>
      {/* UpPromote Pixel - Load the external script */}
      <Script
        src="https://static-pixel.uppromote.com/collect/v1/collect.js"
        strategy="afterInteractive"
      />

      {/* UpPromote Pixel Configuration - Cart Tracking Only */}
      <Script
        id="uppromote-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.upDataLayer = window.upDataLayer || []
            function upTag() { return upDataLayer.push(arguments) }
            upTag('config', 'myshopify_domain', '1budtj-uz.myshopify.com')
          `,
        }}
      />

      {/* Umami Analytics */}
      <Script
        src="https://umami.bvrstrco.com/script.js"
        data-website-id="58e0fb69-5e77-4c91-b2af-f0dac2eddf69"
        defer
      />
    </html>
  );
}
