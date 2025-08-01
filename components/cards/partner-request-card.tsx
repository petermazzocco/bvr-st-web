import Form from "next/form";
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

export function PartnerRequestCard() {
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
        <Form action={newVendorRequest} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="storeName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Store Name
            </label>
            <p className="text-xs text-muted-foreground">
              The first part of your shopify url. For example, if your
              shopify url is https://mystore.myshopify.com, then the store
              name is &apos;mystore&apos;.
            </p>
            <Input
              type="text"
              name="storeName"
              placeholder="mystore"
              required
            />
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
            />
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
              className="text-xs text-blue-500 underline"
              target="_blank"
            >
              Learn how to generate a storefront access token.
            </Link>
            <Input
              type="password"
              name="storefrontAccessToken"
              placeholder="shpat_123456790"
              required
            />
          </div>

          <p className="text-xs text-muted-foreground">
            For images, please provide a valid URL. If you have not uploaded
            an image yet, you can use a CDN like Cloudflare Images or Imgur to
            host your images. Banner images will be in a 12 / 3 aspect ratio.
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
              />
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
              />
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
              If provided, we will use this link for your partner store
              for customers to explore more products and services.
            </p>
            <Input
              type="url"
              name="shopLink"
              placeholder="https://your-store.com"
            />
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
              className="text-xs text-blue-500 underline"
              target="_blank"
            >
              Learn how to generate a webhook secret.
            </Link>
            <Input
              type="password"
              name="webhookSecret"
              placeholder="Your webhook secret"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Store Description
            </label>
            <p className="text-xs text-muted-foreground">
              Max 255 characters.
            </p>
            <Textarea
              name="description"
              maxLength={255}
              placeholder="Tell us about your store. The customers will learn more about your store and what you offer."
              rows={5}
              className="resize-y min-h-[120px]"
              required
            />
          </div>

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
          >
            Send Partner Request
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground">
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
