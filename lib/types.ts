// TypeScript equivalent of the Go models

export interface User {
  id: string;
  name: string;
  phone: string;
  address: Address;
  email: string;
  password: string;
  points: number;
  rewards: Reward[];
  orders: Order[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Address {
  street: string;
  apt?: string;
  zip: string;
  city: string;
  state: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  code: string;
  image: string;
  validTil: string;
  pointsCost: number;
  redeemed: boolean;
  redeemedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Order {
  id: string;
  userID: string;
  total: number;
  products: Product[];
  tracking: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
}

export interface UpdateUser {
  name: string;
  phone: string;
  address: Address;
  email: string;
}
