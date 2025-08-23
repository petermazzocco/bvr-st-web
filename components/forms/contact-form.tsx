"use client";
import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSubmission } from "@/server/user/actions";
import { toast } from "sonner";

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(500, "Message must be at most 500 characters long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [message, formAction, pending] = useActionState(
    contactSubmission,
    null,
  );
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      contactSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof ContactFormData;
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
    const result = contactSchema.safeParse(formData);
    return result.success;
  };
  return (
    <Form action={formAction} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Name
          </label>
          <Input
            type="text"
            name="name"
            placeholder="Your name"
            required
            value={formData.name || ""}
            onChange={handleInputChange}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <Input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            value={formData.email || ""}
            onChange={handleInputChange}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Subject
        </label>
        <Input
          type="text"
          name="subject"
          placeholder="What's this about?"
          required
          value={formData.subject || ""}
          onChange={handleInputChange}
          className={errors.subject ? "border-destructive" : ""}
        />
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject}</p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Message
        </label>
        <Textarea
          name="message"
          placeholder="Tell us more..."
          rows={5}
          className={`resize-y min-h-[120px] ${errors.message ? "border-destructive" : ""}`}
          required
          value={formData.message || ""}
          onChange={handleInputChange}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>
      <Button
        disabled={pending || !isFormValid()}
        type="submit"
        className="w-full"
        id="contact-submission-button"
        data-umami-event="Contact submission button"
      >
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </Form>
  );
};
