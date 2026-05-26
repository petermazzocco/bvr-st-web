import type { Metadata } from "next";

export interface MetadataOptions {
  title?: string;
  description?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  noIndex?: boolean;
  canonical?: string;
  type?: "website" | "article" | "profile";
  siteName?: string;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_SITE_NAME = "BVR ST STUDIO";
const DEFAULT_DESCRIPTION =
  "An innovative studio building the future of college athletics";
const DEFAULT_IMAGE = "https://bvrst.studio/og-image.jpg";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrst.studio";

export function generateMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image,
    noIndex = false,
    canonical,
    type = "website",
    siteName = DEFAULT_SITE_NAME,
    locale = "en_US",
    publishedTime,
    modifiedTime,
    section,
    tags,
  } = options;

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const imageUrl = image?.url || DEFAULT_IMAGE;
  const imageAlt = image?.alt || `${siteName} - ${title || "Homepage"}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName,
      locale,
      type,
      images: [
        {
          url: imageUrl,
          width: image?.width || 1200,
          height: image?.height || 630,
          alt: imageAlt,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@bvrststudio",
      site: "@bvrststudio",
    },
    alternates: {
      ...(canonical && { canonical }),
    },
  };

  return metadata;
}

export function generateArticleMetadata(options: {
  title: string;
  description: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
}): Metadata {
  return generateMetadata({
    title: options.title,
    description: options.description,
    image: options.image,
    type: "article",
    canonical: options.canonical,
    publishedTime: options.publishedTime,
    modifiedTime: options.modifiedTime,
    section: options.section,
    tags: options.tags,
    noIndex: options.noIndex,
  });
}
