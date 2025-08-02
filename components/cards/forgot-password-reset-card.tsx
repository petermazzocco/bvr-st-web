"use client";
import { useActionState, useState } from "react";
import Form from "next/form";
import Link from "next/link";
import { z } from "zod";
import { confirmForgotPassword } from "@/server/user/actions";
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
import { ErrorMessage } from "../utils/error-message";

// Zod validation schema
const forgotPasswordResetSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});

type ForgotPasswordResetFormData = z.infer<typeof forgotPasswordResetSchema>;

interface ForgotPasswordResetCardProps {
  email: string;
  code: string;
}

export function ForgotPasswordResetCard({
  email,
  code,
}: ForgotPasswordResetCardProps) {
  const [message, formAction, pending] = useActionState(
    confirmForgotPassword,
    null,
  );
  const [formData, setFormData] = useState<
    Partial<ForgotPasswordResetFormData>
  >({
    newPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordResetFormData, string>>
  >({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ForgotPasswordResetFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      forgotPasswordResetSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof ForgotPasswordResetFormData, string>
        > = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue
              .path[0] as keyof ForgotPasswordResetFormData;
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
    const result = forgotPasswordResetSchema.safeParse(formData);
    return result.success;
  };

  // Get password validation status for visual feedback
  const getPasswordValidation = (password: string) => {
    return {
      isLongEnough: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    };
  };

  const passwordValidation = getPasswordValidation(formData.newPassword || "");

  return (
    <Card className="mx-auto min-w-lg max-w-lg shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Set New Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="code" value={code} />
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New Password
            </label>
            <Input
              type="password"
              name="newPassword"
              required
              value={formData.newPassword || ""}
              onChange={handleInputChange}
              className={errors.newPassword ? "border-destructive" : ""}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword}</p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li
                className={
                  passwordValidation.isLongEnough ? "text-green-600" : ""
                }
              >
                At least 8 characters long
              </li>
              <li
                className={
                  passwordValidation.hasUpperCase &&
                  passwordValidation.hasLowerCase
                    ? "text-green-600"
                    : ""
                }
              >
                Contains uppercase and lowercase letters
              </li>
              <li
                className={passwordValidation.hasNumber ? "text-green-600" : ""}
              >
                Contains at least one number
              </li>
            </ul>
          </div>
          <Button
            disabled={pending || !isFormValid()}
            type="submit"
            className="w-full"
            id="reset-forgotten-password-button"
            data-umami-event="Reset forgotten password button"
          >
            {pending ? "Resetting password..." : "Reset Password"}
          </Button>
          <Button type="button" variant="outline" className="w-full" asChild>
            <Link
              href={`/forgot-password/verify?email=${encodeURIComponent(email)}`}
            >
              Back to Verification
            </Link>
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-2">
        {message?.error && <ErrorMessage message={message.error} />}
      </CardFooter>
    </Card>
  );
}
