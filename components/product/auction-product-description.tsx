import { Badge } from "../ui/badge";
import { Product } from "@/lib/shopify/types";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Button } from "../ui/button";
import { getAuction, placeBidAction } from "@/server/auction/actions";
import { AuctionClock } from "@/components/utils/auction-clock";
import { Input } from "../ui/input";
import { Lock } from "lucide-react";
import { cookies } from "next/headers";
import { getUserDetails } from "@/server/user/actions";
import Form from "next/form";

interface AuctionProductDescriptionProps {
  product: Product;
  isMember: boolean;
}

export async function AuctionProductDescription({
  product,
  isMember,
}: AuctionProductDescriptionProps) {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get("bvrstrco_auth");
  const authToken = authTokenCookie?.value || null;

  // Decode userId from token
  let userId: number | null = null;
  let isAuthenticated = false;
  if (authToken) {
    try {
      const payload = JSON.parse(atob(authToken.split(".")[1]));
      userId = payload.userid || null;
      isAuthenticated = !!userId;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const productId = product.id.split("/").pop() || "";

  // Fetch auction data
  const auctionResult = await getAuction(productId);
  if (!auctionResult.success || !auctionResult.data) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive mb-2">Failed to load auction data</p>
        <p className="text-sm text-muted-foreground">{auctionResult.error}</p>
      </div>
    );
  }

  const auctionData = auctionResult.data;

  // Get user data if authenticated
  let user = null;
  if (isAuthenticated && userId && authToken) {
    const userResult = await getUserDetails(authToken, userId);
    if (userResult.success) {
      user = userResult.data;
    }
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
  const canBid = isAuthenticated && user?.isMember && !isAuctionEnded;

  return (
    <>
      {!isAuthenticated || !user?.isMember ? (
        <div className="mb-2 flex flex-row items-center justify-between">
          <h1 className="text-sm font-semibold text-destructive">
            Member Only Auction
          </h1>
          <Lock className="h-4 w-4 text-destructive" />
        </div>
      ) : null}

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
        <div className="flex justify-between items-center ">
          <div className="flex-col flex justify-between items-start mb-2">
            <span className="text-sm font-medium">
              {isAuctionEnded ? "Final Bid" : "Current Bid"}
            </span>
            <span className="text-lg font-bold text-primary">
              ${auctionData.auction.highest_bid}
            </span>
          </div>
          <div className="flex-col flex justify-between items-start">
            <span className="text-sm font-medium">Remaining Time</span>
            <div className="flex justify-end items-center text-xs text-muted-foreground mb-2">
              <AuctionClock
                time={getTimeUntilEnd(auctionData.auction.end_date)}
              />
            </div>
            {isAuctionEnded && (
              <div className="text-sm font-medium text-destructive mt-2">
                🔴 Auction Ended
              </div>
            )}
          </div>
        </div>
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
          {canBid ? (
            <Form action={placeBidAction} className="flex gap-2">
              <input type="hidden" name="productId" value={productId} />
              <input
                type="hidden"
                name="productHandle"
                value={product.handle}
              />
              <Input
                type="number"
                name="bidAmount"
                placeholder={`Min: ${minimumBid}`}
                min={minimumBid}
                max={maximumBid}
                step={auctionData.auction.minimum_bid_increment}
                className="w-1/2"
                required
              />
              <Button type="submit" className="w-1/2">
                Bid Now
              </Button>
            </Form>
          ) : !isAuthenticated ? (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Min: ${minimumBid}`}
                className="w-1/2"
                disabled
              />
              <Link
                href={`/signin?redirect=/products/${product.handle}`}
                className="w-1/2"
              >
                <Button variant="default" className="w-full">
                  Sign In To Bid
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Min: ${minimumBid}`}
                className="w-1/2"
                disabled
              />
              <Link href={`/membership`} className="w-1/2">
                <Button variant="default" className="w-full">
                  Become a Member
                </Button>
              </Link>
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
            <p>
              Bid range: ${minimumBid} - ${maximumBid}
            </p>
            <p>Increment: ${auctionData.auction.minimum_bid_increment}</p>
          </div>
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

      <div className="mt-4 flex flex-col gap-2.5 bg-muted h-fit w-full rounded-md text-xs font-muted-foreground font-semibold p-2">
        <div
          className={`flex flex-col gap-1 ${isAuctionEnded ? "text-destructive" : "text-primary"}`}
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
