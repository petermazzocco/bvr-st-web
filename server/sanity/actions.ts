"use server";

import {
  ApiResult,
  Notification,
  Team,
  Doc,
  Post,
  HeroSection,
  Career,
  AdditionalDetails,
  AdditionalCollectionDetails,
  CollectionLookbook,
} from "@/lib/types";

/**
 * Retrieves all active notifications for the authenticated user
 * @param authToken - Bearer token for authentication
 * @param userId - User ID for the authenticated user
 * @returns Promise containing array of active, non-expired notifications or error
 */
export const getUserNotifications = async (
  authToken: string | null,
  userId: number,
): Promise<ApiResult<Notification[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/sanity/notification`,
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
          error: "You are not authorized to access notifications.",
        };
      }
      return {
        success: false,
        error: "Failed to retrieve notifications. Please try again.",
      };
    }
    const body: Notification[] = await response.json();

    // Filter out expired and inactive notifications on the client side as well
    const activeNotifications = body.filter((notification) => {
      // Check if the notification is marked as active
      if (notification.isActive !== true) return false;

      // If there's no expiration date, the notification is always active
      if (!notification.expiresAt) return true;

      // Check if the notification hasn't expired
      return new Date(notification.expiresAt) > new Date();
    });

    return {
      success: true,
      data: activeNotifications,
    };
  } catch (error) {
    console.error("Get user notifications error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Marks a specific notification as read for the authenticated user
 * @param authToken - Bearer token for authentication
 * @param notificationId - Unique identifier for the notification
 * @returns Promise containing notification details or error
 */
export const markNotificationAsRead = async (
  authToken: string | null,
  notificationId: string,
  userId: number,
): Promise<ApiResult<Notification>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}/sanity/notification/${notificationId}/read`,
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

      if (errorText.includes("Unauthorized")) {
        return {
          success: false,
          error: "You are not authorized to mark this notification as read.",
        };
      }

      if (errorText.includes("not found")) {
        return {
          success: false,
          error: "Notification not found.",
        };
      }

      return {
        success: false,
        error: "Failed to mark notification as read. Please try again.",
      };
    }

    const body: Notification = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves all team members from the public API
 * @returns Promise containing array of team members or error
 */
export const getTeamMembers = async (): Promise<ApiResult<Team[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/team`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to retrieve team members. Please try again.",
      };
    }

    const body: Team[] = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get team members error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves all career opportunities from the public API
 * @returns Promise containing array of career opportunities or error
 */
export const getCareers = async (): Promise<ApiResult<Career[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/careers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to retrieve careers. Please try again.",
      };
    }

    const body: Career[] = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get careers error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves a specific legal document by its slug
 * @param slug - URL slug identifier for the legal document
 * @returns Promise containing legal document details or error
 */
export const getLegalDocBySlug = async (
  slug: string,
): Promise<ApiResult<Doc>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/docs/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("not found")) {
        return {
          success: false,
          error: "Legal document not found.",
        };
      }

      return {
        success: false,
        error: "Failed to retrieve legal document. Please try again.",
      };
    }

    const body: Doc = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get legal document error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves the hero section content for the homepage
 * @returns Promise containing hero section data or error
 */
export const getHeroSection = async (): Promise<ApiResult<HeroSection>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/hero`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to retrieve hero section. Please try again.",
      };
    }

    const body: HeroSection = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get hero section error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves all published blog posts
 * @returns Promise containing array of blog posts or error
 */
export const getBlogPosts = async (): Promise<ApiResult<Post[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/posts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to retrieve blog posts. Please try again.",
      };
    }

    const body: Post[] = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get blog posts error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves a specific blog post by its slug
 * @param slug - URL slug identifier for the blog post
 * @returns Promise containing blog post details or error
 */
export const getBlogPostBySlug = async (
  slug: string,
): Promise<ApiResult<Post>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/posts/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("not found")) {
        return {
          success: false,
          error: "Blog post not found.",
        };
      }

      return {
        success: false,
        error: "Failed to retrieve blog post. Please try again.",
      };
    }

    const body: Post = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get blog post error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves additional product details by handle
 * @param handle - Merchandise handle identifier
 * @returns Promise containing additional details or error
 */
export const getAdditionalProductDetailsByHandle = async (
  handle: string,
): Promise<ApiResult<AdditionalDetails>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/merch/products/${handle}/details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("not found")) {
        return {
          success: false,
          error: "Additional details not found for this merchandise.",
        };
      }

      if (errorText.includes("Invalid handle")) {
        return {
          success: false,
          error: "Invalid merchandise handle provided.",
        };
      }

      return {
        success: false,
        error: "Failed to retrieve additional details. Please try again.",
      };
    }

    const body: AdditionalDetails = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get additional details error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves additional collection details by handle
 * @param handle - Merchandise handle identifier
 * @returns Promise containing additional details or error
 */
export const getAdditionalCollectionDetailsByHandle = async (
  handle: string,
): Promise<ApiResult<AdditionalCollectionDetails>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/merch/collections/${handle}/details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("not found")) {
        return {
          success: false,
          error: "Additional details not found for this merchandise.",
        };
      }

      if (errorText.includes("Invalid handle")) {
        return {
          success: false,
          error: "Invalid merchandise handle provided.",
        };
      }

      return {
        success: false,
        error: "Failed to retrieve additional details. Please try again.",
      };
    }

    const body: AdditionalCollectionDetails = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get additional details error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Retrieves additional collection details by handle
 * @param handle - Merchandise handle identifier
 * @returns Promise containing additional details or error
 */
export const getCollectionLookbookByHandle = async (
  handle: string,
): Promise<ApiResult<CollectionLookbook>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/merch/collections/${handle}/lookbook`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("not found")) {
        return {
          success: false,
          error: "Lookbook not found for this merchandise.",
        };
      }

      if (errorText.includes("Invalid handle")) {
        return {
          success: false,
          error: "Invalid merchandise handle provided.",
        };
      }

      return {
        success: false,
        error: "Failed to retrieve lookbook. Please try again.",
      };
    }

    const body: CollectionLookbook = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get additional details error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};
