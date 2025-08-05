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
  price?: {
    amount: string;
    currency: string;
  };
}

const DEFAULT_SITE_NAME = "BVR ST CO";
const DEFAULT_DESCRIPTION =
  "Discover unique streetwear and fashion from independent brands and partner stores. Quality clothing, accessories, and lifestyle products curated for the modern streetwear enthusiast.";
const DEFAULT_IMAGE = "https://bvrstco.com/og-image.jpg"; // You should add this image to your public folder
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrstco.com";

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
    price,
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
      creator: "@bvrstco",
      site: "@bvrstco",
    },
    alternates: {
      ...(canonical && { canonical }),
    },
    other: {
      ...(price && {
        "product:price:amount": price.amount,
        "product:price:currency": price.currency,
      }),
    },
  };

  return metadata;
}

export function generateProductMetadata(options: {
  title: string;
  description: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  price?: {
    amount: string;
    currency: string;
  };
  availability?: boolean;
  sku?: string;
  canonical?: string;
  noIndex?: boolean;
}): Metadata {
  const baseMetadata = generateMetadata({
    title: options.title,
    description: options.description,
    image: options.image,
    type: "website",
    canonical: options.canonical,
    noIndex: options.noIndex,
    price: options.price,
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: "website",
      ...(options.price && {
        productPriceAmount: options.price.amount,
        productPriceCurrency: options.price.currency,
      }),
      ...(options.availability !== undefined && {
        productAvailability: options.availability ? "in stock" : "out of stock",
      }),
    },
    other: {
      ...Object.fromEntries(
        Object.entries(baseMetadata.other || {}).filter(
          ([_, value]) => value !== undefined,
        ),
      ),
      ...(options.sku && { "product:retailer_item_id": options.sku }),
    },
  };
}

export function generateCollectionMetadata(options: {
  title: string;
  description: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  canonical?: string;
  noIndex?: boolean;
  productCount?: number;
}): Metadata {
  const enhancedDescription = options.productCount
    ? `${options.description} Browse ${options.productCount} curated products in this collection.`
    : options.description;

  return generateMetadata({
    title: options.title,
    description: enhancedDescription,
    image: options.image,
    type: "website",
    canonical: options.canonical,
    noIndex: options.noIndex,
  });
}

export function generateStoreMetadata(options: {
  storeName: string;
  description: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  canonical?: string;
  noIndex?: boolean;
}): Metadata {
  return generateMetadata({
    title: `${options.storeName} - Partner Store`,
    description: `${options.description} Shop exclusive products from ${options.storeName}, a trusted partner store on BVR ST CO.`,
    image: options.image,
    type: "website",
    canonical: options.canonical,
    noIndex: options.noIndex,
  });
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
