import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <Link
        href={"/about"}
        className="h-screen bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat flex items-end pl-0 md:pl-20 justify-center md:justify-start pb-[25vh] md:pb-[20vh]"
      >
        <div className="z-10 gap-2 flex flex-col text-center md:text-left text-background">
          <h2 className="text-2xl font-base tracking-wider">Introducing</h2>
          <h1 className="text-5xl font-bold tracking-wider">BVR ST CO</h1>
          <p className="text-md font-semibold">A New Culture.</p>
          <Button
            variant={"outline"}
            id="homepage-shop-now-button"
            data-umami-event="Homepage shop now clicked"
          >
            LEARN MORE
          </Button>
        </div>
      </Link>
      <div className="relative flex w-screen flex-col items-center justify-center overflow-hidden h-24 ">
        <Marquee pauseOnHover className="[--duration:10s]">
          <Image
            src="/mock-logo.png"
            alt="BVR ST CO Logo"
            width={100}
            height={100}
          />
        </Marquee>
      </div>
      <Link
        href={"/collections/the-beaver-state-tour"}
        className="h-screen bg-[url('/auth.jpg')] bg-cover bg-center bg-no-repeat flex items-end pr-0 md:pr-20 justify-center md:justify-end pb-[25vh] md:pb-[20vh]"
      >
        <div className="z-10 gap-2 flex flex-col text-center md:text-right text-background">
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
      </Link>
    </>
  );
}
