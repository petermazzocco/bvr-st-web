"use client";

import { useActionState } from "react";
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
import { AffiliateSelection } from "../utils/affiliate-selection";
import Link from "next/link";
import Form from "next/form";
import { redirect } from "next/navigation";
import { Affiliate } from "@/lib/types";

interface MembershipCardProps {
  authToken: string | null;
  userId: number | null;
  affiliates: Affiliate[] | undefined;
  affiliateCode?: string;
}

export function MembershipCard({
  authToken,
  userId,
  affiliates,
  affiliateCode,
}: MembershipCardProps) {
  const [message, formAction, pending] = useActionState(
    createCheckoutSession,
    null,
  );

  if (!authToken || !userId) {
    redirect("/signin?redirect=/membership");
  }

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
            <li>• 10% off all purchases</li>
            <li>• Access to all auctions</li>
            <li>• Receive monthly digital perks</li>
            <li>• Exclusive member-only events</li>
            <li>• Priority customer support</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="w-full flex flex-col gap-4">
        {affiliates && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-foreground">
              This purchase will support:
            </p>
            <AffiliateSelection affiliates={affiliates} />

            <Link
              href="/about#pricing"
              className="text-xs underline text-muted-foreground"
            >
              Learn more about our affiliate program and transparent pricing
            </Link>
          </div>
        )}
        <Form action={formAction}>
          <input type="hidden" name="userId" value={userId?.toString() || ""} />
          {affiliateCode && (
            <input type="hidden" name="affiliateCode" value={affiliateCode} />
          )}
          <Button
            disabled={pending}
            type="submit"
            className="w-full"
            id="membership-button"
            data-umami-event="Create membership intent button"
          >
            {pending ? "Processing..." : "Start Membership"}
          </Button>
        </Form>
        {message?.error && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {message.error}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
