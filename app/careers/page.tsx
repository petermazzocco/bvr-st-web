import { getCareers } from "@/server/sanity/actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PortableText } from "next-sanity";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApplyNowForm } from "@/components/forms/apply-now-form";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const careers = await getCareers();

  if (!careers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No careers available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="py-16">
        <div className="bg-background gap-4 rounded-lg max-w-4xl mx-auto p-4 text-left border shadow-sm">
          <h2 className="text-lg text-left font-bold text-foreground  mb-4">
            Careers
          </h2>
          <p className="text-sm text-foreground/70 mb-6">
            Join our team and help us make a difference! We are always looking
            for talented and passionate individuals to join us in our mission to
            provide the best products and services to our customers. Check out
            our current openings below and apply today!
          </p>
          <Accordion type="single" collapsible className="w-full bg-background">
            {careers &&
              careers?.data?.map((career, i) => (
                <AccordionItem
                  key={i}
                  value={career.title}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="py-6 text-left hover:underline [&[data-state=open]>svg]:rotate-90 [&[data-state=open]>span]:text-primary">
                    <span className="text-lg font-medium text-gray-900 tracking-wide">
                      {career.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className=" pb-6">
                    <div className="pt-4 space-y-4  px-6 ">
                      {Array.isArray(career?.description) && (
                        <PortableText
                          value={career.description}
                          components={{
                            block: {
                              h1: ({ children }) => (
                                <h1 className="text-3xl font-bold mb-4 mt-8">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-2xl font-bold mb-3 mt-6">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-xl font-bold mb-1 mt-1">
                                  {children}
                                </h3>
                              ),
                              h4: ({ children }) => (
                                <h4 className="text-lg font-bold mb-1 mt-1">
                                  {children}
                                </h4>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 text-sm border-border/10 pl-4 italic mb-4">
                                  {children}
                                </blockquote>
                              ),
                              normal: ({ children }) => (
                                <p className="mb-1 leading-7 text-sm">
                                  {children}
                                </p>
                              ),
                            },
                            marks: {
                              link: ({ value, children }) => (
                                <a
                                  className="text-primary hover:underline"
                                  href={value.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                </a>
                              ),
                            },
                          }}
                        />
                      )}
                      <Separator className="my-4" />
                      <h3 className="text-lg font-semibold text-foreground">
                        Interested in joining us?
                      </h3>
                      <p className="text-sm text-foreground/70">
                        Fill out the form below to begin your application for
                        the position of{" "}
                        <span className="font-medium">{career.title}</span>.
                      </p>
                      <div className="pt-2 max-w-md flex flex-col justify-center items-center w-full">
                        <ApplyNowForm jobTitle={career.title} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
