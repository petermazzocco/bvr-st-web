import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";
import { generateMetadata as createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with BVR ST CO. Send us a message or apply to become a partner store. We're here to help with any questions.",
  canonical: "https://bvrstco.com/contact",
});

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-2xl border-none rouded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we&apos;ll get back to you as soon as
            possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          Or email us directly at{" "}
          <a
            href="mailto:info@bvrstco.com"
            className="text-primary underline hover:text-primary/80 ml-1"
          >
            info@bvrstco.com
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
