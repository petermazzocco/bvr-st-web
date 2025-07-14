"use server";

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
