"use client";
import { useActionState, useState } from "react";
import Form from "next/form";
import { z } from "zod";
import { handleEmailSubmit } from "@/server/user/actions";
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
const forgotPasswordEmailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ForgotPasswordEmailFormData = z.infer<typeof forgotPasswordEmailSchema>;

export function ForgotPasswordEmailCard() {
  const [message, formAction, pending] = useActionState(
    handleEmailSubmit,
    null,
  );
  const [formData, setFormData] = useState<
    Partial<ForgotPasswordEmailFormData>
  >({
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordEmailFormData, string>>
  >({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ForgotPasswordEmailFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      forgotPasswordEmailSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof ForgotPasswordEmailFormData, string>
        > = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue
              .path[0] as keyof ForgotPasswordEmailFormData;
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
    const result = forgotPasswordEmailSchema.safeParse(formData);
    return result.success;
  };

  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a code to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <Button
            disabled={pending || !isFormValid()}
            type="submit"
            className="w-full"
          >
            {pending ? "Sending..." : "Send Reset Code"}
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-2">
        {message?.error && <ErrorMessage message={message.error} />}
      </CardFooter>
    </Card>
  );
}
