"use client";
import { useActionState } from "react";
import Form from "next/form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { handleOTPSubmit } from "@/server/user/actions";

interface ForgotPasswordOTPCardProps {
  email: string;
}

export function ForgotPasswordOTPCard({ email }: ForgotPasswordOTPCardProps) {
  const initialState = {
    email: email,
  };

  const [message, formAction, pending] = useActionState(
    (state: any, formData: FormData) => handleOTPSubmit(initialState, formData),
    null,
  );

  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
        <CardDescription>
          We sent an 8-character code to {email}. Entesr it below to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Verification Code
            </label>
            <Input
              type="text"
              name="code"
              placeholder="RGVMdHNP"
              maxLength={8}
              minLength={8}
              pattern="[A-Za-z0-9]{8}"
              className="text-center text-lg font-semibold tracking-widest"
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter the 8-character code sent to your email
            </p>
          </div>
          <Button
            disabled={pending}
            type="submit"
            className="w-full"
            id="forgot-password-verify-otp-button"
            data-umami-event="Forgot Password verify OTP"
          >
            {pending ? "Verifying..." : "Verify Code"}
          </Button>
          <Button type="button" variant="outline" className="w-full" asChild>
            <Link href="/forgot-password">Back to Email</Link>
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-2">
        {message?.error && (
          <div className="mb-4 p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 max-w-sm rounded-md">
            {message.error}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
