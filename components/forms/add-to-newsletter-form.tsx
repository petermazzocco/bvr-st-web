"use client";
import { addToNewsletter } from "@/server/user/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { z } from "zod";
import { ArrowUpRightIcon } from "lucide-react";
import { toast } from "sonner";

const addToNewsLetterSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.email().min(5).max(100),
});

type FormData = z.infer<typeof addToNewsLetterSchema>;

export const AddToNewsletterForm = () => {
  const [message, formAction, pending] = useActionState(addToNewsletter, null);
  const [formData, setFormData] = useState<Partial<FormData>>({
    fullName: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  // Handle server action messages with toast
  useEffect(() => {
    if (message) {
      try {
        const response = JSON.parse(message);
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch {
        // Fallback for non-JSON messages
        if (message.includes("Successfully")) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      }
    }
  }, [message]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      addToNewsLetterSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof FormData;
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
    const result = addToNewsLetterSchema.safeParse(formData);
    return result.success;
  };

  return (
    <Form action={formAction} onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="text"
        name="fullName"
        className="text-foreground"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleInputChange}
        required
      />
      {errors.fullName && (
        <p className="text-xs text-destructive">{errors.fullName}</p>
      )}
      <Input
        type="email"
        name="email"
        className="text-foreground"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      {errors.email && (
        <p className="text-xs text-destructive">{errors.email}</p>
      )}
      <Button
        type="submit"
        className="w-full group"
        disabled={pending || !isFormValid()}
        id="user-added-to-newsletter"
        data-umami-event="User added to newsletter"
      >
        <span className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem] group-hover:animate-pulse">
          GET NOTIFIED
        </span>
        <ArrowUpRightIcon
          className="-me-1 ms-2 opacity-60 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem] group-hover:animate-pulse"
          size={16}
          aria-hidden="true"
        />
      </Button>
      <p className="text-muted-foreground/50 text-[8px]">
        By submitting, you agree to our{" "}
        <Link href="/legal/terms" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline">
          Privacy Policy
        </Link>
        . You also agree to opting-in to receive marketing emails from us about
        our latest updates, products and services, and can unsubscribe at any
        time.
      </p>
    </Form>
  );
};
