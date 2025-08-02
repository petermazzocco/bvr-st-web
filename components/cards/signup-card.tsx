"use client";
import { useActionState } from "react";
import Form from "next/form";
import Link from "next/link";
import { signUp } from "@/server/user/actions";
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

export function SignUpCard() {
  const [message, formAction, pending] = useActionState(signUp, null);
  return (
    <Card className="mx-auto min-w-md max-w-lg shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create your free BVR STR Collective account, earn 100 points and 10%
          off your first purchase immediately!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                First Name
              </label>
              <Input type="text" name="firstName" placeholder="John" required />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Last Name
              </label>
              <Input type="text" name="lastName" placeholder="Smith" required />
            </div>
          </div>

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
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Phone Number (Optional)
            </label>
            <Input type="tel" name="phone" placeholder="+1 (555) 123-4567" />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="address"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Address
            </label>
            <Input
              type="text"
              name="address"
              placeholder="123 Main St"
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

          <div className="text-sm text-muted-foreground">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
            </ul>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="termsAccepted"
              id="termsAccepted"
              className="mt-1"
              required
            />
            <label htmlFor="termsAccepted" className="text-sm leading-none">
              I agree to the{" "}
              <Link href="/legal/terms" target="_blank" className="underline">
                Terms and Conditions
              </Link>
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="optInMarketing"
              id="optInMarketing"
              className="mt-1"
            />
            <label htmlFor="optInMarketing" className="text-sm leading-none">
              I would like to receive marketing communications about the latest
              products and services offered by BVR STR CO.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="optInRewards"
              id="optInRewards"
              className="mt-1"
            />
            <label htmlFor="optInRewards" className="text-sm leading-none">
              I would like to earn BVR STR CO rewards.
            </label>
          </div>

          <Button
            disabled={pending}
            type="submit"
            className="w-full"
            id="signup-button"
            data-umami-event="Signup button"
          >
            {pending ? "Signing up..." : "Sign Up"}
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-2">
        {message?.error && (
          <div className="mb-4 p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 max-w-sm rounded-md">
            {message.error}
          </div>
        )}
        <div className="text-left text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
