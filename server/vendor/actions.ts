"use server";

import {
  ApiResult,
  Vendor,
  CreateCheckoutRequest,
  PartnerStoreCollections,
  CollectionByHandleResponse,
  ProductByHandleResponse,
  CheckoutResponse,
} from "@/lib/types";

/**
 * Returns all partner stores
 * @returns Promise containing all partner stores
 */
export const getAllPartneredStores = async (): Promise<Vendor[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("Failed to initialize Sanity client")) {
        return [];
      }

      if (errorText.includes("Failed to fetch vendors from Sanity")) {
        return [];
      }

      if (errorText.includes("Failed to unmarshal vendors")) {
        return [];
      }

      return [];
    }

    const body = await response.json();

    return body.vendors || body;
  } catch (error) {
    console.error("Get all partnered stores error:", error);
    return [];
  }
};

/**
 * Gets a vendor
 * @param storeName - The name of the store to fetch vendors for
 * @returns Promise containing all partner vendors
 */
export const getPartneredStore = async (
  storeName: string,
): Promise<ApiResult<Vendor>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/${storeName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("store not found")) {
        return {
          success: false,
          error: "Not a valid store.",
        };
      }

      if (errorText.includes("Failed to get vendor from Sanity")) {
        return {
          success: false,
          error: "Failed to fetch vendors. Please try again.",
        };
      }

      return {
        success: false,
        error: "Fetching vendor failed. Please try again.",
      };
    }

    const body = await response.json();
    return {
      success: true,
      data: body.vendor || body,
    };
  } catch (error) {
    console.error("Get partnered store details error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Gets a partnered stores products
 * @param storeName - The name of the store to fetch products for
 * @returns Promise of data
 */
export const getPartnerStoreProducts = async (
  storeName: string,
): Promise<ApiResult<any>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/${storeName}/products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("store not found")) {
        return {
          success: false,
          error: "Not a valid store.",
        };
      }

      if (errorText.includes("Failed to fetch products")) {
        return {
          success: false,
          error: "Failed to fetch products from store. Please try again.",
        };
      }

      return {
        success: false,
        error: "Fetching failed. Please try again.",
      };
    }

    const body = await response.json();
    return {
      success: true,
      data: body.products || body,
    };
  } catch (error) {
    console.error("Get store products error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Gets a product by handle for a store
 * @param storeName - The name of the store to fetch products for
 * @param handle - The handle of the product to fetch
 * @returns Promise of data
 */
export const getPartnerStoreProductByHandle = async (
  storeName: string,
  handle: string,
): Promise<ApiResult<ProductByHandleResponse>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/${storeName}/products/${handle}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("store not found")) {
        return {
          success: false,
          error: "Not a valid store.",
        };
      }

      if (errorText.includes("Failed to fetch product")) {
        return {
          success: false,
          error: "Failed to fetch product from store. Please try again.",
        };
      }

      return {
        success: false,
        error: "Fetching failed. Please try again.",
      };
    }

    const body = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get product error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Gets a partnered stores collections
 * @param storeName - The name of the store to fetch collections for
 * @returns Promise of data
 */
export const getPartnerStoreCollections = async (
  storeName: string,
): Promise<ApiResult<PartnerStoreCollections>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/${storeName}/collections`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("store not found")) {
        return {
          success: false,
          error: "Not a valid store.",
        };
      }

      if (errorText.includes("Failed to fetch collections")) {
        return {
          success: false,
          error: "Failed to fetch products from store. Please try again.",
        };
      }

      return {
        success: false,
        error: "Fetching failed. Please try again.",
      };
    }

    const body = await response.json();
    return {
      success: true,
      data: body.collections || body,
    };
  } catch (error) {
    console.error("Get store collections error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Gets a collection by handle for a store
 * @param storeName - The name of the store to fetch products for
 * @param handle - The handle of the product to fetch
 * @returns Promise of data
 */
export const getPartnerStoreCollectionByHandle = async (
  storeName: string,
  handle: string,
): Promise<ApiResult<CollectionByHandleResponse>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/${storeName}/collections/${handle}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("store not found")) {
        return {
          success: false,
          error: "Not a valid store.",
        };
      }

      if (errorText.includes("Failed to fetch collection")) {
        return {
          success: false,
          error: "Failed to fetch product from store. Please try again.",
        };
      }

      return {
        success: false,
        error: "Fetching failed. Please try again.",
      };
    }

    const body = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get product error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Creates a checkout for a partnered store
 * @param storeName - The name of the store to fetch products for
 * @param checkoutData - The necessary data for creating a checkout
 * @returns Promise of data which includes url for checkout
 */
export const createCheckoutRequest = async (
  storeName: string,
  checkoutData: CreateCheckoutRequest,
): Promise<ApiResult<CheckoutResponse>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/${storeName}/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("store not found")) {
        return {
          success: false,
          error: "Not a valid store.",
        };
      }

      if (errorText.includes("Failed to fetch collection")) {
        return {
          success: false,
          error: "Failed to fetch product from store. Please try again.",
        };
      }

      return {
        success: false,
        error: "Fetching failed. Please try again.",
      };
    }

    const body = await response.json();
    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error("Get product error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Creates a new vendor request
 * @param formData - FormData containing all vendor request information
 * @returns Promise that redirects on success or throws error on failure
 */
export async function newVendorRequest(formData: FormData) {
  const requestData = {
    storeName: formData.get("storeName"),
    storefrontAccessToken: formData.get("storefrontAccessToken"),
    name: formData.get("name"),
    logo: formData.get("logo"),
    banner: formData.get("banner"),
    description: formData.get("description"),
    shopLink: formData.get("shopLink") || undefined,
    webhookSecret: formData.get("webhookSecret"),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/new`,
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
    console.error("Partner request failed:", response.status, responseText);
    throw new Error(`Partner request failed: ${responseText}`);
  }

  let body: { message: string };
  try {
    body = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON response:", responseText);
    throw new Error("Invalid response from server");
  }

  // Redirect to contact page with partner success message
  const { redirect } = await import("next/navigation");
  redirect("/contact?partner=true");
}
