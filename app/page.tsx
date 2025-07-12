import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { SanityDocument } from "next-sanity";
import { urlFor } from "@/lib/sanity/image";

const HERO_QUERY = `*[_type == "hero"][0]{
  _id,
  heading,
  image,
  buttonText,
  buttonRoute
}`;

export const metadata = {
  title: "BVR STR CO",
  description: "Shop BVR STR and support Oregon State University.",
  openGraph: {
    type: "website",
  },
};

export default async function Page() {
  const hero = await client.fetch<SanityDocument>(HERO_QUERY, {});

  // Handle case where no hero data is found
  if (!hero) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Hero content not found. Please add hero content in Sanity Studio.</p>
      </div>
    );
  }

  // Get the image URL from Sanity
  const imageUrl = hero.image ? urlFor(hero.image).url() : "/labubu-bg.jpg";

  return (
    <>
      {/* HERO SECTION */}
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
            variant="outline"
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
