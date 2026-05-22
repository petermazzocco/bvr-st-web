"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApplyForScoutForm } from "../forms/apply-for-scout-form";
import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ApplyForScoutModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group bg-primary hover:bg-primary/90 text-white h-12 px-8 uppercase">
          Apply / Get Involved
          <ArrowUpRight
            className="ms-2 opacity-70 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            size={14}
            aria-hidden="true"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] flex flex-col items-center">
        <Avatar className="w-14 h-14 bg-muted-foreground">
          <AvatarImage
            src="/assets/icons/BEAVER-ST-CO_ICON-03.svg"
            alt="Avatar"
            className="p-3"
          />
          <AvatarFallback>OS</AvatarFallback>
        </Avatar>
        <DialogHeader>
          <DialogTitle>Apply for the Scout Program</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself and why you&apos;d be a great fit for
            the Scout Program.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <ApplyForScoutForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};
