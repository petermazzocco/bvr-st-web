/**
 * Represents a complete user profile with all associated data
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's full name */
  name: string;
  /** User's phone number */
  phone: string;
  /** User's physical address information */
  address: Address;
  /** User's email address */
  email: string;
  /** User's encrypted password */
  password: string;
  /** Current reward points balance */
  points: number;
  /** Array of rewards owned by the user */
  rewards: Reward[];
  /** Array of orders placed by the user */
  orders: Order[];
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
 * Represents a reward that can be earned and redeemed by users
 */
export interface Reward {
  /** Unique identifier for the reward */
  id: string;
  /** Display name of the reward */
  name: string;
  /** Detailed description of the reward */
  description: string;
  /** Unique redemption code for the reward */
  code: string;
  /** URL or path to the reward's image */
  image: string;
  /** ISO timestamp when the reward expires */
  validTil: string;
  /** Number of points required to redeem this reward */
  pointsCost: number;
  /** Whether this reward has been redeemed by the user */
  redeemed: boolean;
  /** ISO timestamp when the reward was redeemed */
  redeemedAt: string;
  /** ISO timestamp when the reward was created */
  createdAt: string;
  /** ISO timestamp when the reward was last updated */
  updatedAt: string;
  /** ISO timestamp when the reward was deleted (if applicable) */
  deletedAt?: string;
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
  /** User's full name */
  name: string;
  /** User's phone number */
  phone: string;
  /** User's physical address information */
  address: Address;
  /** User's email address */
  email: string;
}
