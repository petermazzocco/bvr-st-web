"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { newVendorRequest } from "@/server/vendor/actions";
import { useApiMutation } from "@/hooks/use-api-mutation";
import Link from "next/link";

const partnerRequestSchema = z.object({
  storeName: z.string().min(1, "Shopify store name is required"),
  storefrontAccessToken: z
    .string()
    .min(1, "Storefront access token is required"),
  name: z.string().min(1, "Display Name is required"),
  logo: z.string().min(1, "Logo URL is required"),
  banner: z.string().min(1, "Banner URL is required"),
  description: z.string().min(1, "Description is required"),
  shopLink: z.string().optional(),
  webhookSecret: z.string().min(1, "Webhook secret is required"),
});

type PartnerRequestFormValues = z.infer<typeof partnerRequestSchema>;

export function PartnerRequestCard() {
  const form = useForm<PartnerRequestFormValues>({
    resolver: zodResolver(partnerRequestSchema),
    defaultValues: {
      storeName: "",
      storefrontAccessToken: "",
      name: "",
      logo: "",
      banner: "",
      description: "",
      shopLink: "",
      webhookSecret: "",
    },
  });

  const { mutate: partnerRequestMutation, isPending } = useApiMutation(
    (data: PartnerRequestFormValues) =>
      newVendorRequest(
        data.storeName,
        data.storefrontAccessToken,
        data.name,
        data.logo,
        data.banner,
        data.description,
        data.shopLink,
        data.webhookSecret,
      ),
    {
      onSuccess: () => {
        toast.success("Partner request sent successfully!");
        form.reset();
      },
      onError: (error) => {
        toast.error("Failed to send partner request. Please try again.");
        console.error("Error submitting partner request:", error);
      },
    },
  );

  const onSubmit = (data: PartnerRequestFormValues) => {
    partnerRequestMutation(data);
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    The first part of your shopify url. For example, if your
                    shopify url is https://mystore.myshopify.com, then the store
                    name is &apos;mystore&apos;.
                  </p>
                  <FormControl>
                    <Input type="text" placeholder="mystore" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    This is the name that will be displayed on your store&apos;s
                    storefront.
                  </p>
                  <FormControl>
                    <Input type="text" placeholder="My Store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storefrontAccessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storefront Access Token</FormLabel>
                  <Link
                    href={
                      "https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started"
                    }
                    className="text-xs text-blue-500 underline"
                    target="_blank"
                  >
                    Learn how to generate a storefront access token.
                  </Link>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="shpat_123456790"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-muted-foreground">
              For images, please provide a valid URL. If you have not uploaded
              an image yet, you can use a CDN like Cloudflare Images or Imgur to
              host your images. Banner images will be in a 12 / 3 aspect ratio.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/banner.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shopLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Link (Optional)</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    If provided, we will use this link for your partner store
                    for customers to explore more products and services.
                  </p>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://your-store.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webhookSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook Secret</FormLabel>
                  <Link
                    href={
                      "https://help.shopify.com/en/manual/fulfillment/setup/notifications/webhooks"
                    }
                    className="text-xs text-blue-500 underline"
                    target="_blank"
                  >
                    Learn how to generate a webhook secret.
                  </Link>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your webhook secret"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Description</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Max 255 characters.
                  </p>
                  <FormControl>
                    <Textarea
                      maxLength={255}
                      placeholder="Tell us about your store. The customers will learn more about your store and what you offer."
                      rows={5}
                      className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none resize-y min-h-[120px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-muted-foreground">
              By submitting this form, you agree to our{" "}
              <Link href="/terms">Terms of Service</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>, and you have
              accurately provided 100% of the required information.
            </p>
            <Button
              type="submit"
              className="w-full"
              id="partner-request-submission-button"
              data-umami-event="Partner request submission button"
              disabled={isPending}
            >
              {isPending ? "Sending Request..." : "Send Partner Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground ">
        Need help with your application?{" "}
        <a
          href="mailto:partners@bvrstrco.com"
          className="text-primary underline hover:text-primary/80 ml-1"
        >
          info@bvrstrco.com
        </a>
      </CardFooter>
    </Card>
  );
}
