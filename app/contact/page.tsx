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
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowUpRightIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description: "Get in touch with BVR ST STUDIO.",
  canonical: "https://bvrst.studio/contact",
  image: {
    url: "https://bvrst.studio/opengraph/index.png",
    alt: "BVR ST STUDIO Contact",
  },
});

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-md border shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we&apos;ll get back to you as soon as
            possible. Please include your name, phone number, email address, and
            a brief description of your inquiry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="mailto:info@bvrststudio.com"
            target="_blank"
            className="group"
          >
            <Button
              variant="default"
              className="transition-transform group-hover:translate-x-0.5  group-hover:translate-y-[-0.125rem]"
            >
              Reach Out
              <ArrowUpRight
                className="-me-1 ms-2 opacity-60 group-hover:opacity-100  transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem]"
                size={12}
                aria-hidden="true"
              />
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
