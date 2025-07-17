"use server";

import { Order, UpdateUser, User, UserSignUp, ApiResult } from "@/lib/types";
import Cookies from "js-cookie";

/**
 * Signs in a user using email and password
 * @param email - User's email address
 * @param password - User's password
 * @param callbackUrl - URL to redirect to after successful sign in
 * @returns Promise containing authentication token and callback URL or error
 */
export const signInWithEmail = async (
  email: string,
  password: string,
  callbackUrl: string,
): Promise<ApiResult<{ token: string; callbackUrl: string }>> => {
  try {
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

      if (errorText.includes("Invalid credentials")) {
        return {
          success: false,
          error: "Invalid email or password. Please try again.",
        };
      }

      if (errorText.includes("User not found")) {
        return {
          success: false,
          error: "No account found with this email address.",
        };
      }

      return {
        success: false,
        error: "Sign in failed. Please try again.",
      };
    }

    const body: { token: string; callbackUrl: string } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Signs in a user using phone number and password
 * @param phone - User's phone number
 * @param password - User's password
 * @param callback - URL to redirect to after successful sign in
 * @returns Promise containing authentication token and callback URL or error
 */
export const signInWithPhone = async (
  phone: string,
  password: string,
  callback: string,
): Promise<ApiResult<{ token: string; callbackUrl: string }>> => {
  try {
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

      if (errorText.includes("Invalid credentials")) {
        return {
          success: false,
          error: "Invalid phone number or password. Please try again.",
        };
      }

      if (errorText.includes("User not found")) {
        return {
          success: false,
          error: "No account found with this phone number.",
        };
      }

      return {
        success: false,
        error: "Sign in failed. Please try again.",
      };
    }

    const body: { token: string; callbackUrl: string } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Signs out the current user by removing the authentication token cookie
 * @returns Promise containing success status and optional error information
 */
export const signOut = async (): Promise<ApiResult<{}>> => {
  try {
    // Remove the auth token cookie
    Cookies.remove("authToken");
    return { success: true, data: {} };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: "Failed to sign out. Please try again.",
    };
  }
};

/**
 * Signs up a new user
 * @param user - A user sign up object containing phone, password, and callback URL
 * @returns Promise containing authentication token or error
 */
export const signUp = async (
  user: UserSignUp,
): Promise<ApiResult<{ token: string }>> => {
  try {
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

      if (errorText.includes("User already exists")) {
        return {
          success: false,
          error: "An account with this phone number already exists.",
        };
      }

      if (errorText.includes("Invalid phone")) {
        return {
          success: false,
          error: "Please enter a valid phone number.",
        };
      }

      return {
        success: false,
        error: "Sign up failed. Please try again.",
      };
    }

    const body: { token: string } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves detailed information for a specific user
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @returns Promise containing user details or error
 */
export const getUserDetails = async (
  authToken: string | undefined,
  userId: string,
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
 * Updates user information with the provided data
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user to update
 * @param user - Updated user information object
 * @returns Promise containing updated user details or error
 */
export const updateUserDetails = async (
  authToken: string | undefined,
  userId: string,
  user: UpdateUser,
): Promise<ApiResult<User>> => {
  try {
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

      if (errorText.includes("Unauthorized")) {
        return {
          success: false,
          error: "You are not authorized to update this user.",
        };
      }

      if (errorText.includes("Validation error")) {
        return {
          success: false,
          error: "Invalid user information provided.",
        };
      }

      return {
        success: false,
        error: "Failed to update user details. Please try again.",
      };
    }

    const body: User = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Update user details error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

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
  userId: string,
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
  userId: string,
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
 * Changes a user's password after verifying the current password
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user
 * @param currentPassword - User's current password for verification
 * @param newPassword - New password to set
 * @returns Promise containing success message and status or error
 */
export const changeUserPassword = async (
  authToken: string | undefined,
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<ApiResult<{ message: string; success: boolean }>> => {
  try {
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

      if (errorText.includes("Invalid current password")) {
        return {
          success: false,
          error: "Current password is incorrect.",
        };
      }

      if (errorText.includes("Password too weak")) {
        return {
          success: false,
          error: "New password is too weak. Please choose a stronger password.",
        };
      }

      if (errorText.includes("Unauthorized")) {
        return {
          success: false,
          error: "You are not authorized to change this password.",
        };
      }

      return {
        success: false,
        error: "Failed to change password. Please try again.",
      };
    }

    const body: { message: string; success: boolean } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * User has forgotten their password and needs to reset it. This is different from the changePassword function.
 * @param email - Email address of the user
 * @returns Promise containing success message and status or error
 */
export const requestForgotPassword = async (
  email: string,
): Promise<ApiResult<{ message: string; success: boolean }>> => {
  try {
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

      if (errorText.includes("User not found")) {
        return {
          success: false,
          error: "No account found with this email address.",
        };
      }

      if (errorText.includes("Too many requests")) {
        return {
          success: false,
          error: "Too many password reset requests. Please try again later.",
        };
      }

      return {
        success: false,
        error: "Password reset request failed. Please try again.",
      };
    }

    const body: { message: string; success: boolean } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Accepts a otp to confirm the user received the email
 * @param email - Email address of the user
 * @param code - One-time password sent to the user's email
 * @param newPassword - New password to be set for the user
 * @returns Promise containing success message of password change and status or error
 */
export const confirmForgotPassword = async (
  email: string,
  code: string,
  newPassword: string,
): Promise<ApiResult<{ message: string; success: boolean }>> => {
  try {
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

      if (errorText.includes("verification code has already been used")) {
        return {
          success: false,
          error:
            "This verification code has already been used. Please request a new one.",
        };
      }

      if (errorText.includes("Invalid verification code")) {
        return {
          success: false,
          error: "Invalid verification code. Please try again.",
        };
      }

      if (errorText.includes("expired")) {
        return {
          success: false,
          error:
            "This verification code has expired. Please request a new one.",
        };
      }

      return {
        success: false,
        error: "Password reset confirmation failed. Please try again.",
      };
    }

    const body: { message: string; success: boolean } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Confirm forgot password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Permanently deletes a user account
 * @param authToken - Bearer token for authentication (optional)
 * @param userId - Unique identifier for the user to delete
 * @returns Promise containing deletion confirmation message and status or error
 */
export const deleteUser = async (
  authToken: string | undefined,
  userId: string,
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
export const contactSubmission = async (
  name: string,
  email: string,
  subject: string,
  message: string,
): Promise<ApiResult<{ message: string; success: boolean }>> => {
  try {
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

      if (errorText.includes("Invalid email")) {
        return {
          success: false,
          error: "Please enter a valid email address.",
        };
      }

      if (errorText.includes("Message too long")) {
        return {
          success: false,
          error: "Message is too long. Please keep it under 1000 characters.",
        };
      }

      return {
        success: false,
        error: "Failed to send message. Please try again.",
      };
    }

    const body: { message: string; success: boolean } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Contact submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Verify user email
 * @param userId - ID of the user to verify
 * @param code - Verification code
 * @param authToken - Authentication token
 * @returns Message containing confirmation of verification or error
 */
export const verifyUserEmail = async (
  userId: string,
  code: string,
  authToken: string,
): Promise<ApiResult<{ message: string; success: boolean }>> => {
  try {
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

      if (errorText.includes("verification code has already been used")) {
        return {
          success: false,
          error:
            "This verification code has already been used. Please request a new one.",
        };
      }

      if (errorText.includes("Invalid verification code")) {
        return {
          success: false,
          error: "Invalid verification code. Please try again.",
        };
      }

      if (errorText.includes("expired")) {
        return {
          success: false,
          error:
            "This verification code has expired. Please request a new one.",
        };
      }

      return {
        success: false,
        error: "Email verification failed. Please try again.",
      };
    }

    const body: { message: string; success: boolean } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Resend OTP code to user's email
 * @returns Message containing confirmation of verification or error
 */
export const resendOTPCode = async (
  userId: string,
  authToken: string,
): Promise<ApiResult<{ message: string; success: boolean }>> => {
  try {
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

      if (errorText.includes("Too many requests")) {
        return {
          success: false,
          error:
            "Too many OTP requests. Please wait before requesting another code.",
        };
      }

      if (errorText.includes("Unauthorized")) {
        return {
          success: false,
          error: "You are not authorized to request an OTP code.",
        };
      }

      return {
        success: false,
        error: "Failed to send OTP code. Please try again.",
      };
    }

    const body: { message: string; success: boolean } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Resend OTP error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
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

/**
 * Initiates OAuth sign-in by redirecting to the OAuth provider
 * @param provider - OAuth provider name (e.g., 'google')
 * @param callbackUrl - URL to redirect to after successful OAuth authentication
 * @returns Promise containing redirect URL or error
 */
export const signInWithOAuth = async (
  provider: string,
  callbackUrl?: string,
): Promise<ApiResult<{ redirectUrl: string }>> => {
  try {
    // Validate provider
    const supportedProviders = ["google"]; // Add more providers as needed
    if (!supportedProviders.includes(provider.toLowerCase())) {
      return {
        success: false,
        error: `Unsupported OAuth provider: ${provider}`,
      };
    }

    // Build the OAuth initiation URL - make sure provider is lowercase
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/oauth/${provider.toLowerCase()}`;
    const url = new URL(baseUrl);

    // Add frontend callback URL as query parameter
    const frontendCallback = callbackUrl
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?redirect=${encodeURIComponent(callbackUrl)}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;

    url.searchParams.append("callback", frontendCallback);

    console.log("OAuth URL being constructed:", url.toString()); // Debug log

    return {
      success: true,
      data: { redirectUrl: url.toString() },
    };
  } catch (error) {
    console.error("OAuth initiation error:", error);
    return {
      success: false,
      error: "Failed to initiate OAuth sign-in. Please try again.",
    };
  }
};

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
export const exchangeOAuthCode = async (
  provider: string,
  code: string,
  state?: string,
): Promise<ApiResult<{ token: string }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/oauth/${provider}/callback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          state: state || undefined,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      // Handle specific OAuth errors
      if (errorText.includes("account_exists_with_password")) {
        const errorData = JSON.parse(errorText);
        return {
          success: false,
          error:
            errorData.message ||
            "An account with this email already exists. Please sign in with your email and password instead.",
        };
      }

      if (errorText.includes("Invalid authorization code")) {
        return {
          success: false,
          error: "Invalid authorization code. Please try signing in again.",
        };
      }

      if (errorText.includes("OAuth provider error")) {
        return {
          success: false,
          error:
            "Authentication failed with the OAuth provider. Please try again.",
        };
      }

      return {
        success: false,
        error: "OAuth authentication failed. Please try again.",
      };
    }

    const body: { token: string } = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("OAuth code exchange error:", error);
    return {
      success: false,
      error:
        "An unexpected error occurred during OAuth authentication. Please try again.",
    };
  }
};
