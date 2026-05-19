import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { cookies } from "next/headers";

import { underConstructionFlag } from "@/lib/flags";
import { UnderConstructionPage } from "@/components/utils/under-construction-page";
import { SmoothScrollingContext } from "@/contexts/smooth-scrolling-context";

export const metadata: Metadata = {
  title: "BVR ST STUDIO",
  description: "An innovative studio supporting Oregon State student-athletes",
  keywords: [
    "oregon state beavers",
    "oregon state",
    "oregon state studio",
    "oregon state nvidia",
    "oregon state beavers studio nvidia",
    "osu beavers technology",
    "beavers nvidia",
  ],
  authors: [{ name: "BVR ST STUDIO" }],
  creator: "BVR ST STUDIO",
  publisher: "BVR ST STUDIO",
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    title: "BVR ST STUDIO",
    description:
      "An innovative studio supporting Oregon State student-athletes",
    url: "https://bvrst.studio",
    siteName: "BVR ST STUDIO",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://bvrst.studio/opengraph/index.png",
        width: 1200,
        height: 630,
        alt: "BVR ST STUDIO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BVR ST STUDIO",
    description:
      "An innovative studio supporting Oregon State student-athletes",
    creator: "@bvrststudio",
    site: "@bvrststudio",
    images: ["https://bvrst.studio/opengraph/index.png"],
  },
  metadataBase: new URL("https://bvrst.studio"),
  alternates: {
    canonical: "https://bvrst.studio",
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
          <SmoothScrollingContext>
            <Navbar />
            <main>
              {children}
              <Toaster closeButton position="bottom-center" richColors />
            </main>
            <Footer />
          </SmoothScrollingContext>
        )}
      </body>
    </html>
  );
}
