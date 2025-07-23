/**
 * Represents a complete user profile with all associated data
 */
export interface User {
  /** Unique identifier for the user */
  id: number;
  /** User's firstName name */
  firstName: string;
  /** User's lastName name */
  lastName: string;
  /** User's phone number */
  phone: string;
  /** User's physical address information */
  address: Address;
  /** User's email address */
  email: string;
  /** User's encrypted password */
  password?: string;
  /** Current reward points balance */
  points: number;
  /** Array of orders placed by the user */
  orders: Order[];
  /** User's marketing opt-in status */
  optInMarketing: boolean;
  /** User's rewards opt-in status */
  optInRewards: boolean;
  /** Stripe customer ID for payment processing */
  stripeCustomerID: string;
  /** Shopify customer ID for payment processing */
  shopifyCustomerID: string;
  /** User's membership status */
  isMember: boolean;
  /** User's email verification status */
  emailVerified: boolean;
  /** User's OAuth provider */
  oauthProvider?: string;
  /** ISO timestamp when the user account was created */
  createdAt: string;
  /** ISO timestamp when the user account was last updated */
  updatedAt: string;
  /** ISO timestamp when the user account was deleted (if applicable) */
  deletedAt?: string;
}

/**
 * Represents a physical address
 */
export interface Address {
  /** Street address line */
  street: string;
  /** Apartment, suite, or unit number (optional) */
  apt?: string;
  /** ZIP or postal code */
  zip: string;
  /** City name */
  city: string;
  /** State or province */
  state: string;
}

/**
 * Represents a customer order containing products and tracking information
 */
export interface Order {
  /** Unique identifier for the order */
  id: string;
  /** ID of the user who placed the order */
  userID: string;
  /** Total price of the order including taxes and fees */
  total: number;
  /** Array of products included in the order */
  products: Product[];
  /** Tracking number for shipment */
  tracking: string;
  /** Current status of the order (e.g., 'pending', 'shipped', 'delivered') */
  status: string;
  /** ISO timestamp when the order was created */
  createdAt: string;
  /** ISO timestamp when the order was last updated */
  updatedAt: string;
  /** ISO timestamp when the order was deleted (if applicable) */
  deletedAt?: string;
}

/**
 * Represents a product item within an order
 */
export interface Product {
  /** Unique identifier for the product */
  id: string;
  /** Product name or title */
  name: string;
  /** URL or path to the product's image */
  image: string;
  /** Price per unit of the product */
  price: number;
  /** Number of units ordered */
  quantity: number;
  /** Size specification (e.g., 'S', 'M', 'L', '10oz', etc.) */
  size: string;
}

/**
 * Represents the data needed to update a user's profile information
 * Contains only the fields that can be modified by the user
 */
export interface UpdateUser {
  /** User's firstName name */
  firstName: string;
  /** User's lastName name */
  lastName: string;
  /** User's phone number */
  phone: string;
  /** User's physical address information */
  address: Address;
  /** User's email address */
  email: string;
}

/**
 * Represents the data needed to sign a new user up.
 * Contains only the fields that are required for user registration
 */
export interface UserSignUp {
  /** User's firstName name */
  firstName: string;
  /** User's lastName name */
  lastName: string;
  /** User's phone number */
  phone: string;
  /** User's physical address information */
  address: Address;
  /** User's email address */
  email: string;
  /** User's password */
  password: string | undefined;
}

/**
 * Represents a notification via Sanity CMS
 */
export interface Notification {
  /** Unique identifier for the notification */
  _id: string;
  /** Title text of the notification */
  title: string;
  /** Image associated with the notification */
  image: Image;
  /** Route/URL the notification links to */
  route: string;
  /** ISO timestamp when the notification was created */
  createdAt: string;
  /** ISO timestamp when the notification expires */
  expiresAt: string;
  /** Array of user IDs this notification targets (empty array means all users) */
  targetUsers: string[];
  /** Minimum points required to see this notification */
  minimumPoints: number;
  /** Array of read records for users who have read this notification */
  readBy: ReadRecord[];
  /** Whether the notification is currently active */
  isActive: boolean;
}

/**
 * Represents a team member via Sanity CMS
 */
