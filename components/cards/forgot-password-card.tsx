"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { forgotUserPassword } from "@/server/user/actions";

export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");

  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const response = await forgotUserPassword(email);
      return response;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    forgotPasswordMutation(email, {
      onSuccess: (response) => {
        toast.success(
          response.message || "Password reset email sent successfully",
        );
        setEmail("");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send password reset email");
        console.error("Error sending password reset email:", error);
      },
    });
  };

  return (
    <Card className="mx-auto min-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
