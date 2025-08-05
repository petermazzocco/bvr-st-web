"use client";
import { useState } from "react";
import Form from "next/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { newVendorRequest } from "@/server/vendor/actions";
import Link from "next/link";

// Zod validation schema
const partnerRequestSchema = z.object({
  storeName: z
    .string()
    .min(1, "Store name is required")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Store name must only contain letters, numbers, and hyphens",
    )
    .max(50, "Store name must be 50 characters or less"),
  name: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be 100 characters or less"),
  storefrontAccessToken: z
    .string()
    .min(1, "Storefront access token is required")
    .regex(/^shpat_[a-zA-Z0-9]+$/, "Invalid storefront access token format"),
  logo: z.url("Please enter a valid logo URL"),
  banner: z.url("Please enter a valid banner URL"),
  shopLink: z.url("Please enter a valid shop URL").optional().or(z.literal("")),
  webhookSecret: z.string().min(1, "Webhook secret is required"),
  description: z
    .string()
    .min(1, "Store description is required")
    .max(255, "Description must be 255 characters or less"),
});

type PartnerRequestFormData = z.infer<typeof partnerRequestSchema>;

export function PartnerRequestCard() {
  const [formData, setFormData] = useState<Partial<PartnerRequestFormData>>({
    storeName: "",
    name: "",
    storefrontAccessToken: "",
    logo: "",
    banner: "",
    shopLink: "",
    webhookSecret: "",
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PartnerRequestFormData, string>>
  >({});
  const [pending, setPending] = useState(false);

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
    if (errors[name as keyof PartnerRequestFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      partnerRequestSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof PartnerRequestFormData, string>
        > = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof PartnerRequestFormData;
            fieldErrors[fieldName] = issue.message;
          }
        });
        return fieldErrors;
      }
      return {};
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      setErrors(validationErrors);
      return;
    }

    // If validation passes, allow form to submit normally
    setErrors({});
    setPending(true);

    // Create FormData and submit
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);

    try {
      await newVendorRequest(formDataObj);
    } finally {
      setPending(false);
    }
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    const result = partnerRequestSchema.safeParse(formData);
    return result.success;
  };

  // Get character count for description
  const descriptionLength = formData.description?.length || 0;

  return (
    <Card className="mx-auto max-w-2xl border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Partner Store Request</CardTitle>
        <CardDescription>
          We appreciate your interest in becoming a Partnered Store! In order to
          become a Partnered Store, we require access to the necessary
          information below to process your request. Once submitted, we will
          review your request and get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          action={newVendorRequest}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="storeName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Store Name
            </label>
            <p className="text-xs text-muted-foreground">
              The first part of your shopify url. For example, if your shopify
              url is https://mystore.myshopify.com, then the store name is
              &apos;mystore&apos;.
            </p>
            <Input
              type="text"
              name="storeName"
              placeholder="mystore"
              required
              value={formData.storeName || ""}
              onChange={handleInputChange}
              className={errors.storeName ? "border-destructive" : ""}
            />
            {errors.storeName && (
              <p className="text-xs text-destructive">{errors.storeName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Display Name
            </label>
            <p className="text-xs text-muted-foreground">
              This is the name that will be displayed on your store&apos;s
              storefront.
            </p>
            <Input
              type="text"
              name="name"
              placeholder="My Store"
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
              htmlFor="storefrontAccessToken"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Storefront Access Token
            </label>
            <Link
              href="https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started"
              className="text-xs text-blue-500 underline ml-2"
              target="_blank"
            >
              Learn how to generate a storefront access token.
            </Link>
            <Input
              type="password"
              name="storefrontAccessToken"
              placeholder="shpat_123456790"
              required
              value={formData.storefrontAccessToken || ""}
              onChange={handleInputChange}
              className={
                errors.storefrontAccessToken ? "border-destructive" : ""
              }
            />
            {errors.storefrontAccessToken && (
              <p className="text-xs text-destructive">
                {errors.storefrontAccessToken}
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            For images, please provide a valid URL. If you have not uploaded an
            image yet, you can use a CDN like Cloudflare Images or Imgur to host
            your images. Banner images will be in a 12 / 3 aspect ratio.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="logo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Logo URL
              </label>
              <Input
                type="url"
                name="logo"
                placeholder="https://example.com/logo.png"
                required
                value={formData.logo || ""}
                onChange={handleInputChange}
                className={errors.logo ? "border-destructive" : ""}
              />
              {errors.logo && (
                <p className="text-xs text-destructive">{errors.logo}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="banner"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Banner URL
              </label>
              <Input
                type="url"
                name="banner"
                placeholder="https://example.com/banner.png"
                required
                value={formData.banner || ""}
                onChange={handleInputChange}
                className={errors.banner ? "border-destructive" : ""}
              />
              {errors.banner && (
                <p className="text-xs text-destructive">{errors.banner}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="shopLink"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Shop Link (Optional)
            </label>
            <p className="text-xs text-muted-foreground">
              If provided, we will use this link for your partner store for
              customers to explore more products and services.
            </p>
            <Input
              type="url"
              name="shopLink"
              placeholder="https://your-store.com"
              value={formData.shopLink || ""}
              onChange={handleInputChange}
              className={errors.shopLink ? "border-destructive" : ""}
            />
            {errors.shopLink && (
              <p className="text-xs text-destructive">{errors.shopLink}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="webhookSecret"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Webhook Secret
            </label>
            <Link
              href="https://help.shopify.com/en/manual/fulfillment/setup/notifications/webhooks"
              className="text-xs text-blue-500 underline ml-2"
              target="_blank"
            >
              Learn how to generate a webhook secret.
            </Link>
            <Input
              type="password"
              name="webhookSecret"
              placeholder="Your webhook secret"
              required
              value={formData.webhookSecret || ""}
              onChange={handleInputChange}
              className={errors.webhookSecret ? "border-destructive" : ""}
            />
            {errors.webhookSecret && (
              <p className="text-xs text-destructive">{errors.webhookSecret}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Store Description
            </label>
            <p className="text-xs text-muted-foreground">
              Max 255 characters. ({descriptionLength}/255)
            </p>
            <Textarea
              name="description"
              maxLength={255}
              placeholder="Tell us about your store. The customers will learn more about your store and what you offer."
              rows={5}
              className={`resize-y min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
              required
              value={formData.description || ""}
              onChange={handleInputChange}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            By submitting this form, you agree to our{" "}
            <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>, and you have accurately
            provided 100% of the required information.
          </p>

          <Button
            disabled={pending || !isFormValid()}
            type="submit"
            className="w-full"
            id="partner-request-submission-button"
            data-umami-event="Partner request submission button"
          >
            {pending ? "Sending..." : "Send Partner Request"}
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground">
        Need help with your application?{" "}
        <a
          href="mailto:partners@bvrstco.com"
          className="text-primary underline hover:text-primary/80 ml-1"
        >
          info@bvrstco.com
        </a>
      </CardFooter>
    </Card>
  );
}
