"use server";

import { User, Order } from "@/lib/types";

export const getUser = async (id: string) => {
  try {
    const res = await fetch(`${process.env.API_URL}/account/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`An error occurred while fetching User.`);
    }

    const data = await res.json();

    return data as User;
  } catch (error) {
    console.error("Error fetching User", error);
    throw error;
  }
};

export const getUserOrders = async (
  id: string,
  page: number = 0,
  pageSize: number = 10,
) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}/account/${id}/orders?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`An error occurred while fetching User orders.`);
    }

    const data = await res.json();

    return data as Order[];
  } catch (error) {
    console.error("Error signing in user email", error);
    throw error;
  }
};

export const signInUserOauth = async ({ provider }: { provider: string }) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/v1/auth/oauth/${provider}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`An error occurred while signing in with OAuth.`);
    }

    const data = await res.json();

    return data as User;
  } catch (error) {
    console.error("Error signing in user email", error);
    throw error;
  }
};

export const signInUserEmail = async ({
  email,
  password,
  callbackURL,
}: {
  email: string;
  password: string;
  callbackURL: string;
}) => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/auth/signin_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creds: { email, password },
        callbackUrl: callbackURL,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`${errorText}`);
    }

    const data = await res.json();

    return data as User;
  } catch (error) {
    console.error("Error signing in user email", error);
    throw error;
  }
};

export const signInUserPhone = async ({
  phone,
  password,
  callbackURL,
}: {
  phone: string;
  password: string;
  callbackURL: string;
}) => {
  const res = await fetch(`${process.env.API_URL}/api/v1/auth/signin_phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      creds: { phone, password },
      callbackUrl: callbackURL,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
  }

  const data = await res.json();

  return data;
};

export const signOutUser = async () => {};
