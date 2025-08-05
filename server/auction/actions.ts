"use server";

import {
  ApiResult,
  Auction,
  PlaceBidRequest,
  PlaceBidResponse,
} from "@/lib/types";
import { cookies } from "next/headers";
import { getUserDetails } from "@/server/user/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server action to get auction data
export const getAuction = async (
  productId: string,
): Promise<ApiResult<Auction>> => {
  try {
    const response = await fetch(
      `https://auction-api.tunnelpacket.com/api/auction/${productId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.AUCTION_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 404) {
        return {
          success: false,
          error: "Auction not found.",
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          error: "Unauthorized. Please check your API key.",
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: "Access denied to this auction.",
        };
      }

      if (errorText.includes("Invalid product ID")) {
        return {
          success: false,
          error: "Please provide a valid product ID.",
        };
      }

      return {
        success: false,
        error: "Failed to fetch auction data. Please try again.",
      };
    }

    const auctionData: Auction = await response.json();
    return {
      success: true,
      data: auctionData,
    };
  } catch (error) {
    console.error("Get auction error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

// Additional server action for placing bids
export const placeBid = async (
  bidRequest: PlaceBidRequest,
): Promise<ApiResult<PlaceBidResponse>> => {
  try {
    const response = await fetch(
      `https://auction-api.tunnelpacket.com/api/auction/place_bid`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AUCTION_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidRequest),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 400) {
        if (errorText.includes("Bid too low")) {
          return {
            success: false,
            error: "Bid amount is too low. Please increase your bid.",
          };
        }
        if (errorText.includes("Auction ended")) {
          return {
            success: false,
            error: "This auction has already ended.",
          };
        }
        if (errorText.includes("Invalid bid amount")) {
          return {
            success: false,
            error: "Please enter a valid bid amount.",
          };
        }
        if (errorText.includes("Invalid customer")) {
          return {
            success: false,
            error: "Invalid customer information provided.",
          };
        }
      }

      if (response.status === 401) {
        return {
          success: false,
          error: "Unauthorized. Please check your API key.",
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: "Auction not found.",
        };
      }

      return {
        success: false,
        error: "Failed to place bid. Please try again.",
      };
    }

    const responseData: PlaceBidResponse = await response.json();
    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error("Place bid error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

// Server action for form-based bid placement
export async function placeBidAction(formData: FormData) {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get("bvrstco_auth");
  const authToken = authTokenCookie?.value || null;

  // Decode userId from token
  let userId: string | null = null;
  if (authToken) {
    try {
      const payload = JSON.parse(atob(authToken.split(".")[1]));
      userId = payload.userid || null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  if (!userId || !authToken) {
    redirect("/signin");
  }

  // Get user details
  const user = await getUserDetails(authToken, userId);
  if (!user.success || !user.data) {
    redirect("/signin");
  }

  // Get form data
  const bidAmount = formData.get("bidAmount") as string;
  const productId = formData.get("productId") as string;
  const productHandle = formData.get("productHandle") as string;

  if (!bidAmount || !productId) {
    throw new Error("Missing required fields");
  }

  // Get current auction data to validate the bid
  const auction = await getAuction(productId);
  if (!auction.success || !auction.data) {
    throw new Error("Auction not found");
  }

  const minimumBid =
    auction.data.auction.highest_bid +
    auction.data.auction.minimum_bid_increment;
  const maximumBid = minimumBid + auction.data.auction.maximum_bid_increment;
  const bidValue = parseFloat(bidAmount);

  if (bidValue < minimumBid) {
    throw new Error(`Bid must be at least ${minimumBid}`);
  }

  if (bidValue > maximumBid) {
    throw new Error(`Bid cannot exceed ${maximumBid}`);
  }

  // Check if auction has ended
  const isAuctionEnded = new Date() > new Date(auction.data.auction.end_date);
  if (isAuctionEnded) {
    throw new Error("This auction has already ended");
  }

  // Check if user is a member
  if (!user.data.isMember) {
    redirect("/membership");
  }

  // Prepare bid request
  const bidRequest: PlaceBidRequest = {
    bid: bidAmount,
    currency: "USD",
    customer_email: user.data.email,
    customer_id: user.data.shopifyCustomerID,
    customer_first_name: user.data.firstName || "",
    customer_last_name: user.data.lastName || "",
    shopify_product_id: productId,
  };

  // Place the bid
  const result = await placeBid(bidRequest);

  if (!result.success) {
    throw new Error(result.error);
  }

  // Revalidate the product page to show updated auction data
  revalidatePath(`/products/${productHandle}`);

  // Redirect back to the product page
  redirect(
    `/products/${productHandle}?bidSuccess=true&amount=${result.data?.bid}`,
  );
}
