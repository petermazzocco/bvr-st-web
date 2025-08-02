"use server";

import { Order, UpdateUser, User, UserSignUp, ApiResult } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const getAuthTokenServer = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("bvrstrco_auth");
  return token?.value || null;
};

export async function handleEmailSubmit(initialData: any, formData: FormData) {
  try {
    await requestForgotPassword(formData);
    const email = formData.get("email") as string;
    redirect(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error("Handle email submit error:", error);
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is a redirect, re-throw it
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      return { error: "No account found with this email address. Please check your email or sign up for a new account." };
    }
    if (errorMessage.includes("400") || errorMessage.includes("invalid")) {
      return { error: "Please provide a valid email address." };
    }
    if (errorMessage.includes("500") || errorMessage.includes("server")) {
      return { error: "Server error. Please try again later." };
    }
    
    return { error: "Failed to send reset code. Please try again." };
  }
}

export async function handleOTPSubmit(initialState: any, formData: FormData) {
  try {
    const code = formData.get("code") as string;
    const email = initialState.email;

    if (!code) {
      return { error: "Please enter the verification code." };
    }

    if (code.length !== 8) {
      return { error: "Please enter a valid 8-character code." };
    }

    if (!/^[A-Za-z0-9]{8}$/.test(code)) {
      return { error: "Code must contain only letters and numbers." };
    }

    redirect(
      `/forgot-password/reset?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
    );
  } catch (error) {
    console.error("Handle OTP submit error:", error);
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is a redirect, re-throw it
      throw error;
    }
    return { error: "Failed to verify code. Please try again." };
  }
}

export const getUserIdFromTokenServer = async (): Promise<number | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bvrstrco_auth");
    if (!token?.value) return null;
    const payload = JSON.parse(atob(token.value.split(".")[1]));
    return payload.userid || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Gets the membership status for a user
 * @param token - Authentication token
 * @param userId - User ID
 * @returns Promise<boolean> indicating if the user is a member
 */
export const getMembershipStatus = async (
  token: string,
  userId: number,
): Promise<boolean> => {
  try {
    const userResult = await getUserDetails(token, userId);
    if (userResult.success && userResult.data) {
      return userResult.data.isMember || false;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Signs in a user using email and password
 * @param email - User's email address
 * @param password - User's password
 * @param callbackUrl - URL to redirect to after successful sign in
 * @returns Promise containing authentication token and callback URL or error
 */
export async function signInWithEmail(initialState: any, formData: FormData) {
  const requestData = {
    email: formData.get("email"),
    password: formData.get("password"),
    callbackUrl: formData.get("callbackUrl"),
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signin/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      // Handle non-200 responses
      console.error("Authentication failed:", response.status, responseText);
      
      if (response.status === 401) {
        return { error: "Invalid email or password. Please check your credentials and try again." };
      }
      if (response.status === 404) {
        return { error: "Account not found. Please check your email or sign up for a new account." };
      }
      if (response.status >= 500) {
        return { error: "Server error. Please try again later." };
      }
      
      return { error: "Sign in failed. Please try again." };
    }

    let body: { token: string; callbackUrl: string };
    try {
      body = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid JSON response:", responseText);
      return { error: "Invalid response from server. Please try again." };
    }

    if (body.token) {
      // Set the authentication token as a cookie
      const cookieStore = await cookies();
      cookieStore.set("bvrstrco_auth", body.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Redirect to callback URL or default dashboard
      redirect(body.callbackUrl || "/account");
    } else {
      return { error: "No authentication token received. Please try again." };
    }
  } catch (error) {
    // Handle network errors or other unexpected errors
    console.error("Sign in error:", error);
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is a redirect, re-throw it
      throw error;
    }
    return { error: "Network error. Please check your connection and try again." };
  }
}

/**
 * Signs in a user using phone number and password
 * @param phone - User's phone number
 * @param password - User's password
 * @param callback - URL to redirect to after successful sign in
 * @returns Promise containing authentication token and callback URL or error
 */
export async function signInWithPhone(formData: FormData) {
  const requestData = {
    phone: formData.get("phone"),
    password: formData.get("password"),
    callbackUrl: formData.get("callbackUrl"),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signin/phone`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Authentication failed:", response.status, responseText);
    throw new Error(`Authentication failed: ${responseText}`);
  }

  let body: { token: string; callbackUrl: string };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  if (body.token) {
    const cookieStore = await cookies();
    cookieStore.set("bvrstrco_auth", body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect(body.callbackUrl || "/account");
  } else {
    throw new Error("No token received");
  }
}

/**
 * Signs out the current user by removing the authentication token cookie
 * @returns Promise containing success status and optional error information
 */
export const signOut = async (initialState: any) => {
  const cookieStore = await cookies();
  cookieStore.delete("bvrstrco_auth");
  redirect("/");
};

/**
 * Signs up a new user
 * @param user - A user sign up object containing phone, password, and callback URL
 * @returns Promise containing authentication token or error
 */
export async function signUp(initialState: any, formData: FormData) {
  const requestData = {
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    callbackUrl: formData.get("callbackUrl"),
    address: formData.get("address"),
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Sign up failed:", response.status, responseText);
      
      if (response.status === 400) {
        if (responseText.includes("email")) {
          return { error: "Email address is already in use. Please try signing in instead." };
        }
        if (responseText.includes("password")) {
          return { error: "Password doesn't meet requirements. Please ensure it's at least 8 characters with uppercase, lowercase, and numbers." };
        }
        return { error: "Invalid information provided. Please check your details and try again." };
      }
      if (response.status === 409) {
        return { error: "An account with this email already exists. Please sign in instead." };
      }
      if (response.status >= 500) {
        return { error: "Server error. Please try again later." };
      }
      
      return { error: "Sign up failed. Please try again." };
    }

    let body: { token: string; callbackUrl?: string };
    try {
      body = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid JSON response:", responseText);
      return { error: "Invalid response from server. Please try again." };
    }

    if (body.token) {
      const cookieStore = await cookies();
      cookieStore.set("bvrstrco_auth", body.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      redirect(body.callbackUrl || "/account");
    } else {
      return { error: "No authentication token received. Please try again." };
    }
  } catch (error) {
    console.error("Sign up error:", error);
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is a redirect, re-throw it
      throw error;
    }
    return { error: "Network error. Please check your connection and try again." };
  }
}

/**
 * Retrieves detailed information for a specific user
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @returns Promise containing user details or error
 */
export const getUserDetails = async (
  authToken: string,
  userId: number,
): Promise<ApiResult<User>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}`,
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
      console.error("Get user details error:", errorText);
      if (errorText.includes("Unauthorized")) {
        return {
          success: false,
          error: "You are not authorized to access this information.",
        };
      }

      if (errorText.includes("User not found")) {
        return {
          success: false,
          error: "User not found.",
        };
      }

      return {
        success: false,
        error: "Failed to retrieve user details. Please try again.",
      };
    }

    const body: User = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get user details error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Updates user information using server action pattern
 * @param formData - FormData containing user information
 * @returns Promise that redirects with success message or throws error on failure
 */
export async function updateUserDetails(initialState: any, formData: FormData) {
  try {
    const authToken = await getAuthTokenServer();
    const userId = await getUserIdFromTokenServer();

    if (!authToken || !userId) {
      return { error: "Authentication required. Please sign in again." };
    }

    const updateData: UpdateUser = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      optInMarketing: formData.get("optInMarketing") === "on",
      optInRewards: formData.get("optInRewards") === "on",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updateData),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Update user details failed:", response.status, responseText);

      if (response.status === 401 || responseText.includes("Unauthorized")) {
        return { error: "Authentication expired. Please sign in again." };
      }

      if (response.status === 400 || responseText.includes("Validation error")) {
        if (responseText.includes("email")) {
          return { error: "Please provide a valid email address." };
        }
        if (responseText.includes("phone")) {
          return { error: "Please provide a valid phone number." };
        }
        return { error: "Invalid information provided. Please check your details." };
      }

      if (response.status === 409) {
        return { error: "Email address is already in use by another account." };
      }

      if (response.status >= 500) {
        return { error: "Server error. Please try again later." };
      }

      return { error: "Failed to update profile. Please try again." };
    }

    let body: User;
    try {
      body = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid JSON response:", responseText);
      return { error: "Invalid response from server. Please try again." };
    }

    // Redirect to account page with success message
    redirect("/account?updated=true");
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is a redirect, re-throw it (don't log as error)
      throw error;
    }
    console.error("Update user details error:", error);
    return { error: "Network error. Please check your connection and try again." };
  }
}

/**
 * Retrieves a paginated list of orders for a specific user
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of orders per page (default: 10)
 * @returns Promise containing array of user orders or error
 */
export const getUserOrders = async (
  authToken: string | undefined,
  userId: number,
  page = 1,
  limit = 10,
): Promise<ApiResult<Order[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/orders?page=${page}&pageSize=${limit}`,
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

      if (errorText.includes("Unauthorized")) {
        return {
          success: false,
          error: "You are not authorized to access these orders.",
        };
      }

      if (errorText.includes("User not found")) {
        return {
          success: false,
          error: "User not found.",
        };
      }

      return {
        success: false,
        error: "Failed to retrieve orders. Please try again.",
      };
    }

    const body: Order[] = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get user orders error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves an integer of points for a specific user
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @returns Promise containing integer of user points or error
 */
