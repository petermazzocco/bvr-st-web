"use client";
import Form from "next/form";
import { handleEmailSubmit } from "@/server/user/actions";
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

export function ForgotPasswordEmailCard() {
  const [message, formAction, pending] = useActionState(
    handleEmailSubmit,
    null,
  );

  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a code to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <Button disabled={pending} type="submit" className="w-full">
            {pending ? "Sending..." : "Send Reset Code"}
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
