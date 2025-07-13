"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { toast } from "sonner";
import { setAuthToken } from "@/lib/utils";
import { signInWithEmail, signInWithPhone } from "@/server/user/actions";
import { useMutation } from "@tanstack/react-query";

export function SignInCard() {
  const [authMethod, setAuthMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { mutate: signInEmailMutation, isPending: isSigningInWithEmail } =
    useMutation({
      mutationFn: async (data: {
        email: string;
        password: string;
        callbackUrl: string;
      }) => {
        const response = await signInWithEmail(
          data.email,
          data.password,
          data.callbackUrl,
        );
        return response;
      },
    });

  const { mutate: signInPhoneMutation, isPending: isSigningInWithPhone } =
    useMutation({
      mutationFn: async (data: {
        phone: string;
        password: string;
        callbackUrl: string;
      }) => {
        const response = await signInWithPhone(
          data.phone,
          data.password,
          data.callbackUrl,
        );
        return response;
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authMethod === "email") {
      signInEmailMutation(
        {
          email,
          password,
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
        },
        {
          onSuccess: (response) => {
            if (response.token) {
              setAuthToken(response.token);
            }
            if (response.callbackUrl) {
              router.push(response.callbackUrl);
            }
          },
          onError: (error) => {
            toast.error(error.message);
            console.error("Error signing in with email:", error);
          },
        },
      );
    } else if (authMethod === "phone") {
      signInPhoneMutation(
        {
          phone,
          password,
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
        },
        {
          onSuccess: (response) => {
            if (response.token) {
              setAuthToken(response.token);
            }
            if (response.callbackUrl) {
              router.push(response.callbackUrl);
            }
          },
          onError: (error) => {
            toast.error("Error signing in with phone");
            console.error("Error signing in with phone:", error);
          },
        },
      );
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
              {isSigningInWithEmail || isSigningInWithPhone
                ? "Signing In..."
                : "Sign In"}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          {"Don't have an account? "}
          <Link href="/account/signup" className="underline">
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