export const getUserPoints = async (
  authToken: string | undefined,
  userId: number,
): Promise<ApiResult<number>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/points`,
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

      if (errorText.includes("Unauthorized")) {
        return {
          success: false,
          error: "You are not authorized to access this information.",
        };
      }

      if (errorText.includes("User not found")) {
        return {
          success: false,
          error: "User not found.",
        };
      }

      return {
        success: false,
        error: "Failed to retrieve user points. Please try again.",
      };
    }

    const body: number = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get user points error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Changes a user's password using server action pattern
 * @param formData - FormData containing current and new password
 * @returns Promise that redirects with success message or throws error on failure
 */
export async function changeUserPassword(formData: FormData) {
  const authToken = await getAuthTokenServer();
  const userId = await getUserIdFromTokenServer();

  if (!authToken || !userId) {
    throw new Error("Authentication required");
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    throw new Error("Current and new password are required");
  }

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

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Change password failed:", response.status, responseText);

    if (responseText.includes("Invalid current password")) {
      throw new Error("Current password is incorrect.");
    }

    if (responseText.includes("Password too weak")) {
      throw new Error(
        "New password is too weak. Please choose a stronger password.",
      );
    }

    if (responseText.includes("Unauthorized")) {
      throw new Error("You are not authorized to change this password.");
    }

    throw new Error("Failed to change password. Please try again.");
  }

  let body: { message: string; success: boolean };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  // Redirect to account page with success message
  const { redirect } = await import("next/navigation");
  redirect("/account?password_changed=true");
}

/**
 * User has forgotten their password and needs to reset it. This is different from the changePassword function.
 * @param email - Email address of the user
 * @returns Promise containing success message and status or error
 */
export async function requestForgotPassword(formData: FormData) {
  const requestData = {
    email: formData.get("email"),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error(
      "Forgot password request failed:",
      response.status,
      responseText,
    );
    throw new Error(`Forgot password request failed: ${responseText}`);
  }

  let body: { message: string; success: boolean };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  return body;
}

/**
 * Accepts a otp to confirm the user received the email
 * @param email - Email address of the user
 * @param code - One-time password sent to the user's email
 * @param newPassword - New password to be set for the user
 * @returns Promise containing success message of password change and status or error
 */
export async function confirmForgotPassword(
  initialState: any,
  formData: FormData,
) {
  const requestData = {
    email: formData.get("email"),
    code: formData.get("code"),
    newPassword: formData.get("newPassword"),
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Password reset confirmation failed:",
        response.status,
        responseText,
      );
      
      if (response.status === 400) {
        if (responseText.includes("password")) {
          return { error: "Password doesn't meet requirements. Please ensure it's at least 8 characters with uppercase, lowercase, and numbers." };
        }
        if (responseText.includes("code")) {
          return { error: "Invalid or expired verification code. Please request a new code." };
        }
        return { error: "Invalid information provided. Please check your details and try again." };
      }
      if (response.status === 401) {
        return { error: "Invalid verification code. Please try again or request a new code." };
      }
      if (response.status === 404) {
        return { error: "Account not found. Please check your email address." };
      }
      if (response.status >= 500) {
        return { error: "Server error. Please try again later." };
      }
      
      return { error: "Password reset failed. Please try again." };
    }

    let body: { message: string; success: boolean };
    try {
      body = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid JSON response:", responseText);
      return { error: "Invalid response from server. Please try again." };
    }

    redirect("/signin");
  } catch (error) {
    console.error("Confirm forgot password error:", error);
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is a redirect, re-throw it
      throw error;
    }
    return { error: "Network error. Please check your connection and try again." };
  }
}

/**
 * Permanently deletes a user account
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user to delete
 * @returns Promise containing deletion confirmation message and status or error
 */
export const deleteUser = async (
  authToken: string | undefined,
  userId: number,
): Promise<ApiResult<{ message: string; success: boolean }>> => {
  try {
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

      if (errorText.includes("Unauthorized")) {
        return {
          success: false,
          error: "You are not authorized to delete this account.",
        };
      }

      if (errorText.includes("User not found")) {
        return {
          success: false,
          error: "User not found.",
        };
      }

      return {
        success: false,
        error: "Failed to delete account. Please try again.",
      };
    }

    const body: { message: string; success: boolean } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Delete user error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Contact form submission
 * @param name - Name of the user submitting the form
 * @param email - Email of the user submitting the form
 * @param subject - Subject of the message
 * @param message - Message submitted by the user
 * @returns Message containing confirmation of submission or error
 */
export async function contactSubmission(initialState: any, formData: FormData) {
  const requestData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Contact submission failed:", response.status, responseText);
    throw new Error(`Contact submission failed: ${responseText}`);
  }

  let body: { message: string; success: boolean };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  // For server actions used in forms, we should redirect or return void
  // Redirect to contact page with success message via URL params
  redirect("/contact?success=true");
}

/**
 * Verify user email
 * @param userId - ID of the user to verify
 * @param code - Verification code
 * @param authToken - Authentication token
 * @returns Message containing confirmation of verification or error
 */
export async function verifyUserEmail(formData: FormData) {
  const userId = Number(formData.get("userId"));
  const authToken = await getAuthTokenServer();

  if (!userId || !authToken) {
    throw new Error("Missing required data for email verification");
  }

  const requestData = {
    code: formData.get("code"),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestData),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Email verification failed:", response.status, responseText);
    throw new Error(`Email verification failed: ${responseText}`);
  }

  let body: { message: string; success: boolean };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  return body;
}

/**
 * Resend OTP code to user's email
 * @returns Message containing confirmation of verification or error
 */
export async function resendOTPCode(formData: FormData) {
  const userId = Number(formData.get("userId"));
  const authToken = await getAuthTokenServer();

  if (!userId || !authToken) {
    throw new Error("Missing required data for OTP resend");
  }

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

  const responseText = await response.text();

  if (!response.ok) {
    console.error("OTP resend failed:", response.status, responseText);
    throw new Error(`OTP resend failed: ${responseText}`);
  }

  let body: { message: string; success: boolean };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  return body;
}

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

/**
 * Initiates OAuth sign-in by redirecting to the OAuth provider using server action pattern
 * @param formData - FormData containing provider and callbackUrl
 * @returns Promise that redirects to OAuth provider or throws error on failure
 */
export async function signInWithOAuth(formData: FormData) {
  const provider = formData.get("provider") as string;
  const callbackUrl = formData.get("callbackUrl") as string;

  if (!provider) {
    throw new Error("OAuth provider is required");
  }

  // Validate provider
  const supportedProviders = ["google"]; // Add more providers as needed
  if (!supportedProviders.includes(provider.toLowerCase())) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  // Build the OAuth initiation URL - make sure provider is lowercase
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/oauth/${provider.toLowerCase()}`;
  const url = new URL(baseUrl);

  // Add frontend callback URL as query parameter
  const frontendCallback = callbackUrl
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?redirect=${encodeURIComponent(callbackUrl)}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;

  url.searchParams.append("callback", frontendCallback);

  // Redirect to OAuth provider
  const { redirect } = await import("next/navigation");
  redirect(url.toString());
}

