import type { Metadata } from "next";
import { MembershipCard } from "@/components/cards/membership-card";
import Image from "next/image";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateUserAfterCheckout } from "@/server/stripe/actions";
import { getAuthTokenServer, getUserIdFromTokenServer } from "@/server/user/actions";
import { redirect } from "next/navigation";
import Form from "next/form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Premium Membership",
  description: "Get instant access to all premium features with BVR STR CO membership. 10% off all purchases, exclusive events, and more.",
  canonical: "https://bvrstrco.com/membership",
});

interface MembershipPageProps {
  searchParams: Promise<{ 
    stripe_checkout?: string; 
    session_id?: string; 
    user_id?: string;
    success?: string;
    points?: string;
    affiliate?: string;
  }>;
}

export default async function MembershipPage({ searchParams }: MembershipPageProps) {
  const params = await searchParams;
  const authToken = await getAuthTokenServer();
  const userId = await getUserIdFromTokenServer();

  // Handle Stripe checkout success
  const stripeCheckout = params.stripe_checkout;
  const sessionId = params.session_id;
  const userIdFromParams = params.user_id;
  
  // Show success message if explicitly set
  const showSuccess = params.success === "true";
  const pointsAdded = params.points;

  // If we have successful stripe checkout params, process them
  if (stripeCheckout === "success" && sessionId && authToken) {
    const finalUserId = Number(userIdFromParams) || userId;
    if (finalUserId) {
      // Create a form data object to pass to the server action
      const formData = new FormData();
      formData.append("userId", finalUserId.toString());
      formData.append("sessionId", sessionId);
      
      // This will redirect to membership page with success message
      await updateUserAfterCheckout(formData);
    }
  }

  const SuccessMessage = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-center">
        <h2 className="text-md mb-2">You&apos;re now a Premium Member!</h2>
        {pointsAdded && (
          <p className="text-muted-foreground text-xs mb-2">
            {pointsAdded} points added to your account!
          </p>
        )}
        <p className="text-muted-foreground text-xs mb-4">
          Access your account and benefits now:
        </p>
        <Separator className="my-4" />
        <Form action={async () => {
          "use server";
          redirect("/account");
        }}>
          <Button type="submit" className="w-full">
            Go to Account
          </Button>
        </Form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 py-2">
        {showSuccess ? (
          <SuccessMessage />
        ) : (
          <MembershipCard searchParams={{ affiliate: params.affiliate }} />
        )}
      </div>

      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/auth.jpg"
          alt="Authentication illustration"
          fill
          className="object-cover"
        />
      </div>

      <div className="md:hidden relative w-full min-h-screen">
        <Image
          src="/auth.jpg"
          alt="Authentication illustration"
          fill
          className="object-cover blur-sm"
        />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-2">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="text-center">
                <p className="text-md mb-2 text-background font-semibold">
                  You&apos;re now a premium member!
                </p>
                {pointsAdded && (
                  <p className="text-muted text-xs mb-2">
                    {pointsAdded} points added to your account!
                  </p>
                )}
                <p className="text-muted text-xs mb-6">
                  Access your account now
                </p>
                <Form action={async () => {
                  "use server";
                  redirect("/account");
                }}>
                  <Button type="submit" className="px-6 py-2">
                    Go to Account
                  </Button>
                </Form>
              </div>
            </div>
          ) : (
            <MembershipCard searchParams={{ affiliate: params.affiliate }} />
          )}
        </div>
      </div>
    </div>
  );
}