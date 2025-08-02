"use server";

import {
  PaymentMethodInfo,
  SubscriptionPaymentInfo,
  LastPaymentInfo,
} from "@/lib/types";

/**
 * Gets all payment methods for a customer
 * @param userId - The unique identifier for the user
 * @param authToken - Bearer token for API authentication
 * @returns Promise containing array of payment methods
 * @throws Error if the API request fails
 */
export const getCustomerPaymentMethods = async (
  userId: number,
  authToken: string,
): Promise<PaymentMethodInfo[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/stripe/payment-methods`,
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
 * @param userId - The unique identifier for the user
 * @param authToken - Bearer token for API authentication
 * @returns Promise containing subscription payment information
 * @throws Error if the API request fails
 */
export const getSubscriptionPaymentInfo = async (
  userId: number,
  authToken: string,
): Promise<SubscriptionPaymentInfo> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/stripe/subscription-payment-info`,
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
 * @param userId - The unique identifier for the user
 * @param authToken - Bearer token for API authentication
 * @param limit - Optional limit for number of payments to return
 * @returns Promise containing array of payment history
 * @throws Error if the API request fails
 */
export const getPaymentHistory = async (
  userId: number,
  authToken: string,
  limit?: string,
): Promise<LastPaymentInfo[]> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/stripe/payment-history`,
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

/**
 * Creates a Stripe checkout session for a user using server action pattern
 * @param formData - FormData containing userId, affiliate code, and redirect URLs
 * @returns Promise that redirects to Stripe checkout or throws error on failure
 */
export async function createCheckoutSession(
  initialState: any,
  formData: FormData,
) {
  let body: { sessionID: string; url: string } | undefined;
  
  try {
    // Get authentication token from server
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("bvrstrco_auth");

    if (!token?.value) {
      return { error: "Please sign in to start your membership." };
    }

    const userId = Number(formData.get("userId"));
    const affiliateCode = formData.get("affiliateCode") as string | undefined;
    const type = formData.get("type") as string | undefined;

    if (!userId) {
      return { error: "User information is missing. Please try again." };
    }

    // Build success and cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const successURL = `${baseUrl}/membership?stripe_checkout=success&user_id=${userId}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelURL = `${baseUrl}/membership`;

    const requestData: {
      userID: string;
      successURL: string;
      cancelURL: string;
      affiliateCode?: string;
      type?: string;
    } = {
      userID: userId.toString(),
      successURL,
      cancelURL,
      affiliateCode,
      type,
    };

    // Only include affiliateCode if it has a value
    if (affiliateCode) {
      requestData.affiliateCode = affiliateCode;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/stripe/checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(requestData),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Checkout session creation failed:",
        response.status,
        responseText,
      );

      if (response.status === 400) {
        if (responseText.includes("already subscribed")) {
          return { error: "You already have an active membership." };
        }
        return { error: "Invalid membership request. Please try again." };
      }
      if (response.status === 401) {
        return { error: "Authentication expired. Please sign in again." };
      }
      if (response.status === 404) {
        return { error: "Account not found. Please contact support." };
      }
      if (response.status >= 500) {
        return {
          error:
            "Payment system temporarily unavailable. Please try again later.",
        };
      }

      return { error: "Failed to start membership process. Please try again." };
    }

    try {
      body = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid JSON response:", responseText);
      return {
        error: "Invalid response from payment system. Please try again.",
      };
    }

  } catch (error) {
    console.error("Create checkout session error:", error);
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is a redirect, re-throw it
      throw error;
    }
    return {
      error: "Network error. Please check your connection and try again.",
    };
  } finally {
    // Redirect to Stripe checkout if body is available
    if (body?.url) {
      const { redirect } = await import("next/navigation");
      redirect(body.url);
    }
  }
}

/**
 * Creates a Stripe billing portal session for customer management
 * @param userId - The unique identifier for the user
 * @param returnURL - URL to redirect to when exiting the billing portal
 * @param authToken - Bearer token for API authentication
 * @returns Promise containing the billing portal URL
 * @throws Error if the API request fails
 */
export const createBillingPortalSession = async (
  userId: number,
  returnURL: string,
  authToken: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/stripe/billing-portal-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        userId,
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
 * Updates user after successful checkout using server action pattern
 * @param formData - FormData containing userId and sessionId
 * @returns Promise that redirects to membership page with success message
 */
export async function updateUserAfterCheckout(formData: FormData) {
  // Get authentication token from server
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("bvrstrco_auth");

  if (!token?.value) {
    throw new Error("Authentication required");
  }

  const userId = Number(formData.get("userId"));
  const sessionID = formData.get("sessionId") as string;

  if (!userId || !sessionID) {
    throw new Error("User ID and session ID are required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/stripe/${sessionID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error(
      "User update after checkout failed:",
      response.status,
      responseText,
    );
    throw new Error(`User update after checkout failed: ${responseText}`);
  }

  let body: { message: string; pointsAdded: number };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  // Redirect to membership page with success message
  const { redirect } = await import("next/navigation");
  redirect(`/membership?success=true&points=${body.pointsAdded}`);
}
