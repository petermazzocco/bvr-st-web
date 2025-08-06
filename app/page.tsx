import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="h-screen bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat flex items-end justify-center pb-[20vh]">
        <div className="z-10 gap-2 flex flex-col text-center  text-background">
          <h2 className="text-2xl font-base tracking-wider">Introducing</h2>
          <h1 className="text-5xl font-bold tracking-wider">BVR ST CO</h1>
          <p className="text-md font-semibold">A New Culture.</p>
          <Button variant={"outline"} asChild>
            <Link
              href={"/blog/bvr-str-co-a-new-beaver-initiative"}
              id="learn-more-button"
              data-umami-event="Homepage learn more clicked"
            >
              LEARN MORE
            </Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/signup?redirect=/membership"}>SIGN UP NOW</Link>
          </Button>
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
