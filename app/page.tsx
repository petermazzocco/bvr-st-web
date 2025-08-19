import { GetNotifiedModal } from "@/components/modals/get-notified-modal";
import { Button } from "@/components/ui/button";
import { HeroVideo } from "@/components/utils/hero-video";
import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="relative h-screen flex flex-col items-center justify-end pb-[30vh] sm:pb-[10vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/main-fallback.png')]" />
        <HeroVideo />
        <div className="relative z-10 gap-2 flex flex-col items-center justify-center text-background max-w-lg w-full px-4 mix-blend-hard-light">
          <h2 className="text-2xl font-base">Introducing</h2>
          <h2 className="text-6xl font-base tracking-wide">BVR ST CO.</h2>
          <p className="text-md font-base">A New Culture.</p>
        </div>
        <div className="relative z-10 flex flex-row justify-between items-center max-w-lg w-full px-4 gap-4 mt-4 isolate">
          <Button variant={"outline"} asChild className="group flex-1 min-w-0">
            <Link
              href={"/blog/welcome-to-bvr-st-co"}
              id="learn-more-button"
              data-umami-event="Homepage learn more clicked"
              className="flex items-center justify-center w-full"
            >
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem] group-hover:animate-pulse">
                LEARN MORE
              </span>
              <ArrowUpRightIcon
                className="-me-1 ms-2 opacity-60 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-0.125rem] group-hover:animate-pulse"
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
