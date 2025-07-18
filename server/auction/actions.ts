"use server";

import {
  ApiResult,
  Auction,
  PlaceBidRequest,
  PlaceBidResponse,
} from "@/lib/types";

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
      console.error("Place bid error:", await response.text());
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