/**
 * Handles OAuth callback and extracts token from URL parameters
 * This would typically be called on your OAuth callback page
 * @param searchParams - URL search parameters from the OAuth callback
 * @returns Promise containing authentication token or error
 */
export const handleOAuthCallback = async (
  searchParams: URLSearchParams,
): Promise<ApiResult<{ token: string }>> => {
  try {
    // Check for error in callback
    const error = searchParams.get("error");
    if (error) {
      const errorDescription =
        searchParams.get("error_description") || "OAuth authentication failed";
      return {
        success: false,
        error: decodeURIComponent(errorDescription),
      };
    }

    // Extract token from URL parameters
    // Note: Your backend should handle the actual OAuth flow and redirect with the token
    const token = searchParams.get("token");
    if (!token) {
      return {
        success: false,
        error: "No authentication token received from OAuth provider.",
      };
    }

    return {
      success: true,
      data: { token },
    };
  } catch (error) {
    console.error("OAuth callback error:", error);
    return {
      success: false,
      error: "Failed to process OAuth callback. Please try again.",
    };
  }
};

/**
 * Alternative approach: Handle OAuth callback by making a request to your backend
 * Use this if your backend doesn't redirect with the token in URL params
 * @param provider - OAuth provider name
 * @param code - Authorization code from OAuth provider
 * @param state - State parameter from OAuth provider (optional)
 * @returns Promise containing authentication token or error
 */
