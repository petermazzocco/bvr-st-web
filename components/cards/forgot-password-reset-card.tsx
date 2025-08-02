"use client";

import Form from "next/form";
import Link from "next/link";
import { confirmForgotPassword } from "@/server/user/actions";
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
import { useActionState } from "react";

interface ForgotPasswordResetCardProps {
  email: string;
  code: string;
}

export function ForgotPasswordResetCard({
  email,
  code,
}: ForgotPasswordResetCardProps) {
  const [message, formAction, pending] = useActionState(
    confirmForgotPassword,
    null,
  );
  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Set New Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="code" value={code} />
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New Password
            </label>
            <Input type="password" name="newPassword" required />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
            </ul>
          </div>

          <Button
            disabled={pending}
            type="submit"
            className="w-full"
            id="reset-forgotten-password-button"
            data-umami-event="Reset forgotten password button"
          >
            {pending ? "Resetting password..." : "Reset Password"}
          </Button>
          <Button type="button" variant="outline" className="w-full" asChild>
            <Link
              href={`/forgot-password/verify?email=${encodeURIComponent(email)}`}
            >
              Back to Verification
            </Link>
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
