"use server";

import { Order, UpdateUser, User } from "@/lib/types";
import Cookies from "js-cookie";

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

export const signOut = async () => {
  try {
    // Remove the auth token cookie
    Cookies.remove("authToken");
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error };
  }
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
  const body: User = await response.json();
  return body;
};

export const updateUserDetails = async (
  authToken: string | undefined,
  userId: string,
  user: UpdateUser,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(user),
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const body: User = await response.json();
  return body;
};

export const getUserOrders = async (
  authToken: string | undefined,
  userId: string,
  page = 1,
  limit = 10,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/orders?page=${page}&pageSize=${limit}`,
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
  const body: Order[] = await response.json();
  return body;
};

// Then update your function
export const changeUserPassword = async (
  authToken: string | undefined,
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/change-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to change password");
  }
  const body: {
    message: string;
    success: boolean;
  } = await response.json();
  return body;
};
