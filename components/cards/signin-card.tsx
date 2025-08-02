"use client";

import { useActionState } from "react";
import Form from "next/form";
import Link from "next/link";
import { signInWithEmail } from "@/server/user/actions";
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

export function SignInCard() {
  const [message, formAction, pending] = useActionState(signInWithEmail, null);
  return (
    <Card className="mx-auto min-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign into your BVR STR Collective account
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

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <Input type="password" name="password" required />
          </div>

          <Button
            disabled={pending}
            type="submit"
            className="w-full"
            id="signin-button"
            data-umami-event="Signin button"
          >
            {pending ? "Signing in..." : "Sign In"}
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-2">
        {message?.error && (
          <div className="mb-4 p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 max-w-sm rounded-md">
            {message.error}
          </div>
        )}
        <div className="text-center text-sm">
          {"Don't have an account? "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
          {" | "}
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
