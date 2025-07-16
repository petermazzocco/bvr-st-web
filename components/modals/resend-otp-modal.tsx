"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { resendOTPCode } from "@/server/user/actions";
import {
  useAuth,
  useAuthToken,
  useUserId,
} from "@/components/auth/auth-context";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { OTPCard } from "@/components/cards/otp-card";

const resendOTPSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ResendOTPFormValues = z.infer<typeof resendOTPSchema>;

export function ResendOTPModal({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [showOTPCard, setShowOTPCard] = useState(false);
  const { isAuthenticated } = useAuth();
  const token = useAuthToken();
  const userId = useUserId();

  const form = useForm<ResendOTPFormValues>({
    resolver: zodResolver(resendOTPSchema),
    defaultValues: {
      email: email,
    },
  });

  const { mutate: resendOTP, isPending: isResending } = useApiMutation(
    async () => {
      if (!token || !userId) {
        throw new Error("Authentication required");
      }
      const response = await resendOTPCode(userId, token);
      return response;
    },
    {
      onSuccess: (response) => {
        toast.success(response?.message || "OTP code resent successfully");
        setShowOTPCard(true);
        form.reset();
      },
      onError: (error) => {
        toast.error(error || "Failed to resend OTP code");
        console.error("Error resending OTP:", error);
      },
    },
  );

  const onSubmit = () => {
    resendOTP(undefined);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setShowOTPCard(false);
      form.reset();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Resend Verification Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resend Verification Code</DialogTitle>
          <DialogDescription>
            {showOTPCard
              ? "Enter the new verification code sent to your email"
              : "Click the button below to resend the verification code to your email"}
          </DialogDescription>
        </DialogHeader>

        {showOTPCard ? (
          <OTPCard />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isResending}
                id="resend-otp-button"
                data-umami-event="User resend otp button"
              >
                {isResending ? "Resending..." : "Resend OTP Code"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
