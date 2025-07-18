"use client";

import { Badge } from "../ui/badge";
import { Product } from "@/lib/shopify/types";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { getAuction, placeBid } from "@/server/auction/actions";
import { Auction } from "@/lib/types";
import { toast } from "sonner";
import {
  useAuth,
  useAuthToken,
  useUserId,
} from "@/components/auth/auth-context";
import { getUserDetails } from "@/server/user/actions";
import { useQuery } from "@tanstack/react-query";
import { AuctionClock } from "@/components/utils/auction-clock";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { BidConfirmationModal } from "@/components/modals/bid-confirmation-modal";

export function AuctionProductDescription({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const userId = useUserId();
  const authToken = useAuthToken();
  const [bidAmount, setBidAmount] = useState("");
  const [auctionData, setAuctionData] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const productId = product.id.split("/").pop() || "";

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(authToken || undefined, userId!),
    enabled: !!userId && !!authToken && isAuthenticated,
  });

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

  const handlePlaceBidClick = () => {
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

    setShowConfirmModal(true);
  };

  const handleConfirmBid = async () => {
    setBidLoading(true);
    setShowConfirmModal(false);

    try {
      if (!user) {
        toast.error("Please sign in to place a bid");
        return;
      }

      const bidRequest = {
        bid: bidAmount,
        currency: "USD",
        customer_email: user?.data?.email,
        customer_id: user?.data?.shopifyCustomerID,
        customer_first_name: user?.data?.firstName || "",
        customer_last_name: user?.data?.lastName || "",
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

  const getTimeUntilEnd = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const timeLeft = Math.max(0, Math.floor((end - now) / 1000));
    return timeLeft;
  };

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
  const maximumBid = minimumBid + auctionData.auction.maximum_bid_increment;

  const isAuctionEnded = new Date() > new Date(auctionData.auction.end_date);
  const isBidTooHigh = bidAmount ? parseFloat(bidAmount) > maximumBid : false;

  return (
    <>
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1 className="text-sm font-semibold">{product.title}</h1>
        <Badge
          variant={isAuctionEnded ? "destructive" : "default"}
          className="animate-pulse"
        >
          {isAuctionEnded ? "Ended" : "Live"}
        </Badge>
      </div>

      {/* Auction Status */}
      <div
        className={`mb-4 p-3 rounded-md ${isAuctionEnded ? "bg-destructive/10 border-destructive/50 border" : "bg-muted border-border border"}`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            {isAuctionEnded ? "Final Bid" : "Current Bid"}
          </span>
          <span className="text-lg font-bold text-primary">
            ${auctionData.auction.highest_bid}
          </span>
        </div>
        <div className="flex justify-end items-center text-xs text-muted-foreground mb-2">
          <AuctionClock time={getTimeUntilEnd(auctionData.auction.end_date)} />
        </div>
        {isAuctionEnded && (
          <div className="text-sm font-medium text-red-600 mt-2">
            🔴 Auction Ended
          </div>
        )}
      </div>

      {/* Recent Bids */}
      {auctionData.auction_bids && auctionData.auction_bids.length > 0 && (
        <div className="mb-4 p-0.5">
          <h3 className="text-sm font-medium mb-2">
            Recent Bids{" "}
            <span className="text-muted-foreground text-xs">
              {auctionData.auction.bid_count} bid(s)
            </span>
          </h3>
          <div className="space-y-1">
            {auctionData.auction_bids.slice(0, 3).map((bid, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-muted-foreground font-semibold">
                  ${bid.bid}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  {formatDate(bid.bid_date)}
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
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Min: ${minimumBid}`}
              min={minimumBid}
              max={maximumBid}
              step={auctionData.auction.minimum_bid_increment}
              className={cn(
                isBidTooHigh && "ring-2 ring-red-500 border-red-500",
                "w-1/2",
              )}
            />
            <BidConfirmationModal
              bidAmount={bidAmount}
              onConfirm={handleConfirmBid}
              isLoading={bidLoading}
              open={showConfirmModal}
              onOpenChange={setShowConfirmModal}
            >
              <Button
                onClick={handlePlaceBidClick}
                disabled={
                  !bidAmount || !isAuthenticated || bidLoading || isBidTooHigh
                }
                className="px-6 w-1/2"
              >
                {bidLoading ? "Placing..." : "Place Bid"}
              </Button>
            </BidConfirmationModal>
          </div>
          {isBidTooHigh && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">
              Maximum bid amount exceeded. Please enter a bid of ${maximumBid}{" "}
              or less.
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 p-4 bg-accent rounded-md text-center">
          <p className="text-lg font-semibold text-accent-foreground mb-2">
            This auction has ended
          </p>
          <p className="text-sm text-muted-foreground">
            Bidding is no longer available for this item
          </p>
        </div>
      )}

      <div className="mb-2 text-xs leading-tight text-muted-foreground flex flex-row items-center justify-between">
        <p>
          Auction items are non-refundable and cannot be returned. Shipping
          price and times may vary depending on the seller&apos;s location and
          item being sold. By placing an offer, you agree to the terms of the
          auction and will pay the invoice of the winning bid within the
          deadline. You can read more about the{" "}
          <span className="cursor-pointer underline">auction terms here</span>.
        </p>
      </div>

      <Separator className="my-4" />

      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800 mb-2">
            You must be logged in to participate in auctions.
          </p>
          <Link
            href={`/signin?redirect=/products/${product.handle}`}
            className="text-blue-600 hover:underline text-sm"
          >
            Sign in to bid
          </Link>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2.5 bg-muted h-fit w-full rounded-md text-xs font-muted-foreground font-semibold p-2">
        <div
          className={`flex flex-col gap-1 ${isAuctionEnded ? "text-destructive" : "text-orange-600"}`}
        >
          <div className="text-xs text-muted-foreground">
            {isAuctionEnded ? "🕕 Ended: " : "🕕 Ends: "}
            {formatDate(auctionData.auction.end_date)}
          </div>
        </div>
        <p className="text-green-600">
          ✅ Earn {minimumBid} points if you win the auction
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
