"use server";
import { models_User, models_Order } from "@/lib/requests";

export const signInWithEmail = async (
  email: string,
  password: string,
  callbackUrl: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signin/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, callbackUrl }),
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const body: { token: string; callbackUrl: string } = await response.json();
  return body;
};

export const signInWithPhone = async (
  phone: string,
  password: string,
  callback: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signin/phone`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, password, callback }),
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const body: { token: string; callbackUrl: string } = await response.json();
  return body;
};

export const getUserDetails = async (
  authToken: string | undefined,
  userId: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Example header
      },
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const body: models_User = await response.json();
  return body;
};

export const getUserOrders = async (
  authToken: string | undefined,
  userId: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/orders`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Example header
      },
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const body: models_Order[] = await response.json();
  return body;
};
