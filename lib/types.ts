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
  /** Array of orders placed by the user */
  orders: Order[];
  /** User's marketing opt-in status */
  optInMarketing: boolean;
  /** User's rewards opt-in status */
  optInRewards: boolean;
  /** Stripe customer ID for payment processing */
  stripeCustomerID: string;
  /** User's membership status */
  isMember: boolean;
  /** User's email verification status */
  emailVerified: boolean;
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
  /** User's full name */
  name: string;
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
  /** User's full name */
  name: string;
  /** User's phone number */
  phone: string;
  /** User's physical address information */
  address: Address;
  /** User's email address */
  email: string;
  /** User's password */
  password: string | undefined;
}
