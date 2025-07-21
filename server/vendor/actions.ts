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
export const getAllPartneredStores = async (): Promise<ApiResult<Vendor[]>> => {
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
        return {
          success: false,
          error: "Internal server error. Please try again.",
        };
      }

      if (errorText.includes("Failed to fetch vendors from Sanity")) {
        return {
          success: false,
          error: "Failed to fetch vendors. Please try again.",
        };
      }

      if (errorText.includes("Failed to unmarshal vendors")) {
        return {
          success: false,
          error: "Failed to fetch vendors. Please try again.",
        };
      }

      return {
        success: false,
        error: "Fetching vendors failed. Please try again.",
      };
    }

    const body = await response.json();

    return {
      success: true,
      data: body.vendors || body,
    };
  } catch (error) {
    console.error("Get all partnered stores error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
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
 * @param storeName - The name of the store to fetch products for
 * @param storefrontAccessToken - The storefront access token for the store
 * @param name - The name of the vendor
 * @param logo - The logo of the vendor
 * @param banner - The banner of the vendor
 * @param description - The description of the vendor
 * @param shopLink - The shop link of the vendor
 * @param webhookSecret - The webhook secret of the vendor
 * @returns Promise of data which includes message for request being sent
 */
export const newVendorRequest = async (
  storeName: string,
  storefrontAccessToken: string,
  name: string,
  logo: string,
  banner: string,
  description: string,
  shopLink: string | undefined,
  webhookSecret: string,
): Promise<ApiResult<{ message: string }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merch/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName,
          storefrontAccessToken,
          name,
          logo,
          banner,
          description,
          shopLink,
          webhookSecret,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (errorText.includes("Internal server error")) {
        return {
          success: false,
          error: "An error occurred. Please try again.",
        };
      }

      return {
        success: false,
        error: "An error occurred. Please try again.",
      };
    }

    const body: { message: string } = await response.json();
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
