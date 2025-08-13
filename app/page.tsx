"use client";

import { GetNotifiedModal } from "@/components/modals/get-notified-modal";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="sticky inset-0 h-screen flex flex-col items-center justify-end pb-[30vh] sm:pb-[10vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onContextMenu={(e) => e.preventDefault()}
        >
          <source
            src="https://video.twimg.com/amplify_video/1953551064374161409/vid/avc1/1350x1080/4exec0o_lFWMaffn.mp4"
            type="video/mp4"
          />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        <div
          className="absolute inset-0 bg-black/30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.60'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        ></div>

        {/* Content positioned in bottom quarter */}
        <div className="relative z-10 gap-2 flex flex-col text-center text-background max-w-lg w-full px-4 mix-blend-hard-light">
          <h2 className="text-2xl font-base">Introducing</h2>
          <h1 className="text-5xl font-base">BVR ST CO.</h1>
          <p className="text-md font-semibold">A New Culture.</p>
        </div>

        {/* Buttons with max-w-lg */}
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
