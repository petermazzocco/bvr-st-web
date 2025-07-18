"use client";
import { Price } from "@/components/product/product-price";
import { Product } from "@/lib/shopify/types";
import { Separator } from "../ui/separator";
import { useCart } from "@/components/cart/cart-context";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { getAuction, placeBid } from "@/server/auction/actions";
import { Auction } from "@/lib/types";
import { toast } from "sonner";

export function AuctionProductDescription({ product }: { product: Product }) {
  const { isAuthenticated } = useCart();
  const [bidAmount, setBidAmount] = useState("");
  const [auctionData, setAuctionData] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);

  // For auction products, we'll use the shopify product ID
  const productId = product.id.split("/").pop() || "";

  // Fetch auction data on component mount
  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const result = await getAuction(productId);
        if (result.success) {
          setAuctionData(result?.data || null);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Failed to fetch auction data:", error);
        toast.error("Failed to load auction data");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionData();
  }, [productId]);

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to place a bid");
      return;
    }

    if (!bidAmount || !auctionData) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    const minimumBid =
      auctionData.auction.highest_bid +
      auctionData.auction.minimum_bid_increment;
    if (parseFloat(bidAmount) < minimumBid) {
      toast.error(`Bid must be at least ${minimumBid}`);
      return;
    }

    setBidLoading(true);

    try {
      // TODO: Get actual customer data from your auth context
      const bidRequest = {
        bid: bidAmount,
        currency: "USD", // You might want to get this from the product or user settings
        customer_email: "user@example.com", // Get from auth context
        customer_id: "12345", // Get from auth context
        customer_first_name: "John", // Get from auth context
        customer_last_name: "Doe", // Get from auth context
        shopify_product_id: productId,
      };

      const result = await placeBid(bidRequest);

      if (result.success) {
        toast.success(`Bid placed successfully for ${result?.data?.bid}!`);
        setBidAmount("");

        // Refresh auction data to show updated bid
        const updatedAuction = await getAuction(productId);
        if (updatedAuction.success) {
          setAuctionData(updatedAuction.data || null);
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Failed to place bid:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setBidLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to buy now");
      return;
    }

    if (!auctionData?.auction.buy_it_now_price) {
      toast.error("Buy it now is not available for this auction");
      return;
    }

    // TODO: Implement buy it now functionality
    // This might involve creating a direct purchase or ending the auction
    console.log(
      `Buy now for product ${productId} at ${auctionData.auction.buy_it_now_price}`,
    );
    toast.info("Buy now functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-2 flex flex-row items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="mb-4 p-3 bg-gray-100 rounded-md h-20"></div>
        <div className="mb-4 space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!auctionData) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-2">Failed to load auction data</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const minimumBid =
    auctionData.auction.highest_bid + auctionData.auction.minimum_bid_increment;

  const isAuctionEnded = new Date() > new Date(auctionData.auction.end_date);

  return (
    <>
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1 className="text-sm font-semibold">{product.title}</h1>
        <div className="flex flex-col items-center gap-2">
          <div className="mr-auto w-auto p-2 text-sm font-semibold">
            <span className="text-xs text-muted-foreground">Current Bid:</span>
            <Price
              amount={auctionData.auction.highest_bid.toString()}
              currencyCode="USD"
            />
          </div>
        </div>
      </div>

      {/* Auction Status */}
      <div className={`mb-4 p-3 rounded-md ${isAuctionEnded ? 'bg-red-50' : 'bg-blue-50'}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            {isAuctionEnded ? 'Final Bid' : 'Current Bid'}
          </span>
          <span className="text-lg font-bold">
            ${auctionData.auction.highest_bid}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
          <span>{auctionData.auction.bid_count} bid(s)</span>
          <span>
            {isAuctionEnded ? 'Ended: ' : 'Ends: '}
            {formatDate(auctionData.auction.end_date)}
          </span>
        </div>
        {isAuctionEnded && (
          <div className="text-sm font-medium text-red-600 mt-2">
            🔴 Auction Ended
          </div>
        )}
        {auctionData.auction.reserve_price && (
          <div className="text-xs text-orange-600">
            Reserve price: ${auctionData.auction.reserve_price}
          </div>
        )}
      </div>

      {/* Recent Bids */}
      {auctionData.auction_bids && auctionData.auction_bids.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium mb-2">Recent Bids</h3>
          <div className="space-y-1">
            {auctionData.auction_bids.slice(0, 3).map((bid, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span>
                  {bid.customer_first_name} {bid.customer_last_name}
                </span>
                <span>
                  ${bid.bid} {bid.currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bidding Section */}
      {!isAuctionEnded ? (
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Min: ${minimumBid}`}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              min={minimumBid}
              step="0.01"
            />
            <Button
              onClick={handlePlaceBid}
              disabled={!bidAmount || !isAuthenticated || bidLoading}
              className="px-6"
            >
              {bidLoading ? "Placing..." : "Place Bid"}
            </Button>
          </div>

          {auctionData.auction.buy_it_now_price && (
            <Button
              onClick={handleBuyNow}
              disabled={!isAuthenticated}
              variant="outline"
              className="w-full"
            >
              Buy It Now - ${auctionData.auction.buy_it_now_price}
            </Button>
          )}
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-100 rounded-md text-center">
          <p className="text-lg font-semibold text-gray-600 mb-2">
            This auction has ended
          </p>
          <p className="text-sm text-gray-500">
            Bidding is no longer available for this item
          </p>
        </div>
      )}

      <div className="mb-6 text-xs leading-tight text-muted-foreground flex flex-row items-center justify-between">
        <p>Auction Item - No Returns</p>
        <p className="cursor-pointer underline">Auction Terms</p>
      </div>

      <Separator className="my-4" />

      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800 mb-2">
            You must be logged in to participate in auctions.
          </p>
          <Link href="/login" className="text-blue-600 hover:underline text-sm">
            Sign in to bid
          </Link>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-1 bg-muted h-fit w-full rounded-md text-xs font-muted-foreground font-semibold p-2">
        <p className={isAuctionEnded ? "text-red-600" : "text-orange-600"}>
          {isAuctionEnded 
            ? `🔴 Auction Ended - ${formatDate(auctionData.auction.end_date)}`
            : `🔥 Auction Item - Ending ${formatDate(auctionData.auction.end_date)}`
          }
        </p>
        <p className="text-green-600">
          ✅ Authentic item verified by our experts
        </p>
        {auctionData.auction.real_time_auction && !isAuctionEnded && (
          <p className="text-blue-600">
            ⚡ Real-time auction - bids update live
          </p>
        )}
      </div>
    </>
  );
}
