import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "@/lib/constants";
import { isShopifyError } from "@/lib/type-guards";
import { ensureStartsWith } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
  updateCartBuyerIdentityMutation,
  applyDiscountCodeMutation,
  cartAttributesUpdateMutation,
} from "./mutations/cart";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQuery } from "./queries/page";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import {
  getAuctionQuery,
  getAuctionsQuery,
  getAuctionProductsQuery,
} from "./queries/auctions";
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

/**
 * Utility type to extract variables from a GraphQL operation type
 */
type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

/**
 * Generic function for making GraphQL requests to the Shopify Storefront API
 * @param config - Configuration object for the request
 * @param config.cache - Cache strategy for the request (default: "no-store")
 * @param config.headers - Additional headers to include in the request
 * @param config.query - GraphQL query string
 * @param config.tags - Next.js cache tags for revalidation
 * @param config.variables - GraphQL variables for the query
 * @returns Promise containing the response status and parsed body
 * @throws Formatted error object if the request fails or GraphQL errors occur
 */
export async function shopifyFetch<T>({
  cache = "no-store",
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

/**
 * Utility function to flatten GraphQL connection structure by extracting nodes from edges
 * @param array - GraphQL connection object with edges and nodes structure
 * @returns Flattened array of node objects
 */
const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

/**
 * Transforms Shopify cart data into application cart format
 * Ensures totalTaxAmount exists and flattens line items
 * @param cart - Raw Shopify cart object
 * @returns Reshaped cart object with flattened structure
 */
const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

/**
 * Transforms Shopify collection data into application collection format
 * Adds a path property for routing
 * @param collection - Raw Shopify collection object
 * @returns Reshaped collection object with path, or undefined if collection is null
 */
const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/collections/${collection.handle}`,
  };
};

/**
 * Transforms an array of Shopify collections into application collection format
 * Filters out null/undefined collections
 * @param collections - Array of raw Shopify collection objects
 * @returns Array of reshaped collection objects
 */
const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

/**
 * Transforms product images from GraphQL connection format and ensures alt text
 * @param images - GraphQL connection of image objects
 * @param productTitle - Product title used for fallback alt text
 * @returns Flattened array of images with guaranteed alt text
 */
const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

/**
 * Transforms Shopify product data into application product format
 * Optionally filters out products marked as hidden
 * @param product - Raw Shopify product object
 * @param filterHiddenProducts - Whether to filter out hidden products (default: true)
 * @returns Reshaped product object with flattened images and variants, or undefined if filtered out
 */
const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

/**
 * Transforms an array of Shopify products into application product format
 * Filters out null/undefined products and hidden products
 * @param products - Array of raw Shopify product objects
 * @returns Array of reshaped product objects
 */
const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

/**
 * Creates a new empty shopping cart in Shopify
 * @returns Promise containing the newly created cart object
 */
export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

/**
 * Adds items to an existing shopping cart
 * @param cartId - Unique identifier of the cart to add items to
 * @param lines - Array of items to add, each with merchandiseId and quantity
 * @returns Promise containing the updated cart object
 */
export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

/**
 * Removes specific line items from a shopping cart
 * @param cartId - Unique identifier of the cart to remove items from
 * @param lineIds - Array of line item IDs to remove
 * @returns Promise containing the updated cart object
 */
export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

/**
 * Updates quantities of existing items in a shopping cart
 * @param cartId - Unique identifier of the cart to update
 * @param lines - Array of line items with updated quantities
 * @param buyerIdentity - Optional buyer identity data for checkout prepopulation
 * @returns Promise containing the updated cart object
 */
export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
  buyerIdentity?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      street: string;
      apt?: string;
      zip: string;
      city: string;
      state: string;
      country: string;
    };
  },
): Promise<Cart> {
  // If buyer identity is provided, update it first
  if (buyerIdentity) {
    try {
      await updateCartBuyerIdentity(cartId, buyerIdentity);
    } catch (error) {
      console.error("Error updating cart buyer identity:", error);
      // Continue with line updates even if buyer identity update fails
    }
  }

  // Only update lines if there are any to update
  if (lines.length > 0) {
    const res = await shopifyFetch<ShopifyUpdateCartOperation>({
      query: editCartItemsMutation,
      variables: {
        cartId,
        lines,
      },
      cache: "no-store",
    });

    return reshapeCart(res.body.data.cartLinesUpdate.cart);
  } else {
    // If no lines to update, just return the current cart
    const cart = await getCart(cartId);
    return cart!;
  }
}

/**
 * Updates buyer identity information for checkout prepopulation
 * @param cartId - Unique identifier of the cart to update
 * @param buyerIdentity - Buyer identity data
 * @returns Promise containing the updated cart object
 */
export async function updateCartBuyerIdentity(
  cartId: string,
  buyerIdentity: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      street: string;
      apt?: string;
      zip: string;
      city: string;
      state: string;
      country: string;
    };
  },
): Promise<Cart> {
  const buyerIdentityInput: any = {};

  if (buyerIdentity.email) {
    buyerIdentityInput.email = buyerIdentity.email;
  }

  if (buyerIdentity.phone) {
    buyerIdentityInput.phone = buyerIdentity.phone;
  }

  // Handle delivery address
  if (buyerIdentity.address) {
    buyerIdentityInput.deliveryAddressPreferences = [
      {
        deliveryAddress: {
          address1: buyerIdentity.address.street,
          address2: buyerIdentity.address.apt || "",
          city: buyerIdentity.address.city,
          province: buyerIdentity.address.state,
          zip: buyerIdentity.address.zip,
          country: buyerIdentity.address.country,
          firstName: buyerIdentity.firstName || "",
          lastName: buyerIdentity.lastName || "",
        },
      },
    ];
  }

  const res = await shopifyFetch<any>({
    query: updateCartBuyerIdentityMutation,
    variables: {
      cartId,
      buyerIdentity: buyerIdentityInput,
    },
    cache: "no-store",
  });

  if (res.body.data.cartBuyerIdentityUpdate.userErrors?.length > 0) {
    console.error(
      "Buyer identity update errors:",
      res.body.data.cartBuyerIdentityUpdate.userErrors,
    );
  }

  return reshapeCart(res.body.data.cartBuyerIdentityUpdate.cart);
}

/**
 * Applies discount codes to a shopping cart
 * @param cartId - Unique identifier of the cart to apply discount to
 * @param discountCodes - Array of discount codes to apply
 * @returns Promise containing the updated cart object
 */
export async function applyDiscountCode(
  cartId: string,
  discountCodes: string[],
): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: applyDiscountCodeMutation,
    variables: {
      cartId,
      discountCodes,
    },
    cache: "no-store",
  });

  if (res.body.data.cartDiscountCodesUpdate.userErrors?.length > 0) {
    console.error(
      "Discount code application errors:",
      res.body.data.cartDiscountCodesUpdate.userErrors,
    );
  }

  return reshapeCart(res.body.data.cartDiscountCodesUpdate.cart);
}

/**
 * Retrieves a shopping cart by its ID
 * @param cartId - Unique identifier of the cart to retrieve (optional)
 * @returns Promise containing the cart object, or undefined if cart doesn't exist
 */
export async function getCart(
  cartId: string | undefined,
): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

/**
 * Retrieves a collection by its handle/slug
 * @param handle - URL handle/slug of the collection
 * @returns Promise containing the collection object, or undefined if not found
 */
export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
    },
  });

  return reshapeCollection(res.body.data.collection);
}

/**
 * Retrieves products from a specific collection with optional sorting
 * @param config - Configuration object for the query
 * @param config.collection - Handle/slug of the collection
 * @param config.reverse - Whether to reverse the sort order (optional)
 * @param config.sortKey - Field to sort by (optional)
 * @returns Promise containing array of products in the collection
 */
export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products),
  );
}

/**
 * Retrieves all collections from the store
 * Includes a special "All" collection and filters out hidden collections
 * @returns Promise containing array of all visible collections
 */
export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/collections",
      updatedAt: new Date().toISOString(),
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden"),
    ),
  ];

  return collections;
}

/**
 * Retrieves a navigation menu by its handle
 * Transforms Shopify menu URLs to application-friendly paths
 * @param handle - Handle/identifier of the menu to retrieve
 * @returns Promise containing array of menu items with title and path
 */
export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
    },
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
    })) || []
  );
}

/**
 * Retrieves a single page by its handle/slug
 * @param handle - URL handle/slug of the page
 * @returns Promise containing the page object
 */
export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    cache: "no-store",
    variables: { handle },
  });

  return res.body.data.pageByHandle;
}

/**
 * Retrieves all pages from the store
 * @returns Promise containing array of all pages
 */
export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: "no-store",
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

/**
 * Retrieves a single product by its handle/slug
 * @param handle - URL handle/slug of the product
 * @returns Promise containing the product object, or undefined if not found
 */
export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    },
  });

  return reshapeProduct(res.body.data.product, false);
}

/**
 * Retrieves product recommendations based on a given product
 * @param productId - Shopify product ID to get recommendations for
 * @returns Promise containing array of recommended products
 */
export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId,
    },
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

/**
 * Searches for products with optional filtering and sorting
 * @param config - Configuration object for the search
 * @param config.query - Search query string (optional)
 * @param config.reverse - Whether to reverse the sort order (optional)
 * @param config.sortKey - Field to sort by (optional)
 * @returns Promise containing array of matching products
 */
export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

/**
 * Handles Shopify webhook revalidation requests
 * Called from API route to revalidate Next.js cache when Shopify data changes
 * @param req - Next.js request object containing webhook data
 * @returns Next.js response with revalidation status
 */
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

/**
 * Retrieves a single auction by its handle/slug
 * @param handle - URL handle/slug of the auction
 * @returns Promise containing the auction object, or undefined if not found
 */
export async function getAuction(handle: string): Promise<any | undefined> {
  const res = await shopifyFetch<any>({
    query: getAuctionQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
    },
  });

  return res.body.data.metaobject;
}

/**
 * Retrieves all auctions from the store
 * @returns Promise containing array of all auctions
 */
export async function getAuctions(): Promise<any[]> {
  const res = await shopifyFetch<any>({
    query: getAuctionsQuery,
    tags: [TAGS.collections],
  });

  return removeEdgesAndNodes(res.body.data.metaobjects);
}

/**
 * Retrieves products from a specific auction
 * @param auctionHandle - Handle/slug of the auction
 * @returns Promise containing array of products in the auction
 */
export async function getAuctionProducts(
  auctionHandle: string,
): Promise<Product[]> {
  const res = await shopifyFetch<any>({
    query: getAuctionProductsQuery,
    tags: [TAGS.products],
    variables: {
      auctionHandle,
    },
  });

  if (!res.body.data.metaobject) {
    console.log(`No auction found for \`${auctionHandle}\``);
    return [];
  }

  const productReferences =
    res.body.data.metaobject.fields.find(
      (field: any) => field.key === "products",
    )?.references?.edges || [];

  return reshapeProducts(productReferences.map((edge: any) => edge.node));
}

/**
 * Sets affiliate metafield on a shopping cart
 * @param cartId - Unique identifier of the cart to set metafield on
 * @param affiliateCode - Affiliate code to set as metafield value
 * @returns Promise containing the updated cart object
 */
export async function setCartAttribute(
  cartId: string,
  affiliateCode: string,
): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: cartAttributesUpdateMutation,
    variables: {
      cartId,
      attributes: [
        {
          key: "affiliate_code",
          value: affiliateCode,
        },
      ],
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartAttributesUpdate.cart);
}
