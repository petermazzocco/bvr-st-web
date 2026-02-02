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
  email: z.string().email().min(5).max(100),
});

type FormData = z.infer<typeof addToNewsLetterSchema>;

interface ApplyNowFormProps {
  jobTitle: string;
}

// Loading states array
const LOADING_STATES = [
  "INSERTING RECORD...",
  "COMMITTING TO DB...",
  "WRITING TO DATABASE...",
  "EXECUTING INSERT...",
  "PERSISTING DATA...",
  "DEPLOYING SUBSCRIBER...",
  "PUSHING TO PRODUCTION...",
  "COMPILING SUBSCRIBER...",
  "SYNCING WITH SERVER...",
  "INITIALIZING USER...",
  "BOOTSTRAPPING ACCOUNT...",
  "PROCESSING SIGNUP...",
  "REGISTERING USER...",
  "ONBOARDING...",
  "ACTIVATING SUBSCRIPTION...",
];

export const ApplyNowForm = ({ jobTitle }: ApplyNowFormProps) => {
  const [message, formAction, pending] = useActionState(addToNewsletter, null);
  const [formData, setFormData] = useState<Partial<FormData>>({
    fullName: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [currentLoadingText, setCurrentLoadingText] = useState("");

  // Initialize and rotate loading text
  useEffect(() => {
    if (pending) {
      // Set initial random loading state
      const randomIndex = Math.floor(Math.random() * LOADING_STATES.length);
      setCurrentLoadingText(LOADING_STATES[randomIndex]);

      // Rotate through loading states every 2 seconds
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * LOADING_STATES.length);
        setCurrentLoadingText(LOADING_STATES[randomIndex]);
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setCurrentLoadingText("");
    }
  }, [pending]);

  // Create email link with subject and body
  const createEmailLink = () => {
    const to = "info@bvrstco.com";
    const subject = encodeURIComponent(
      `Application for ${jobTitle} - ${formData.fullName}`,
    );
    const body = encodeURIComponent(`Hi there,

I'm interested in applying for the ${jobTitle} position. Please find my resume and cover letter attached, along with any relevant details below:

[Add resume and cover letter, plus any relevant details here!]

Thank you for your consideration.

Best regards,
${formData.fullName}`);

    return `mailto:${to}?subject=${subject}&body=${body}`;
  };

  // Handle server action messages with toast
  useEffect(() => {
    if (message) {
      try {
        const response = JSON.parse(message);
        if (response.success) {
          toast.success("Opening email client for your application...");
          // On success, create and open email link
          setTimeout(() => {
            const emailLink = createEmailLink();
            window.location.href = emailLink;
          }, 1500);
        } else {
          toast.error(response.message);
        }
      } catch {
        // Fallback for non-JSON messages
        if (message.includes("Successfully")) {
          toast.success("Opening email client for your application...");
          // Create and open email link
          setTimeout(() => {
            const emailLink = createEmailLink();
            window.location.href = emailLink;
          }, 1500);
        } else {
          toast.error(message);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        className="w-full group uppercase"
        disabled={pending || !isFormValid()}
        id="user-added-to-newsletter"
        data-umami-event="User added to newsletter"
      >
        <span className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem] group-hover:animate-pulse flex flex-row items-center">
          {pending && (
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {pending ? (
            currentLoadingText
          ) : (
            <span>{`APPLY FOR ${jobTitle} NOW`}</span>
          )}
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
        . You also agree to opting-in to receive emails from us about our latest
        positions, products and services, and can unsubscribe at any time.
      </p>
    </Form>
  );
};
