"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { getHeroSection } from "@/server/sanity/actions";
import { HeroSection } from "@/lib/types";
import { urlFor } from "@/lib/sanity/image";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const {
    mutate: fetchHero,
    data: hero,
    isPending,
    error,
  } = useApiMutation<HeroSection, void>(async (_variables: void) => {
    return await getHeroSection();
  }, {
    onError: (error) => {
      console.error("Failed to fetch hero section:", error);
    },
  });

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  if (isPending) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-end bg-cover bg-center bg-gray-200">
        <div className="mb-44 flex flex-col items-center justify-center gap-4">
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-12 w-40" />
        </div>
      </section>
    );
  }

  if (error || !hero) {
    return (
      <section
        className="flex min-h-screen flex-col items-center justify-end bg-cover bg-center"
        style={{
          backgroundImage: `url('/labubu-bg.jpg')`,
        }}
      >
        <div className="mb-44 flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-4xl font-bold text-foreground">
            BVR STR CO
          </h1>
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="flex items-center text-xl justify-center gap-2"
          >
            <Link href="/shop">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const imageUrl = hero.image ? urlFor(hero.image)?.url() || "/labubu-bg.jpg" : "/labubu-bg.jpg";

  return (
    <>
      <section
        className="flex min-h-screen flex-col items-center justify-end bg-cover bg-center"
        style={{
          backgroundImage: `url('${imageUrl}')`,
        }}
      >
        <div className="mb-44 flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-4xl font-bold text-foreground">
            {hero.heading}
          </h1>
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="flex items-center text-xl justify-center gap-2"
          >
            <Link href={hero.buttonRoute}>
              {hero.buttonText} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
