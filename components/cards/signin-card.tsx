"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneInput } from "../utils/phone-input";
import {
  useAuthenticationServicePostApiV1AuthSigninEmail,
  useAuthenticationServicePostApiV1AuthSigninPhone,
} from "@/lib/queries";

export function SignInCard() {
  const [authMethod, setAuthMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signInEmailMutation, isPending: isSigningInWithEmail } =
    useAuthenticationServicePostApiV1AuthSigninEmail();

  const { mutate: signInPhoneMutation, isPending: isSigningInWithPhone } =
    useAuthenticationServicePostApiV1AuthSigninPhone();

  // Handle email/phone form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authMethod === "email") {
      signInEmailMutation({ requestBody: { email, password } });
    } else if (authMethod === "phone") {
      signInPhoneMutation({ requestBody: { phone, password } });
    }
  };

  return (
    <Card className="mx-auto min-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign into your BVR STR Collective account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Email/Phone Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <Tabs
              value={authMethod}
              onValueChange={setAuthMethod}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="phone" className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  value={phone}
                  setValue={(value) => setPhone(value)}
                />
              </TabsContent>
            </Tabs>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSigningInWithEmail || isSigningInWithPhone}
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          {"Don't have an account? "}
          <Link href="/sign-up" className="underline">
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
      </CardContent>
    </Card>
  );
}
