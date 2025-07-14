"use client";

import { MembershipCard } from "@/components/cards/membership-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { updateUserAfterCheckout } from "@/server/stripe/actions";
import { getAuthToken, getUserIdFromToken } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function MembershipPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const id = getUserIdFromToken();
    const token = getAuthToken();
    setUserId(id);
    setAuthToken(token);
  }, []);

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async ({
      userId,
      sessionId,
      authToken,
    }: {
      userId: string;
      sessionId: string;
      authToken: string;
    }) => {
      return await updateUserAfterCheckout(userId, sessionId, authToken);
    },
    onSuccess: (data) => {
      setShowSuccessMessage(true);
      toast.success(
        `Success! ${data.pointsAdded} points added to your account.`,
      );
      // Remove query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user after checkout");
    },
  });

  useEffect(() => {
    const stripeCheckout = searchParams.get("stripe_checkout");
    const sessionId = searchParams.get("session_id");
    const userIdFromParams = searchParams.get("user_id");

    if (stripeCheckout === "success" && sessionId && authToken) {
      // Use userId from params or fallback to userId from state
      const finalUserId = userIdFromParams || userId;
      if (finalUserId) {
        updateUser({ userId: finalUserId, sessionId, authToken });
      }
    }
  }, [searchParams, authToken, userId, updateUser]);

  const SuccessMessage = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl mb-2">You&apos;re now a Premium Member!</h2>
        <p className="text-gray-600 mb-4">
          Access your account and benefits now:
        </p>
        <Separator className="my-4" />
        <Button onClick={() => router.push("/account")} className="w-full">
          Go to Account
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 py-2">
        {isPending ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Processing your membership...</p>
            </div>
          </div>
        ) : showSuccessMessage ? (
          <SuccessMessage />
        ) : (
          <MembershipCard />
        )}
      </div>

      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/mock-auth.webp"
          alt="Authentication illustration"
          fill
          className="object-cover"
        />
      </div>

      <div className="md:hidden relative w-full min-h-screen">
        <Image
          src="/mock-auth.webp"
          alt="Authentication illustration"
          fill
          className="object-cover blur-sm"
        />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-2">
          {isPending ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Processing your membership...</p>
              </div>
            </div>
          ) : showSuccessMessage ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-400 mb-2">
                  🎉 Congratulations!
                </h2>
                <p className="text-lg mb-4 text-white">
                  You&apos;re now a premium member!
                </p>
                <p className="text-gray-200 mb-6">Access your account now</p>
                <Button
                  onClick={() => router.push("/account")}
                  className="px-6 py-2"
                >
                  Go to Account
                </Button>
              </div>
            </div>
          ) : (
            <MembershipCard />
          )}
        </div>
      </div>
    </div>
  );
}
