import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import { CartProvider } from "@/components/cart/cart-context";
import { AuthProvider } from "@/components/auth/auth-context";
import Script from "next/script";
import { underConstructionFlag } from "@/lib/flags";
import { UnderConstructionPage } from "@/components/utils/under-construction-page";
import {
  getUserDetails,
  getAuthTokenServer,
  getUserIdFromTokenServer,
} from "@/server/user/actions";
import PageTransitionContext from "@/contexts/page-transition-context";

export const metadata: Metadata = {
  title: "BVR ST CO",
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
  authors: [{ name: "BVR ST CO" }],
  creator: "BVR ST CO",
  publisher: "BVR ST CO",
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    title: "BVR ST CO",
    description:
      "The new way to support Oregon State University student-athletes.",
    url: "https://bvrstco.com",
    siteName: "BVR ST CO",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "BVR ST CO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BVR ST CO",
    description:
      "The new way to support Oregon State University student-athletes.",
    creator: "@bvrstco",
    site: "@bvrstco",
    images: ["/logo.png"],
  },
  metadataBase: new URL("https://bvrstco.com"),
  alternates: {
    canonical: "https://bvrstco.com",
  },
};

const inter = Inter({
  variable: "--font-inter",
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

  // Get initial auth state server-side
  let initialAuthState = {
    token: null as string | null,
    userId: null as string | null,
    isAuthenticated: false,
    isMember: false,
  };

  try {
    const authToken = await getAuthTokenServer();
    const userId = await getUserIdFromTokenServer();

    if (authToken && userId) {
      const userResult = await getUserDetails(authToken, userId);
      if (userResult.success && userResult.data) {
        initialAuthState = {
          token: authToken,
          userId: userId,
          isAuthenticated: true,
          isMember: userResult.data.isMember || false,
        };
      }
    }
  } catch (error) {
    // Continue with default auth state if error occurs
    initialAuthState = {
      token: null,
      userId: null,
      isAuthenticated: false,
      isMember: false,
    };
  }

  const isUnderConstructionFlag = await underConstructionFlag();

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/oxp4xny.css" />
      </head>
      <body
        className={`${inter.variable} antialiased min-h-screen`}
        style={{
          backgroundImage: "url(/topo.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AuthProvider initialAuthState={initialAuthState}>
          <CartProvider cartPromise={cart}>
            {isUnderConstructionFlag ? (
              <UnderConstructionPage />
            ) : (
              <>
                <Navbar />
                <main>
                  {children}
                  <Toaster closeButton position="bottom-center" richColors />
                </main>
                <Footer />
              </>
            )}
          </CartProvider>
        </AuthProvider>
      </body>

      {/* Umami Analytics */}
      <Script
        src="https://umami.bvrstco.com/script.js"
        data-website-id="58e0fb69-5e77-4c91-b2af-f0dac2eddf69"
        defer
      />
    </html>
  );
}
