export type Order = {
  id: string;
  userID: string;
  total: number;
  products: Product[];
  tracking: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
};

export type User = {
  id: string;
  image: string;
  name: string;
  phone: string;
  address: Address;
  email: string;
  password?: string;
  points?: number;
  rewards?: Reward[];
  orders?: Order[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type Address = {
  street: string;
  apt: string;
  zip: string;
  city: string;
  state: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  code: string;
  image: string;
  validTil: Date;
  pointsCost: number;
  redeemed: boolean;
  redeemedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
