/**
 * Utility type representing a value that can be either T or null
 * Commonly used in GraphQL APIs where fields might not be present
 */
export type Maybe<T> = T | null;

/**
 * GraphQL connection pattern for paginated data
 * Wraps arrays of data in edges/nodes structure for cursor-based pagination
 */
export type Connection<T> = {
  /** Array of edge objects containing node data */
  edges: Array<Edge<T>>;
};

/**
 * GraphQL edge containing a single node of data
 * Part of the connection pattern for paginated results
 */
export type Edge<T> = {
  /** The actual data object */
  node: T;
};

/**
 * Application cart type with flattened line items
 * Extends ShopifyCart but replaces the connection-based lines with a simple array
 */
export type Cart = Omit<ShopifyCart, "lines"> & {
  /** Flattened array of cart items (no GraphQL connection structure) */
  lines: CartItem[];
};

/**
 * Simplified product information included in cart items
 * Contains only the essential product data needed for cart display
 */
export type CartProduct = {
  /** Unique product identifier */
  id: string;
  /** URL-friendly product identifier */
  handle: string;
  /** Product display name */
  title: string;
  /** Main product image */
  featuredImage: Image;
};

/**
 * Individual item within a shopping cart
 * Contains product information, selected options, and pricing
 */
export type CartItem = {
  /** Unique identifier for this cart line item */
  id: string | undefined;
  /** Number of units of this item in the cart */
  quantity: number;
  /** Cost information for this line item */
  cost: {
    /** Total cost for this line item (price × quantity) */
    totalAmount: Money;
  };
  /** Product variant and selection information */
  merchandise: {
    /** Unique identifier for the product variant */
    id: string;
    /** Display title for the variant */
    title: string;
    /** Array of selected product options (size, color, etc.) */
    selectedOptions: {
      /** Option name (e.g., "Size", "Color") */
      name: string;
      /** Selected value (e.g., "Large", "Red") */
      value: string;
    }[];
    /** Simplified product information */
    product: CartProduct;
  };
};

/**
 * Application collection type with additional routing information
 * Extends ShopifyCollection with a path property for navigation
 */
export type Collection = ShopifyCollection & {
  /** Application path for routing to this collection */
  path: string;
};

/**
 * Image information for products, collections, and other media
 */
export type Image = {
  /** Full URL to the image file */
  url: string;
  /** Alternative text for accessibility */
  altText: string;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
};

/**
 * Navigation menu item
 * Used for building site navigation from Shopify menus
 */
export type Menu = {
  /** Display text for the menu item */
  title: string;
  /** Application path to navigate to */
  path: string;
};

/**
 * Monetary value with currency information
 * Used throughout the system for prices, costs, and financial amounts
 */
export type Money = {
  /** Numeric amount as string (e.g., "19.99") */
  amount: string;
  /** ISO 4217 currency code (e.g., "USD", "EUR") */
  currencyCode: string;
};

/**
 * Static page content from Shopify
 * Used for About, FAQ, Terms of Service, and other content pages
 */
export type Page = {
  /** Unique page identifier */
  id: string;
  /** Page title for display and SEO */
  title: string;
  /** URL-friendly page identifier */
  handle: string;
  /** Full page content in HTML */
  body: string;
  /** Shortened version of page content for previews */
  bodySummary: string;
  /** SEO metadata (optional) */
  seo?: SEO;
  /** ISO timestamp when page was created */
  createdAt: string;
  /** ISO timestamp when page was last updated */
  updatedAt: string;
};

/**
 * Application product type with flattened variants and images
 * Extends ShopifyProduct but replaces connection-based fields with simple arrays
 */
export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
  /** Flattened array of product variants */
  variants: ProductVariant[];
  /** Flattened array of product images */
  images: Image[];
};

/**
 * Product configuration option (size, color, material, etc.)
 * Defines the available choices customers can make when purchasing
 */
export type ProductOption = {
  /** Unique option identifier */
  id: string;
  /** Option display name (e.g., "Size", "Color") */
  name: string;
  /** Available values for this option (e.g., ["Small", "Medium", "Large"]) */
  values: string[];
};

/**
 * Specific product variant representing a unique combination of options
 * Each variant has its own price, availability, and option selections
 */
