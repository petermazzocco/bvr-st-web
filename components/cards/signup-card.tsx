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
import { PhoneInput } from "../utils/phone-input";
import { signUp } from "@/server/user/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { UserSignUp } from "@/lib/types";

export function SignUpCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const { mutate: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: UserSignUp) => {
      const response = await signUp(data);
      return response;
    },
    onSuccess: (response) => {
      if (response.token) {
        setAuthToken(response.token);
      }
      router.push("/account");
      toast.success("Account created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred, please try again!");
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData: UserSignUp = {
      name,
      email,
      phone,
      address: {
        street: address,
        city,
        state,
        apt,
        zip: zipCode,
      },
      password,
    };

    // Choose signup method based on whether email or phone is primary
    signUpMutation(userData, {
      onSuccess: (response) => {
        if (response.token) {
          setAuthToken(response.token);
        }
      },
    });
  };

  return (
    <Card className="mx-auto min-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create your free BVR STR Collective account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {/* Name Fields */}
            <div className="grid gap-2 ">
              <Label htmlFor="firstName">Full Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John Smith"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone Field */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput value={phone} setValue={(value) => setPhone(value)} />
            </div>

            {/* Address Fields */}
            <div className="grid gap-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Apt Fields */}
            <div className="grid gap-2">
              <Label htmlFor="apt">Apt/Unit/Building (optional)</Label>
              <Input
                id="address"
                type="text"
                placeholder="#130"
                required
                value={apt}
                onChange={(e) => setApt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="NY"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="10001"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>

            {/* Password Fields */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSigningUp}>
              Sign Up
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
