"use server";

import { ApiResult, Notification, Team, Doc, Post, Career } from "@/lib/types";

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
    const normalizedSlug = slug.toLowerCase();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sanity/posts/${normalizedSlug}`,
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
