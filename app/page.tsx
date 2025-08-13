import { GetNotifiedModal } from "@/components/modals/get-notified-modal";
import { Button } from "@/components/ui/button";
import { HeroVideo } from "@/components/utils/hero-video";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="sticky inset-0 h-screen flex flex-col items-center justify-end pb-[30vh] sm:pb-[10vh] overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 gap-2 flex flex-col text-center text-background max-w-lg w-full px-4 mix-blend-hard-light">
          <h2 className="text-2xl font-base">Introducing</h2>
          <h1 className="text-5xl font-base">BVR ST CO.</h1>
          <p className="text-md font-semibold">A New Culture.</p>
        </div>
        <div className="relative z-10 flex flex-row justify-between items-center max-w-lg w-full px-4 gap-4 mt-4 isolate">
          <Button variant={"outline"} asChild className="group flex-1 min-w-0">
            <Link
              href={"/blog/oregon-states-revolution"}
              id="learn-more-button"
              data-umami-event="Homepage learn more clicked"
              className="flex items-center justify-center w-full"
            >
              LEARN MORE
              <ArrowUpRightIcon
                className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem]"
                size={16}
                aria-hidden="true"
              />
            </Link>
          </Button>
          <GetNotifiedModal />
        </div>
      </div>
    </>
  );
}
