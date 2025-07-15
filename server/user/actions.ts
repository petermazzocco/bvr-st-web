"use server";

import { Order, UpdateUser, User, UserSignUp } from "@/lib/types";
import Cookies from "js-cookie";

/**
 * Signs in a user using email and password
 * @param email - User's email address
 * @param password - User's password
 * @param callbackUrl - URL to redirect to after successful sign in
 * @returns Promise containing authentication token and callback URL
 * @throws Error if network request fails or credentials are invalid
 */
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
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: { token: string; callbackUrl: string } = await response.json();
  return body;
};

/**
 * Signs in a user using phone number and password
 * @param phone - User's phone number
 * @param password - User's password
 * @param callback - URL to redirect to after successful sign in
 * @returns Promise containing authentication token and callback URL
 * @throws Error if network request fails or credentials are invalid
 */
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
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: { token: string; callbackUrl: string } = await response.json();
  return body;
};

/**
 * Signs out the current user by removing the authentication token cookie
 * @returns Promise containing success status and optional error information
 */
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

/**
 * Signs up a new user
 * @param user - A user sign up object containing phone, password, and callback URL
 * @returns Promise containing authentication token and callback URL
 * @throws Error if network request fails or credentials are invalid
 */
export const signUp = async (user: UserSignUp) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: { token: string } = await response.json();
  return body;
};

/**
 * Retrieves detailed information for a specific user
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @returns Promise containing user details
 * @throws Error if network request fails or user is not found
 */
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
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: User = await response.json();
  return body;
};

/**
 * Updates user information with the provided data
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user to update
 * @param user - Updated user information object
 * @returns Promise containing updated user details
 * @throws Error if network request fails or update is unauthorized
 */
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
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: User = await response.json();
  return body;
};

/**
 * Retrieves a paginated list of orders for a specific user
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of orders per page (default: 10)
 * @returns Promise containing array of user orders
 * @throws Error if network request fails or user is not found
 */
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
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: Order[] = await response.json();
  return body;
};

/**
 * Retrieves an integer of points for a specific user
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @returns Promise containing integer of user points
 * @throws Error if network request fails or user is not found
 */
export const getUserPoints = async (
  authToken: string | undefined,
  userId: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/points`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Example header
      },
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: number = await response.json();
  return body;
};

/**
 * Changes a user's password after verifying the current password
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @param currentPassword - User's current password for verification
 * @param newPassword - New password to set
 * @returns Promise containing success message and status
 * @throws Error if current password is incorrect or network request fails
 */
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
    throw new Error(errorText);
  }
  const body: {
    message: string;
    success: boolean;
  } = await response.json();
  return body;
};

/**
 * User has forgotten their password and needs to reset it. This is different from the changePassword function.
 * @param email - Email address of the user
 * @returns Promise containing success message and status
 * @throws Error if email is incorrect or network request fails
 */
export const requestForgotPassword = async (email: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: {
    message: string;
    success: boolean;
  } = await response.json();
  return body;
};

/**
 * Accepts a otp to confirm the user received the email
 * @param email - Email address of the user
 * @param code - One-time password sent to the user's email
 * @param newPassword - New password to be set for the user
 * @returns Promise containing success message of password change and status
 * @throws Error if email is incorrect or network request fails
 */
export const confirmForgotPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, newPassword }),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: {
    message: string;
    success: boolean;
  } = await response.json();
  return body;
};

/**
 * Permanently deletes a user account
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user to delete
 * @returns Promise containing deletion confirmation message and status
 * @throws Error if deletion fails or user is not authorized
 */
export const deleteUser = async (
  authToken: string | undefined,
  userId: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}`,
    {
      method: "DELETE",
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
  const body: {
    message: string;
    success: boolean;
  } = await response.json();
  return body;
};

/**
 * Contact form submission
 * @param name - Name of the user submitting the form
 * @param email - Email of the user submitting the form
 * @param subject - Subject of the message
 * @param message - Message submitted by the user
 * @returns Message containing confirmation of submission
 * @throws Error if submission fails
 */
export const contactSubmission = async (
  name: string,
  email: string,
  subject: string,
  message: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: {
    message: string;
    success: boolean;
  } = await response.json();
  return body;
};

/**
 * Verify user email
 * @param userId - ID of the user to verify
 * @param code - Verification code
 * @param email - Email of the user to verify
 * @param authToken - Authentication token
 * @returns Message containing confirmation of verification
 * @throws Error if verification fails
 */
export const verifyUserEmail = async (
  userId: string,
  code: string,
  authToken: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ code }),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const body: {
    message: string;
    success: boolean;
  } = await response.json();
  return body;
};

/**
 * Resend OTP code to user's email
 * @returns Message containing confirmation of verification
 * @throws Error if request fails
 */
export const resendOTPCode = async (userId: string, authToken: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/verify-email/resend`,
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
  const body: {
    message: string;
    success: boolean;
  } = await response.json();
  return body;
};

/**
 * Checks if the given OTP token is expired
 * @param otpToken - OTP token to check
 * @param userID - User ID associated with the OTP token
 * @param email - Email address associated with the OTP token
 * @returns True if OTP is expired, false otherwise
 */
export async function isOTPExpired(
  otpToken: string,
  userID?: string,
  email?: string,
): Promise<boolean> {
  try {
    // Ensure at least one identifier is provided
    if (!userID && !email) {
      console.error("Either userID or email must be provided");
      return true;
    }

    // Build request body based on available parameters
    const requestBody: { code: string; user_id?: string; email?: string } = {
      code: otpToken,
    };

    if (userID) {
      requestBody.user_id = userID;
    } else if (email) {
      requestBody.email = email;
    }

    // Make API call to verify OTP status
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      return true; // Treat failed requests as expired
    }

    const data = await response.json();
    return !data.valid; // Return true if OTP is NOT valid (expired/used/canceled)
  } catch (error) {
    console.error("Error checking OTP expiration:", error);
    return true; // Treat errors as expired for security
  }
}
