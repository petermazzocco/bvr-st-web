import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-static";

export default function Page() {
  return (
    <>
      <div className="h-screen bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat flex items-end justify-center pb-[25vh]">
        <div className="z-10 gap-2 flex flex-col text-center text-background">
          <h2 className="text-lg font-base tracking-wider">Introducing</h2>
          <h1 className="text-3xl font-bold tracking-wider">BVR STR CO</h1>
          <p className="text-md font-semibold">A New Culture.</p>
          <Link href={"/about"}>
            <Button
              variant={"outline"}
              id="homepage-learn-more-button"
              data-umami-event="Homepage learn more clicked"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-screen bg-[url('/auth.jpg')] bg-cover bg-center bg-no-repeat flex items-end justify-center pb-[25vh]">
        <div className="z-10 gap-2 flex flex-col text-center text-background">
          <h2 className="text-lg font-base tracking-wider">Now Live</h2>
          <h1 className="text-3xl font-bold tracking-wider">
            The Beaver State Tour
          </h1>
          <Link href={"/collections/the-beaver-state-tour"}>
            <Button
              variant={"outline"}
              id="homepage-shop-now-button"
              data-umami-event="Homepage shop now clicked"
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