export interface Team {
  /** Unique identifier for the team member */
  _id: string;
  /** Title/role of the team member */
  title: string;
  /** Profile image of the team member */
  image: Image;
  /** Name of the team member */
  name: string;
  /** Tier/level of the team member */
  tier: string;
}

/**
 * Represents a blog post via Sanity CMS
 */
export interface Post {
  /** Unique identifier for the post */
  _id: string;
  /** Title of the post */
  title: string;
  /** Author of the post */
  author: string;
  /** Author's profile image */
  author_image: Image;
  /** URL slug for the post */
  slug: Slug;
  /** ISO timestamp when the post was published */
  publishedAt: string;
  /** Featured image for the post */
  image: Image;
  /** Array of block content representing the post body */
  body: Block[];
}

/**
 * Represents a legal document via Sanity CMS
 */
export interface Doc {
  /** Unique identifier for the document */
  _id: string;
  /** Title of the document */
  title: string;
  /** URL slug for the document */
  slug: Slug;
  /** Array of block content representing the document body */
  body: Block[];
  /** ISO timestamp when the document was last updated */
  updatedAt: string;
}

/**
 * Represents the hero section via Sanity CMS
 */
export interface HeroSection {
  /** Unique identifier for the hero section */
  _id: string;
  /** Main heading text displayed in the hero section */
  heading: string;
  /** Background or featured image for the hero section */
  image: Image;
  /** Text displayed on the call-to-action button */
  buttonText: string;
  /** Route/URL the button links to */
  buttonRoute: string;
}

/**
 * Represents a featured product via Sanity CMS
 */
export interface FeaturedProduct {
  /** Unique identifier for the featured product */
  _id: string;
  /** Product name or title */
  name: string;
  /** Featured image for the product */
  image: Image;
  /** Product price */
  price: number;
  /** URL slug for the product */
  slug: Slug;
}

/**
 * Represents a featured collection via Sanity CMS
 */
export interface FeaturedCollection {
  /** Unique identifier for the featured collection */
  _id: string;
  /** Collection name or title */
  name: string;
  /** Featured image for the collection */
  image: Image;
  /** URL slug for the collection */
  slug: Slug;
  /** Brief description of the collection */
  description?: string;
}

/**
 * Helper type for Sanity image
 */
export interface Image {
  /** Asset reference containing the actual image data */
  asset: Asset;
}

/**
 * Helper type for Sanity asset
 */
export interface Asset {
  /** Unique identifier for the asset */
  _id: string;
  /** URL to access the asset */
  url: string;
}

/**
 * Helper type for Sanity slug
 */
export interface Slug {
  /** Current slug value used in URLs */
  current: string;
}

/**
 * Represents a Sanity block content element
 */
export interface Block {
  /** Type of the block content */
  _type: string;
  /** Unique key for the block */
  _key?: string;
  /** Style of the block (normal, h1, h2, etc.) */
  style?: string;
  /** Children elements containing text and formatting */
  children?: Array<{
    _type: string;
    _key?: string;
    text: string;
    marks?: string[];
  }>;
  /** Mark definitions for links and other formatting */
  markDefs?: Array<{
    _type: string;
    _key?: string;
    href?: string;
  }>;
}

/**
 * Represents a user's read record for notifications
 */
export interface ReadRecord {
  /** ID of the user who read the notification */
  userId: number;
  /** ISO timestamp when the notification was read */
  readAt: string;
}

/**
 * Common result type for consistent error handling
 */
export type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Type definitions for the API responses matching Go models
export interface CardInfo {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  country: string;
}

export interface BankInfo {
  bank: string;
  last4: string;
  account_type: string;
}

export interface PaymentMethodInfo {
  id: string;
  type: string;
  created_at: string;
  is_default: boolean;
  card?: CardInfo;
  bank?: BankInfo;
}

export interface LastPaymentInfo {
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  paid_at: string;
}

export interface SubscriptionPaymentInfo {
  customer_id: string;
  subscription_id: string;
  status: string;
  payment_methods: PaymentMethodInfo[];
  default_payment: PaymentMethodInfo | null;
  last_payment: LastPaymentInfo | null;
}
// Base bid interface for common bid properties
interface BaseBid {
  customer_id: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  currency: string;
  bid: number;
  bid_date: string; // ISO 8601 date string
}

