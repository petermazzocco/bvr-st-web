"use client";
import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSubmission } from "@/server/user/actions";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

// Zod validation schema
const applyForScoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(500, "Message must be at most 500 characters long"),
});

type ApplyForScoutFormData = z.infer<typeof applyForScoutSchema>;

export const ApplyForScoutForm = () => {
  const [message, formAction, pending] = useActionState(
    contactSubmission,
    null,
  );
  const [formData, setFormData] = useState<Partial<ApplyForScoutFormData>>({
    name: "",
    email: "",
    subject: "student",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplyForScoutFormData, string>>
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
    if (errors[name as keyof ApplyForScoutFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      applyForScoutSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof ApplyForScoutFormData, string>
        > = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof ApplyForScoutFormData;
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
    const result = applyForScoutSchema.safeParse(formData);
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
      <div className="space-y-3">
        <Label
          htmlFor="subject"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Which best describes you? (Select one)
        </Label>
        <input type="hidden" name="subject" value={formData.subject ?? ""} />
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <Label
            htmlFor="student"
            className="inline-flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              id="student"
              checked={formData.subject === "student"}
              onCheckedChange={() =>
                setFormData((prev) => ({ ...prev, subject: "student" }))
              }
            />
            <span>Student</span>
          </Label>
          <Label
            htmlFor="student-athlete"
            className="inline-flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              id="student-athlete"
              checked={formData.subject === "student-athlete"}
              onCheckedChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  subject: "student-athlete",
                }))
              }
            />
            <span>Student-Athlete</span>
          </Label>
          <Label
            htmlFor="alumni"
            className="inline-flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              id="alumni"
              checked={formData.subject === "alumni"}
              onCheckedChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  subject: "alumni",
                }))
              }
            />
            <span>Alumni</span>
          </Label>
        </div>
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject}</p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          What makes you a good fit for the Scout Program? (Minimum 10
          characters)
        </label>
        <Textarea
          name="message"
          placeholder="Tell us more..."
          rows={5}
          className={`resize-y min-h-[120px] ${errors.message ? "border-destructive" : ""}`}
          required
          minLength={10}
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
        {pending ? "Sending..." : "Apply Now"}
      </Button>
      <p className="text-[9px] text-muted-forground">
        By applying, you agree to our Terms and Conditions and Privacy Policy.
        We will review your application and get back to you as soon as possible.
      </p>
    </Form>
  );
};
