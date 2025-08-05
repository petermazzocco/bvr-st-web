"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

const SIGNUP_MODAL_SEEN_COOKIE = "signup-modal-seen";

const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { AspectRatio } from "../ui/aspect-ratio";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleClose = () => {
    setCookie(SIGNUP_MODAL_SEEN_COOKIE, "true");
    onOpenChange(false);
  };

  const onSubmit = (data: SignupFormValues) => {
    const searchParams = new URLSearchParams({
      name: data.name,
      email: data.email,
    });

    setCookie(SIGNUP_MODAL_SEEN_COOKIE, "true");
    router.push(`/signup?${searchParams.toString()}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-sm bg-background/95">
        <DialogHeader>
          <DialogTitle>Join BVR ST CO For Free | Earn 100 Points</DialogTitle>
          <DialogDescription>
            Gain early access, earn points, and unlock rewards!
          </DialogDescription>
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
            <Image
              src="/auth.jpg"
              alt="auth"
              fill
              className="h-full w-full rounded"
            />
          </AspectRatio>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Continue to Sign Up
            </Button>
            <Button
              type="button"
              className="w-full"
              variant={"secondary"}
              onClick={handleClose}
            >
              No Thanks
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
