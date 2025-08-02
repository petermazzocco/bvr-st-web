"use client";
import { useActionState, useState } from "react";
import Form from "next/form";
import Link from "next/link";
import { z } from "zod";
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
import { handleOTPSubmit } from "@/server/user/actions";
import { ErrorMessage } from "../utils/error-message";

// Zod validation schema
const forgotPasswordOTPSchema = z.object({
  code: z
    .string()
    .length(8, "Verification code must be exactly 8 characters")
    .regex(/^[A-Za-z0-9]{8}$/, "Code must contain only letters and numbers"),
});

type ForgotPasswordOTPFormData = z.infer<typeof forgotPasswordOTPSchema>;

interface ForgotPasswordOTPCardProps {
  email: string;
}

export function ForgotPasswordOTPCard({ email }: ForgotPasswordOTPCardProps) {
  const initialState = {
    email: email,
  };
  const [message, formAction, pending] = useActionState(
    (state: any, formData: FormData) => handleOTPSubmit(initialState, formData),
    null,
  );
  const [formData, setFormData] = useState<Partial<ForgotPasswordOTPFormData>>({
    code: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordOTPFormData, string>>
  >({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Limit input to 8 characters and alphanumeric only
    const sanitizedValue = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 8);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ForgotPasswordOTPFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      forgotPasswordOTPSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof ForgotPasswordOTPFormData, string>
        > = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof ForgotPasswordOTPFormData;
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
    const result = forgotPasswordOTPSchema.safeParse(formData);
    return result.success;
  };

  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
        <CardDescription>
          We sent an 8-character code to {email}. Enter it below to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Verification Code
            </label>
            <Input
              type="text"
              name="code"
              placeholder="RGVMdHNP"
              maxLength={8}
              minLength={8}
              pattern="[A-Za-z0-9]{8}"
              className={`text-center text-lg font-semibold tracking-widest ${errors.code ? "border-destructive" : ""}`}
              required
              value={formData.code || ""}
              onChange={handleInputChange}
            />
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Enter the 8-character code sent to your email
            </p>
          </div>
          <Button
            disabled={pending || !isFormValid()}
            type="submit"
            className="w-full"
            id="forgot-password-verify-otp-button"
            data-umami-event="Forgot Password verify OTP"
          >
            {pending ? "Verifying..." : "Verify Code"}
          </Button>
          <Button type="button" variant="outline" className="w-full" asChild>
            <Link href="/forgot-password">Back to Email</Link>
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-2">
        {message?.error && <ErrorMessage message={message.error} />}
      </CardFooter>
    </Card>
  );
}
