import type { Metadata } from "next";
import { ContactCard } from "@/components/cards/contact-card";
import { PartnerRequestCard } from "@/components/cards/partner-request-card";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with BVR STR CO. Send us a message or apply to become a partner store. We're here to help with any questions.",
  canonical: "https://bvrstco.com/contact",
});

interface ContactPageProps {
  searchParams: Promise<{ success?: string; partner?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const showSuccess = params.success === "true";
  const showPartnerSuccess = params.partner === "true";

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md max-w-lg w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Message sent successfully! We&apos;ll get back to you as soon as
                possible.
              </p>
            </div>
          </div>
        </div>
      )}

      {showPartnerSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md max-w-lg w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Partner request submitted successfully! We&apos;ll review your
                application and get back to you soon.
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="contact">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="partner">Partner Store Request</TabsTrigger>
        </TabsList>
        <TabsContent value="contact">
          <ContactCard />
        </TabsContent>
        <TabsContent value="partner">
          <PartnerRequestCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
