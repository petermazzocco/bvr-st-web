"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "@/components/ui/badge";
import { createCheckoutSession } from "@/server/stripe/actions";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { getAuthToken, getUserIdFromToken } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function MembershipCard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = getUserIdFromToken();
    const token = getAuthToken();
    setUserId(id);
    setAuthToken(token);
  }, []);

  const { mutate: createCheckout, isPending } = useApiMutation(
    async () => {
      if (!userId || !authToken) {
        throw new Error("User authentication required");
      }

      const successURL = `${window.location.origin}/membership?stripe_checkout=success&user_id=${userId}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelURL = `${window.location.origin}/membership`;

      const result = await createCheckoutSession(
        userId,
        successURL,
        cancelURL,
        authToken,
      );
      return { success: true, data: result };
    },
    {
      onSuccess: (data) => {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      },
      onError: (error) => {
        toast.error(error || "Failed to create checkout session");
      },
    },
  );

  const handleStartMembership = () => {
    if (!userId || !authToken) {
      toast.error("Please sign in to continue");
      return;
    }
    createCheckout(undefined);
  };

  return (
    <Card className="border-none">
      <CardHeader className="text-left">
        <CardTitle className="text-2xl">Premium Membership</CardTitle>
        <CardDescription>
          Get instant access to all premium features
        </CardDescription>
      </CardHeader>
      <div className="flex flex-row items-center justify-center w-full px-6">
        <Separator className="flex-1" />
        <Badge className="text-2xl font-bold px-4" variant={"outline"}>
          $10 <span className="text-sm text-muted-foreground">per month</span>
        </Badge>
        <Separator className="flex-1" />
      </div>
      <CardContent>
        <div className="space-y-2">
          <ul className="space-y-1 text-sm">
            <li>• Access to all auctions</li>
            <li>• Receive monthly digital perks</li>
            <li>• Exclusive member-only events</li>
            <li>• Priority customer support</li>
            <li>• Access to all new features</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <Button
          className="w-full"
          onClick={handleStartMembership}
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Start Membership"}
        </Button>
      </CardFooter>
    </Card>
  );
}