export type ProductVariant = {
  /** Unique variant identifier */
  id: string;
  /** Variant display title (e.g., "Small / Red") */
  title: string;
  /** Whether this variant is currently available for purchase */
  availableForSale: boolean;
  /** The specific option values selected for this variant */
  selectedOptions: {
    /** Option name (e.g., "Size") */
    name: string;
    /** Selected value (e.g., "Small") */
    value: string;
  }[];
  /** Price for this specific variant */
  price: Money;
};

/**
 * SEO metadata for pages, products, and collections
 * Used to optimize search engine visibility
 */
export type SEO = {
  /** SEO-optimized title for search results */
  title: string;
  /** Meta description for search results */
  description: string;
};

/**
 * Raw Shopify cart data with GraphQL connection structure
 * Used internally before transformation to application Cart type
 */
export type ShopifyCart = {
  /** Unique cart identifier */
  id: string | undefined;
  /** URL for proceeding to checkout */
  checkoutUrl: string;
  /** Cost breakdown for the entire cart */
  cost: {
    /** Subtotal before taxes and shipping */
    subtotalAmount: Money;
    /** Final total including all fees */
    totalAmount: Money;
    /** Total tax amount */
    totalTaxAmount: Money;
  };
  /** Cart items in GraphQL connection format */
  lines: Connection<CartItem>;
  /** Total number of items in cart (sum of all quantities) */
  totalQuantity: number;
};

/**
 * Raw Shopify collection data
 * Used internally before transformation to application Collection type
 */
export type ShopifyCollection = {
  /** URL-friendly collection identifier */
  handle: string;
  /** Collection display name */
  title: string;
  /** Collection description text */
  description: string;
  /** SEO metadata */
  seo: SEO;
  /** ISO timestamp when collection was last updated */
  updatedAt: string;
};

/**
 * Raw Shopify product data with GraphQL connection structure
 * Used internally before transformation to application Product type
 */
export type ShopifyProduct = {
  /** Unique product identifier */
  id: string;
  /** URL-friendly product identifier */
  handle: string;
  /** Whether the product is available for purchase */
  availableForSale: boolean;
  /** Product display name */
  title: string;
  /** Product description in plain text */
  description: string;
  /** Product description in HTML format */
  descriptionHtml: string;
  /** Available product options (size, color, etc.) */
  options: ProductOption[];
  /** Price range across all variants */
  priceRange: {
    /** Highest priced variant */
    maxVariantPrice: Money;
    /** Lowest priced variant */
    minVariantPrice: Money;
  };
  /** Product variants in GraphQL connection format */
  variants: Connection<ProductVariant>;
  /** Main product image */
  featuredImage: Image;
  /** All product images in GraphQL connection format */
  images: Connection<Image>;
  /** SEO metadata */
  seo: SEO;
  /** Product tags for categorization and filtering */
  tags: string[];
  /** ISO timestamp when product was last updated */
  updatedAt: string;
};

/**
 * GraphQL operation type for fetching a single cart
 */
export type ShopifyCartOperation = {
  /** Response data structure */
  data: {
    /** The requested cart object */
    cart: ShopifyCart;
  };
  /** Required variables for the operation */
  variables: {
    /** ID of the cart to retrieve */
    cartId: string;
  };
};

/**
 * GraphQL operation type for creating a new cart
 */
export type ShopifyCreateCartOperation = {
  /** Response data structure */
  data: {
    /** Cart creation result */
    cartCreate: {
      /** The newly created cart */
      cart: ShopifyCart;
    };
  };
};

/**
 * GraphQL operation type for adding items to a cart
 */
export type ShopifyAddToCartOperation = {
  /** Response data structure */
  data: {
    /** Add to cart operation result */
    cartLinesAdd: {
      /** Updated cart after adding items */
      cart: ShopifyCart;
    };
  };
  /** Required variables for the operation */
  variables: {
    /** ID of the cart to add items to */
    cartId: string;
    /** Array of items to add */
    lines: {
      /** Product variant ID */
      merchandiseId: string;
      /** Quantity to add */
      quantity: number;
    }[];
  };
};

/**
 * GraphQL operation type for removing items from a cart
 */