export async function exchangeOAuthCode(formData: FormData) {
  const requestData = {
    provider: formData.get("provider") as string,
    code: formData.get("code") as string,
    state: formData.get("state") as string | undefined,
    callbackUrl: formData.get("callbackUrl") as string,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/oauth/${requestData.provider}/callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: requestData.code,
        state: requestData.state || undefined,
      }),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("OAuth code exchange failed:", response.status, responseText);
    throw new Error(`OAuth code exchange failed: ${responseText}`);
  }

  let body: { token: string; callbackUrl?: string };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  if (body.token) {
    const cookieStore = await cookies();
    cookieStore.set("bvrstrco_auth", body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect(requestData.callbackUrl || body.callbackUrl || "/account");
  } else {
    throw new Error("No token received");
  }
}

/**
 * Add a user to the newsletter using server action pattern
 * @param formData - FormData containing email and fullName
 * @returns Promise that redirects with success message or throws error on failure
 */
export async function addToNewsletter(formData: FormData) {
  const requestData = {
    email: formData.get("email"),
    fullName: formData.get("fullName"),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newsletter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error(
      "Newsletter subscription failed:",
      response.status,
      responseText,
    );
    throw new Error(`Newsletter subscription failed: ${responseText}`);
  }

  let body: { message: string };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  // Redirect to current page with success parameter
  const { redirect } = await import("next/navigation");
  redirect("/?newsletter=true");
}
