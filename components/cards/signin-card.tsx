"use client";
import { useActionState, useState } from "react";
import Form from "next/form";
import Link from "next/link";
import { z } from "zod";
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
import { ErrorMessage } from "@/components/utils/error-message";
import { SignInOAuthButton } from "../utils/signup-oauth-button";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

// Zod validation schema
const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInCard() {
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const [message, formAction, pending] = useActionState(signInWithEmail, null);
  const [formData, setFormData] = useState<Partial<SignInFormData>>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof SignInFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      signInSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignInFormData, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof SignInFormData;
            fieldErrors[fieldName] = issue.message;
          }
        });
        return fieldErrors;
      }
      return {};
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      setErrors(validationErrors);
      return;
    }

    // If validation passes, allow form to submit normally
    setErrors({});
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    const result = signInSchema.safeParse(formData);
    return result.success;
  };

  return (
    <Card className="mx-auto max-w-lg min-w-lg shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription className="text-sm">
          {redirect == "/membership"
            ? "Sign into your BVR ST CO account to become a member."
            : "Sign into your BVR ST CO account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col-reverse gap-2">
        <div className="flex flex-row justify-evenly items-center gap-2">
          <SignInOAuthButton provider="google" className="w-full h-10">
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-sm pr-2">Google</p>
              <Image
                src="/google.svg"
                alt="Google Logo"
                width={24}
                height={24}
              />
            </div>
          </SignInOAuthButton>
          <SignInOAuthButton provider="facebook" className="w-full h-10">
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-sm pr-2">Facebook</p>
              <Image
                src="/facebook.svg"
                alt="Facebook Logo"
                width={24}
                height={24}
              />
            </div>
          </SignInOAuthButton>
          <SignInOAuthButton provider="discord" className="w-full h-10">
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-sm pr-2">Discord</p>
              <Image
                src="/discord.svg"
                alt="Discord Logo"
                width={24}
                height={24}
              />
            </div>
          </SignInOAuthButton>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Separator className="my-4 flex-1" />
          <span className="mx-2 text-xs font-muted">OR CONTINUE WITH</span>
          <Separator className="my-4 flex-1" />
        </div>
        <Form action={formAction} onSubmit={handleSubmit} className="space-y-4">
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
              value={formData.email || ""}
              onChange={handleInputChange}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <Input
              type="password"
              name="password"
              required
              value={formData.password || ""}
              onChange={handleInputChange}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>
          <Button
            disabled={pending || !isFormValid()}
            type="submit"
            className="w-full group"
            id="signin-button"
            data-umami-event="Signin button"
          >
            {pending ? "Signing in..." : "Sign In"}
            <ArrowRightIcon
              className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-2">
        {message?.error && <ErrorMessage message={message.error} />}
        <div className="text-center text-sm">
          {"Don't have an account? "}
          <Link href="/signup?redirect=/membership" className="underline">
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
