"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CountdownTimer } from "./countdown-timer";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { addToNewsletter } from "@/server/user/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const newsletterSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function ComingSoonPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const { mutate: subscribeToNewsletter, isPending } = useApiMutation(
    (variables: NewsletterFormValues) =>
      addToNewsletter(variables.email, variables.fullName),
    {
      onSuccess: () => {
        setIsSubmitted(true);
        form.reset();
      },
      onError: (error) => {
        console.error("Failed to subscribe to newsletter", error);
        toast.error("Uh oh! Something went wrong, please try again.");
      },
    },
  );

  const onSubmit = (data: NewsletterFormValues) => {
    subscribeToNewsletter(data);
  };

  return (
    <>
      <div className="h-screen bg-[url('https://cloudfront-us-east-1.images.arcpublishing.com/advancelocal/IUVSISAT7FGOLD7NFU6X22GVZQ.jpg')] bg-cover bg-center bg-no-repeat flex items-end justify-center pb-[10vh]">
        <div className="z-10 gap-4 flex flex-col text-center items-center text-background max-w-md mx-auto px-4">
          <h2 className="text-lg font-base tracking-wider">Coming Soon</h2>
          <h1 className="text-3xl font-bold tracking-wider">BVR STR CO</h1>
          <CountdownTimer />

          {isSubmitted ? (
            <div className="bg-background text-foreground rounded-md p-4">
              <p className="font-semibold">Thanks for signing up!</p>
              <p className="text-muted-foreground text-sm">
                We&apos;ll notify you when we launch.
              </p>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild className="  cursor-pointer">
                <Button
                  variant="default"
                  className="w-full hover:bg-opacity-100"
                >
                  Notify Me
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-md">
                <DialogHeader>
                  <DialogTitle>Ready for a new experience?</DialogTitle>
                  <DialogDescription>
                    Get notified when we launch
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              className="text-foreground"
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-left text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              className="text-foreground"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-left text-xs" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? "Subscribing..." : "Notify Me"}
                    </Button>
                  </form>
                </Form>
                <DialogFooter>
                  <p className="text-[0.5rem] text-muted-foreground">
                    By subscribing, you agree to allow us to send you emails
                    about new products, promotions, and updates up to the date
                    and time of launch.
                  </p>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
}
