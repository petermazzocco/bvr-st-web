import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddToNewsletterForm } from "../forms/add-to-newsletter-form";
import { ArrowUpRightIcon } from "lucide-react";

export const GetNotifiedModal = () => {
  return (
    <Dialog>
      <form className="group flex-1 min-w-0">
        <DialogTrigger
          asChild
          className="flex items-center justify-center w-full "
        >
          <Button
            variant="outline"
            id="learn-more-button"
            data-umami-event="Homepage learn more clicked"
            className=" group"
          >
            <span className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem] group-hover:animate-pulse">
              GET NOTIFIED
            </span>
            <ArrowUpRightIcon
              className="-me-1 ms-2 opacity-60  group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem] group-hover:animate-pulse"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>The New Oregon State Starts With You</DialogTitle>
            <DialogDescription>
              Sign up now and be the first to know when we launch our products,
              experiences, and services.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <AddToNewsletterForm />
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};
