import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { cookies } from "next/headers";

import Script from "next/script";
import { underConstructionFlag } from "@/lib/flags";
import { UnderConstructionPage } from "@/components/utils/under-construction-page";
import { PageTransitionContext } from "@/contexts/page-transition-context";
import { SmoothScrollingContext } from "@/contexts/smooth-scrolling-context";

export const metadata: Metadata = {
  title: "BVR ST CO",
  description: "An innovative studio supporting Oregon State student-athletes",
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
      "An innovative studio supporting Oregon State student-athletes",
    url: "https://bvrstco.com",
    siteName: "BVR ST CO",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://bvrstco.com/opengraph/index.png",
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
      "An innovative studio supporting Oregon State student-athletes",
    creator: "@bvrstco",
    site: "@bvrstco",
    images: ["https://bvrstco.com/opengraph/index.png"],
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

const vt = VT323({
  variable: "--font-vt",
  subsets: ["latin"],
  weight: "400",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const isUnderConstructionFlag = await underConstructionFlag();

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/oxp4xny.css" />
      </head>
      <body
        className={`${inter.variable} ${vt.variable} antialiased min-h-screen`}
        style={{
          backgroundImage: "url(/topo.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {isUnderConstructionFlag ? (
          <UnderConstructionPage />
        ) : (
          <PageTransitionContext>
            <SmoothScrollingContext>
              <Navbar />
              <main>
                {children}
                <Toaster closeButton position="bottom-center" richColors />
              </main>
              <Footer />
            </SmoothScrollingContext>
          </PageTransitionContext>
        )}
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
