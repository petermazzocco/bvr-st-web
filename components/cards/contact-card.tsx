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
import { contactSubmission } from "@/server/user/actions";

export function ContactCard() {
  return (
    <Card className="mx-auto max-w-2xl border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Contact Us</CardTitle>
        <CardDescription>
          Send us a message and we&apos;ll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={contactSubmission} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name
              </label>
              <Input type="text" name="name" placeholder="Your name" required />
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
              />
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
            />
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
              className="resize-y min-h-[120px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            id="contact-submission-button"
            data-umami-event="Contact submission button"
          >
            Send Message
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground">
        Or email us directly at{" "}
        <a
          href="mailto:info@bvrstrco.com"
          className="text-primary underline hover:text-primary/80 ml-1"
        >
          info@bvrstrco.com
        </a>
      </CardFooter>
    </Card>
  );
}
