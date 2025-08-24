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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
            className=" group bg-primary"
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
        <DialogContent className="sm:max-w-[400px] flex flex-col items-center">
          <Avatar className="w-14 h-14 bg-muted-foreground">
            <AvatarImage
              src="/assets/icons/BEAVER-ST-CO_ICON-03.svg"
              alt="Avatar"
              className="p-3"
            />
            <AvatarFallback>OS</AvatarFallback>
          </Avatar>
          <DialogHeader>
            <DialogTitle>Join the BVR ST CO studio</DialogTitle>
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