// Auction bid type
type AuctionBid = BaseBid;

// Automatic bid type
type AutomaticBid = BaseBid;

// Main auction configuration
interface AuctionConfig {
  shopify_product_id: string;
  starting_price: number;
  end_price: number | null;
  minimum_bid_increment: number;
  maximum_bid_increment: number;
  buy_it_now_price: number;
  reserve_price: number | null;
  reserve_price_show: boolean | null;
  highest_bid: number;
  bid_count: number;
  real_time_auction: boolean;
  enable_automatic_bids: boolean;
  popcorn_bidding_settings: unknown | null; // Type unknown since value is null
  end_date: string; // ISO 8601 date string
}

// Root auction object
interface Auction {
  auction: AuctionConfig;
  auction_bids: AuctionBid[];
  automatic_bids: AutomaticBid[];
}

// Export all types
export type { Auction, AuctionConfig, AuctionBid, AutomaticBid, BaseBid };

// Optional: More specific currency type if you have a limited set
type Currency = "USD" | "EUR" | "GBP" | "CAD"; // Add more as needed

// Optional: Enhanced types with specific currency
interface EnhancedAuctionBid extends Omit<AuctionBid, "currency"> {
  currency: Currency;
}

interface EnhancedAutomaticBid extends Omit<AutomaticBid, "currency"> {
  currency: Currency;
}

export type { Currency, EnhancedAuctionBid, EnhancedAutomaticBid };

// POST request body for creating/placing a bid
interface PlaceBidRequest {
  bid?: string; // String containing a number
  currency?: string; // Valid currency symbol (USD, EUR, CAD, etc.)
  customer_email?: string; // Valid customer email address
  customer_id?: string; // Customer ID (added to match curl command)
  customer_first_name?: string; // Valid customer first name
  customer_last_name?: string; // Valid customer last name
  shopify_product_id?: string; // Valid Shopify product ID
}

// Response type for place bid API
export interface PlaceBidResponse {
  bid: string;
  bid_date: string; // ISO 8601 date string
  currency: string;
  customer_first_name: string; // May be masked (e.g., "T***")
  customer_id: string;
  customer_last_name: string; // May be masked (e.g., "T***")
}

// Optional: Enhanced version with stricter typing
interface EnhancedPlaceBidRequest
  extends Omit<PlaceBidRequest, "currency" | "bid"> {
  bid: string; // Keep as string since API expects string representation of number
  currency: Currency; // Use the stricter Currency type
}

// Optional: Validation helper types
type EmailString = string & { __brand: "email" };
type ProductId = string & { __brand: "product_id" };
type BidAmount = string & { __brand: "bid_amount" };

// Optional: Strictly typed version with branded types
interface StrictPlaceBidRequest {
  bid: BidAmount;
  currency: Currency;
  customer_email: EmailString;
  customer_first_name: string;
  customer_last_name: string;
  shopify_product_id: ProductId;
}

export type {
  PlaceBidRequest,
  EnhancedPlaceBidRequest,
  StrictPlaceBidRequest,
  EmailString,
  ProductId,
  BidAmount,
};

export interface Vendor {
  _id: string;
  storeName: string;
  name: string;
  logo: string;
  banner: string;
  active: boolean;
  description: string;
  shopLink: string;
}

export interface CreateCheckoutRequest {
  line_items: LineItem[];
  email: string;
  attributes: Record<string, string>;
  buyer_identity: BuyerIdentityInput;
}

export interface LineItem {
  variant_id: string;
  quantity: number;
}

export interface BuyerIdentityInput {
  email: string;
  phone: string;
  country_code: string;
  customer_access_token: string;
}

export interface CollectionImage {
  url: string;
  altText: string | null;
}

export interface CollectionProductNode {
  id: string;
  title: string;
  handle: string;
}

export interface CollectionProductEdge {
  node: CollectionProductNode;
}

export interface CollectionProducts {
  edges: CollectionProductEdge[];
}

export interface CollectionNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: CollectionImage | null;
  products: CollectionProducts;
}

export interface CollectionEdge {
  node: CollectionNode;
}

export interface CollectionPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PartnerStoreCollections {
  edges: CollectionEdge[];
  pageInfo: CollectionPageInfo;
}

