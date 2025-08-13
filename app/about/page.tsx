import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about BVR ST CO's mission to curate the finest hype products for Oregon State fans to benefit Oregon State student-athletes. Discover our story, values, and commitment to changing the Beaver fan culture.",
  canonical: "https://bvrstco.com/about",
  image: {
    url: "https://bvrstco.com/about.jpg",
    alt: "BVR ST CO About Us",
  },
});

export default function Page() {
  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="py-16">
        <div className="bg-background rounded-lg max-w-4xl mx-auto p-4 text-left">
          <h2
            id="mission"
            className="text-lg text-left font-bold mb-4 text-foreground"
          >
            Mission
          </h2>
          <div className="flex flex-col gap-4 text-xs text-muted-foreground leading-relaxed mb-16">
            <p>
              <strong>
                The culture shift Beaver fans have been waiting for.
              </strong>
            </p>
            <p>
              BVR ST CO isn&apos;t your typical collective, company, or
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
              BVR ST CO is where Oregon State&apos;s underground culture meets
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
              Welcome to the new era of Oregon State. Welcome to BVR ST CO—where
              tradition meets innovation, and the future of Beaver culture
              begins.
            </p>
            <p className="italic">
              We don&apos;t just rep the brand. We are the brand.
            </p>
          </div>

          <h2
            id="pricing"
            className="text-lg text-left font-bold mb-4 text-foreground"
          >
            Transparent Pricing & Supporting Student-Athletes
          </h2>
          <div className="flex flex-col gap-4 text-xs text-muted-foreground leading-relaxed mb-16">
            <p>
              <strong>
                Our pricing is designed to maximize financial benefits for
                Oregon State student-athletes and keep prices as low as
                possible.
              </strong>
            </p>
            <p>Here&apos;s exactly how our commission structure works:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Affiliates receive:</strong> 40% of selling price
              </li>
              <li>
                <strong>We maintain:</strong> 60% of selling price (50% covers
                product cost + 10% buffer for fees/expenses)
              </li>
            </ul>
            <p>
              <strong>Example Price Breakdown:</strong>
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Cost to make product: $20.00</li>
              <li>
                Selling price of product: $40.00 (calculated as $20.00 ÷ 0.50)
              </li>
              <li>Affiliate receives: $16.00 (40%)</li>
              <li>We receive: $24.00 (60%)</li>
              <li>After covering cost: $4.00 profit buffer (10%)</li>
              <li>
                If the 10% is not needed to cover any additional expenses, the
                profit is put towards both operational expenses for the team and
                marketing efforts that support the student-athletes who model
                and promote our brand.
              </li>
            </ul>
            <p>
              This structure ensures student-athletes get a strong 40%
              commission while maintaining profitability with a 10% buffer for
              additional expenses.
            </p>
            <p>
              <strong>
                Don&apos;t have an affiliate code at checkout, but want the
                athletes to earn as much as possible? No problem.
              </strong>
            </p>
            <p>
              The majority of our profits go directly into marketing efforts
              that support the student-athletes who model and promote our brand.
              Your purchase still benefits Oregon State student-athletes,
              whether you use an affiliate code or not.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