export type ShopifyRemoveFromCartOperation = {
  /** Response data structure */
  data: {
    /** Remove from cart operation result */
    cartLinesRemove: {
      /** Updated cart after removing items */
      cart: ShopifyCart;
    };
  };
  /** Required variables for the operation */
  variables: {
    /** ID of the cart to remove items from */
    cartId: string;
    /** Array of line item IDs to remove */
    lineIds: string[];
  };
};

/**
 * GraphQL operation type for updating cart item quantities
 */
export type ShopifyUpdateCartOperation = {
  /** Response data structure */
  data: {
    /** Update cart operation result */
    cartLinesUpdate: {
      /** Updated cart after quantity changes */
      cart: ShopifyCart;
    };
  };
  /** Required variables for the operation */
  variables: {
    /** ID of the cart to update */
    cartId: string;
    /** Array of line items with updated quantities */
    lines: {
      /** Line item ID */
      id: string;
      /** Product variant ID */
      merchandiseId: string;
      /** New quantity */
      quantity: number;
    }[];
  };
};

/**
 * GraphQL operation type for fetching a single collection
 */
export type ShopifyCollectionOperation = {
  /** Response data structure */
  data: {
    /** The requested collection */
    collection: ShopifyCollection;
  };
  /** Required variables for the operation */
  variables: {
    /** Collection handle/slug */
    handle: string;
  };
};

/**
 * GraphQL operation type for fetching products within a collection
 */
export type ShopifyCollectionProductsOperation = {
  /** Response data structure */
  data: {
    /** Collection with its products */
    collection: {
      /** Products in this collection */
      products: Connection<ShopifyProduct>;
    };
  };
  /** Required variables for the operation */
  variables: {
    /** Collection handle/slug */
    handle: string;
    /** Whether to reverse sort order */
    reverse?: boolean;
    /** Field to sort by */
    sortKey?: string;
  };
};

/**
 * GraphQL operation type for fetching all collections
 */
export type ShopifyCollectionsOperation = {
  /** Response data structure */
  data: {
    /** All collections in the store */
    collections: Connection<ShopifyCollection>;
  };
};

/**
 * GraphQL operation type for fetching a navigation menu
 */
export type ShopifyMenuOperation = {
  /** Response data structure */
  data: {
    /** The requested menu (optional) */
    menu?: {
      /** Array of menu items */
      items: {
        /** Menu item display text */
        title: string;
        /** Menu item URL */
        url: string;
      }[];
    };
  };
  /** Required variables for the operation */
  variables: {
    /** Menu handle/identifier */
    handle: string;
  };
};

/**
 * GraphQL operation type for fetching a single page
 */
export type ShopifyPageOperation = {
  /** Response data structure */
  data: {
    /** The requested page */
    pageByHandle: Page;
  };
  /** Required variables for the operation */
  variables: {
    /** Page handle/slug */
    handle: string;
  };
};

/**
 * GraphQL operation type for fetching all pages
 */
export type ShopifyPagesOperation = {
  /** Response data structure */
  data: {
    /** All pages in the store */
    pages: Connection<Page>;
  };
};

/**
 * GraphQL operation type for fetching a single product
 */
export type ShopifyProductOperation = {
  /** Response data structure */
  data: {
    /** The requested product */
    product: ShopifyProduct;
  };
  /** Required variables for the operation */
  variables: {
    /** Product handle/slug */
    handle: string;
  };
};

/**
 * GraphQL operation type for fetching product recommendations
 */
export type ShopifyProductRecommendationsOperation = {
  /** Response data structure */
  data: {
    /** Array of recommended products */
    productRecommendations: ShopifyProduct[];
  };
  /** Required variables for the operation */
  variables: {
    /** Product ID to base recommendations on */
    productId: string;
  };
};

/**
 * GraphQL operation type for searching/fetching products
 */
export type ShopifyProductsOperation = {
  /** Response data structure */
  data: {
    /** Search results or all products */
    products: Connection<ShopifyProduct>;
  };
  /** Required variables for the operation */
  variables: {
    /** Search query string */
    query?: string;
    /** Whether to reverse sort order */
    reverse?: boolean;
    /** Field to sort by */
    sortKey?: string;
  };
};
