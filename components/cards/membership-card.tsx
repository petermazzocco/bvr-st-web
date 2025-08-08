"use client";

import { useActionState, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createCheckoutSession } from "@/server/stripe/actions";
import { AffiliateSelection } from "../utils/affiliate-selection";
import Link from "next/link";
import Form from "next/form";
import { redirect } from "next/navigation";
import { Affiliate } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";

interface MembershipCardProps {
  authToken: string | null;
  userId: string | null;
  affiliates: Affiliate[] | undefined;
  affiliateCode?: string;
  type?: string;
  redirectParams?: string;
}

export function MembershipCard({
  authToken,
  userId,
  affiliates,
  affiliateCode,
  type,
  redirectParams,
}: MembershipCardProps) {
  const [selectedType, setSelectedType] = useState(type || "yearly");
  const [message, formAction, pending] = useActionState(
    createCheckoutSession,
    null,
  );

  if (!authToken || !userId) {
    redirect("/signin?redirect=/membership");
  }

  return (
    <Card className={cn("border-none")}>
      <CardHeader className="text-left">
        <CardTitle className="text-2xl">Premium Membership</CardTitle>
        <CardDescription>
          Get instant access to all premium features
        </CardDescription>
      </CardHeader>
      <div className="px-6">
        <Tabs
          value={selectedType}
          onValueChange={setSelectedType}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="mt-4">
            <div className="flex flex-row items-center justify-center w-full">
              <Separator className="flex-1" />
              <Badge className="text-2xl font-bold px-4" variant={"outline"}>
                $10{" "}
                <span className="text-sm text-muted-foreground">per month</span>
              </Badge>
              <Separator className="flex-1" />
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="mt-4">
            <div className="flex flex-row items-center justify-center w-full">
              <Separator className="flex-1" />
              <Badge className="text-2xl font-bold px-4" variant={"outline"}>
                $100
                <span className=" text-sm opacity-50 line-through">$120</span>
                <span className=" text-sm text-muted-foreground">per year</span>
              </Badge>
              <Separator className="flex-1" />
            </div>
            <p className="text-xs text-primary text-center font-semibold mt-2">
              Get 2 months free when you sign up for a yearly membership
            </p>
          </TabsContent>
        </Tabs>
      </div>
      <CardContent>
        <div className="space-y-2">
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• 10% off all purchases</li>
            <li>• Early access to all new products</li>
            <li>• Receive free digital perks</li>
            <li>• Access to exclusive member-only events</li>
            <li>• Priority customer support</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="w-full flex flex-col gap-4">
        {/*{affiliates && (
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
        )}*/}
        <Form action={formAction}>
          <input type="hidden" name="userId" value={userId?.toString() || ""} />
          <input type="hidden" name="type" value={selectedType} />
          {affiliateCode && (
            <input type="hidden" name="affiliateCode" value={affiliateCode} />
          )}
          <Button
            disabled={pending}
            type="submit"
            className="w-full group"
            id="membership-button"
            data-umami-event="Create membership intent button"
          >
            {pending ? "Processing..." : "Start Membership"}
            <ArrowRightIcon
              className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </Form>
        {redirectParams && redirectParams === "/membership" && (
          <Link href="/account">
            <Button
              variant={"link"}
              size={"sm"}
              className="w-full text-muted-foreground text-xs"
              id="skipped-membership-button"
              data-umami-event="Skipped creating membership event"
            >
              Skip and Continue To Account
            </Button>
          </Link>
        )}
        {message?.error && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {message.error}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
