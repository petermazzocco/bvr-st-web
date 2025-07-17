"use server";

import {
  PaymentMethodInfo,
  SubscriptionPaymentInfo,
  LastPaymentInfo,
} from "@/lib/types";

/**
 * Gets all payment methods for a customer
 * @param userID - The unique identifier for the user
 * @param authToken - Bearer token for API authentication
 * @returns Promise containing array of payment methods
 * @throws Error if the API request fails
 */
export const getCustomerPaymentMethods = async (
  userID: string,
  authToken: string,
): Promise<PaymentMethodInfo[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userID}/stripe/payment-methods`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const body: PaymentMethodInfo[] = await response.json();
  return body;
};

/**
 * Gets comprehensive payment information for a user's subscription
 * @param userID - The unique identifier for the user
 * @param authToken - Bearer token for API authentication
 * @returns Promise containing subscription payment information
 * @throws Error if the API request fails
 */
export const getSubscriptionPaymentInfo = async (
  userID: string,
  authToken: string,
): Promise<SubscriptionPaymentInfo> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userID}/stripe/subscription-payment-info`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const body: SubscriptionPaymentInfo = await response.json();
  return body;
};

/**
 * Gets payment history for a customer
 * @param userID - The unique identifier for the user
 * @param authToken - Bearer token for API authentication
 * @param limit - Optional limit for number of payments to return
 * @returns Promise containing array of payment history
 * @throws Error if the API request fails
 */
export const getPaymentHistory = async (
  userID: string,
  authToken: string,
  limit?: string,
): Promise<LastPaymentInfo[]> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userID}/stripe/payment-history`,
  );

  if (limit) {
    url.searchParams.append("limit", limit);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const body: LastPaymentInfo[] = await response.json();
  return body;
};

// Export existing server actions for completeness
/**
 * Creates a Stripe checkout session for a user
 * @param userID - The unique identifier for the user
 * @param successURL - URL to redirect to after successful payment
 * @param cancelURL - URL to redirect to if payment is cancelled
 * @param authToken - Bearer token for API authentication
 * @returns Promise containing session ID and checkout URL
 * @throws Error if the API request fails
 */
export const createCheckoutSession = async (
  userID: string,
  successURL: string,
  cancelURL: string,
  authToken: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userID}/stripe/checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        userID,
        successURL,
        cancelURL,
      }),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: { sessionID: string; url: string } = await response.json();
  return body;
};

/**
 * Creates a Stripe billing portal session for customer management
 * @param userID - The unique identifier for the user
 * @param returnURL - URL to redirect to when exiting the billing portal
 * @param authToken - Bearer token for API authentication
 * @returns Promise containing the billing portal URL
 * @throws Error if the API request fails
 */
export const createBillingPortalSession = async (
  userID: string,
  returnURL: string,
  authToken: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userID}/stripe/billing-portal-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        userID,
        returnURL,
      }),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: { url: string } = await response.json();
  return body;
};

/**
 * Updates user after successful checkout
 * @param userID - The unique identifier for the user
 * @param sessionID - The Stripe session ID
 * @param authToken - Bearer token for API authentication
 * @returns Promise containing success message and points added
 * @throws Error if the API request fails
 */
export const updateUserAfterCheckout = async (
  userID: string,
  sessionID: string,
  authToken: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userID}/stripe/${sessionID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: { message: string; pointsAdded: number } = await response.json();
  return body;
};
