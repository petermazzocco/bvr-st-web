import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about BVR STR CO's mission to curate the finest hype products for Oregon State fans to benefit Oregon State student-athletes. Discover our story, values, and commitment to changing the Beaver fan culture.",
  canonical: "https://bvrstrco.com/about",
  image: {
    url: "https://bvrstrco.com/about.jpg",
    alt: "BVR STR CO About Us",
  },
});

export default function Page() {
  return (
    <div className="min-h-screen">
      <div className="relative h-screen flex items-center justify-center max-h-72">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/about.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center text-background">
          <h1 className="text-8xl font-bold tracking-wider">BVR STR CO</h1>
        </div>
      </div>

      <div className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 text-left">
          <h2 className="text-lg text-left font-bold mb-4 text-foreground">
            Mission
          </h2>
          <div className="flex flex-col gap-4 text-xs text-muted-foreground leading-relaxed mb-16">
            <p>
              <strong>
                The culture shift Beaver fans have been waiting for.
              </strong>
            </p>
            <p>
              BVR STR CO isn&apos;t your typical collective, company, or
              community—we&apos;re all three and none of them. We&apos;re a
              movement built to drag Oregon State out of outdated traditions and
              into the pulse of modern culture. Born from the streets and fueled
              by hype, we exist to redefine what it means to rep the Beavers.
            </p>
            <p>
              <strong>
                Our mission is simple: elevate, disrupt, innovate.
              </strong>
            </p>
            <p>
              We&apos;re here to serve Oregon State&apos;s fans, athletes, and
              community with a punk-driven energy that refuses to play it safe.
              While others stick to the playbook, we&apos;re writing our own
              rules. We curate exclusive product drops, forge partnerships with
              boundary-pushing brands, influeners, and creators, and craft
              experiences that blur the lines between digital innovation and
              raw, in-person energy.
            </p>
            <p>
              <strong>
                We&apos;re not following compliance—we&apos;ll challenge them.
              </strong>
            </p>
            <p>
              BVR STR CO is where Oregon State&apos;s underground culture meets
              mainstream impact. We&apos;re building a space where authenticity
              trumps conformity, where the products create chaos, and where
              being a Beaver means something bold and unapologetic.
            </p>
            <p>
              <strong>
                This is more than merch. This is more than community. This is
                cultural revolution.
              </strong>
            </p>
            <p>
              Welcome to the new era of Oregon State. Welcome to BVR STR
              CO—where tradition meets innovation, and the future of Beaver
              culture begins.
            </p>
            <p className="italic">
              We don&apos;t just rep the brand. We are the brand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