export interface PartnerStoreCollectionsResponse {
  collections: PartnerStoreCollections;
}

// Single collection types for individual collection queries
export interface CollectionByHandleImage {
  url: string;
  altText: string | null;
}

export interface CollectionByHandleProductVariant {
  id: string;
  availableForSale: boolean;
}

export interface CollectionByHandleProductVariantEdge {
  node: CollectionByHandleProductVariant;
}

export interface CollectionByHandleProductVariants {
  edges: CollectionByHandleProductVariantEdge[];
}

export interface CollectionByHandleProductPriceRange {
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface CollectionByHandleProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: CollectionByHandleImage;
  priceRange: CollectionByHandleProductPriceRange;
  variants: CollectionByHandleProductVariants;
}

export interface CollectionByHandleProductEdge {
  node: CollectionByHandleProductNode;
}

export interface CollectionByHandleProducts {
  edges: CollectionByHandleProductEdge[];
  pageInfo: CollectionPageInfo;
}

export interface CollectionByHandle {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: CollectionByHandleImage | null;
  products: CollectionByHandleProducts;
}

export interface CollectionByHandleResponse {
  collectionByHandle: CollectionByHandle;
}

// Product by handle types
export interface ProductByHandleImage {
  url: string;
  altText: string | null;
}

export interface ProductByHandleImageEdge {
  node: ProductByHandleImage;
}

export interface ProductByHandleImages {
  edges: ProductByHandleImageEdge[];
}

export interface ProductByHandlePriceRange {
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  };
  maxVariantPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface ProductByHandleSelectedOption {
  name: string;
  value: string;
}

export interface ProductByHandleVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: ProductByHandleSelectedOption[];
}

export interface ProductByHandleVariantEdge {
  node: ProductByHandleVariant;
}

export interface ProductByHandleVariants {
  edges: ProductByHandleVariantEdge[];
}

export interface ProductByHandleOption {
  name: string;
  values: string[];
}

export interface ProductByHandle {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: ProductByHandleImage;
  images: ProductByHandleImages;
  priceRange: ProductByHandlePriceRange;
  variants: ProductByHandleVariants;
  options: ProductByHandleOption[];
  tags: string[];
}

export interface ProductByHandleResponse {
  productByHandle: ProductByHandle;
}

// Checkout response types based on curl output
export interface CheckoutCartCost {
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  subtotalAmount: {
    amount: string;
    currencyCode: string;
  };
}

export interface CheckoutCartLineMerchandise {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  product: {
    title: string;
  };
}

export interface CheckoutCartLineNode {
  id: string;
  quantity: number;
  merchandise: CheckoutCartLineMerchandise;
}

export interface CheckoutCartLineEdge {
  node: CheckoutCartLineNode;
}

export interface CheckoutCartLines {
  edges: CheckoutCartLineEdge[];
}

export interface CheckoutCartBuyerIdentity {
  email: string;
  phone: string | null;
  countryCode: string | null;
}

export interface CheckoutCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: CheckoutCartCost;
  lines: CheckoutCartLines;
  buyerIdentity: CheckoutCartBuyerIdentity;
}

export interface CheckoutResponse {
  cartCreate: {
    cart: CheckoutCart;
    userErrors: any[];
  };
}

export interface Career {
  _id: string;
  title: string;
  description: string;
  pay: string;
  createdAt: string;
}

// TypeScript types for Additional Details (add these to your lib/types.ts file)
export interface AdditionalImage {
  url: string;
  hotspot?: boolean;
}

export interface DetailItem {
  title: string;
  description: string;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface AdditionalDetails {
  _id: string;
  merchHandle: string;
  additionalImages?: AdditionalImage[];
  fabricDetails?: DetailItem[];
  careInstructions?: DetailItem[];
  features?: DetailItem[];
  additionalSpecs?: KeyValuePair[];
}

export interface AdditionalCollectionDetails {
  _id: string;
  collectionHandle: string;
  banner: AdditionalImage;
  addtionalImages: AdditionalImage[];
  additionalSpecs?: KeyValuePair[];
}

export interface CollectionLookbook {
  _id: string;
  collectionHandle: string;
  collectionTitle: string;
  body: Block[];
  images: AdditionalImage[];
  credits?: KeyValuePair[];
}
