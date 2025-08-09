import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="h-screen bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat flex items-end justify-center pb-[15vh]">
        <div className="z-10 gap-2 flex flex-col text-center text-background max-w-md w-full px-4">
          <h2 className="text-2xl font-base">Introducing</h2>
          <h1 className="text-5xl font-base">BEAVER STREET CO.</h1>
          <p className="text-md font-semibold">A New Culture.</p>
          <div className="flex flex-row justify-between items-center w-full gap-4 mt-4">
            <Button
              variant={"outline"}
              asChild
              className="group flex-1 min-w-0"
            >
              <Link
                href={"/blog/bvr-str-co-a-new-beaver-initiative"}
                id="learn-more-button"
                data-umami-event="Homepage learn more clicked"
                className="flex items-center justify-center w-full"
              >
                LEARN MORE
                <ArrowRightIcon
                  className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              variant={"outline"}
              asChild
              className="group flex-1 min-w-0"
            >
              <Link
                href={"/signup?redirect=/membership"}
                className="flex items-center justify-center w-full"
              >
                SIGN UP NOW
                <ArrowRightIcon
                  className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {/*<Link
          href={"/collections/the-beaver-state-tour"}
          className="h-screen bg-[url('/auth.jpg')] bg-cover bg-center bg-no-repeat flex items-end  justify-center pb-[20vh]"
        >
          <div className="z-10 gap-2 flex flex-col text-center text-background">
            <h2 className="text-lg font-base tracking-wider">Now Live</h2>
            <h1 className="text-3xl font-bold tracking-wider">
              The Beaver State Tour
            </h1>
            <Button
              variant={"outline"}
              id="homepage-shop-now-button"
              data-umami-event="Homepage shop now clicked"
            >
              BUY NOW
            </Button>
          </div>
        </Link>*/}
    </>
  );
}
