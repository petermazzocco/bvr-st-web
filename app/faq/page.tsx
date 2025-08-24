import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description: "Frequently asked questions about BVR ST CO.",
  canonical: "https://bvrstco.com/faq",
  image: {
    url: "https://bvrstco.com/opengraph/faq.png",
    alt: "BVR ST CO FAQ",
  },
});

export default function Page() {
  return (
    <div className="min-h-screen pt-16">
      <div className=" py-16 ">
        <div className="bg-background max-w-4xl mx-auto p-4 rounded-lg text-left border shadow-sm">
          <h2 className="text-lg text-left font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col text-xs text-muted-foreground leading-relaxed gap-10 mb-16">
            <div>
              <p className="font-bold text-foreground mb-2">
                Are you an NIL (name, image and likeness) Collective?
              </p>
              <p>
                No, we are not an NIL collective. We are a innovative studio
                that focused on creating offerings in which we will work with
                student-athletes at Oregon State for marketing.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                What does the CO stand for?
              </p>
              <p>
                The &apos;CO&apos; in BVR ST CO is intentionally left ambiguous
                because it can represent Community or Company—both applying in
                its own unique way.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                Are you affiliated with or officially recognized by Oregon State
                University and/or Dam Nation Collective?
              </p>
              <p>
                While we celebrate and proudly support Oregon State University
                and all that is has to offer, Beaver Street Co LLC operates
                independently from any official entity, including any official
                third-party partners of Oregon State. We are fans and alumni
                creating innovative products, services, and experiences for the
                Beaver community and supporting the student-athletes by
                marketing their name, image, and likeness.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                Are you competing with Dam Nation Collective?
              </p>
              <p>
                Since we are not an NIL collective, we are not competing with
                Dam Nation. We view BVR ST CO as a complimentary studio to the
                great work being done at Dam Nation and Oregon State. In fact,
                we encourage you to become a member of{" "}
                <a
                  href="https://damnationnil.com/pages/support-now"
                  className=" underline"
                  target="_blank"
                >
                  Dam Nation
                </a>{" "}
                now and support their mission.
              </p>
            </div>

            {/*
            <div>
              <p id="pricing" className="font-bold text-foreground mb-2">
                How is your pricing structured?
              </p>
              <p className="mb-3">
                Our pricing is designed to maximize financial benefits for
                Oregon State student-athletes through our transparent commission
                structure:
              </p>
              <ul className="list-disc ml-6 space-y-1 mb-3">
                <li>
                  <strong>Affiliates receive:</strong> 40% of selling price
                </li>
                <li>
                  <strong>We maintain:</strong> 60% of selling price (50% covers
                  product cost + 10% buffer for fees/expenses)
                </li>
              </ul>
              <p className="mb-2">
                <strong>Example (Hoodie):</strong>
              </p>
              <ul className="list-disc ml-6 space-y-1 mb-3">
                <li>Cost to make: $20.00</li>
                <li>Selling price: $40.00</li>
                <li>Affiliate receives: $16.00 (40%)</li>
                <li>After covering costs: $4.00 profit buffer</li>
              </ul>
              <p>
                You can read more about our transparent pricing{" "}
                <a className="underline" href="/about#pricing">
                  here
                </a>
                .
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                What are your shipping options?
              </p>
              <p>
                Shipping costs are calculated at checkout. The times and prices
                will depend on what product you are interested in, location, and
                external factors such as weather, politics and delivery service
                availability.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                What is your return policy?
              </p>
              <p>
                We accept returns within 30 days of purchase for unworn,
                unwashed merchandise with original tags. This does not include
                our partnered stores or any auction item. Limited edition and
                custom items may have different return policies. Contact us for
                return authorization or if you have more questions about a
                specific item.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                How do I track my order?
              </p>
              <p>
                Once your order ships, you&apos;ll receive a tracking number via
                email. You can use this number to track your package on the
                carrier&apos;s website. If your order does not come with a
                tracking number, please contact us for assistance.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                Do you restock sold out items?
              </p>
              <p>
                Some items may be restocked, but many of our drops are limited
                edition. This means most will not be restocked once they are
                sold out. We do not keep track of inventory for our partnered
                stores, and any auction item will never be restocked once sold.
                Follow our social media or sign up for our newsletter to stay
                updated on restocks and new releases.
              </p>
            </div>*/}

            <div>
              <p className="font-bold text-foreground mb-2">
                How can I contact BVR ST CO for opportunities as a
                student-athlete or a brand looking to partner?
              </p>
              <p>
                You can reach us through our contact form, email, or social
                media channels. We typically respond within 24-48 hours during
                business days.
              </p>
            </div>

            <div className="italic mt-8">
              Have more questions?{" "}
              <Link href="/contact" className="underline">
                Don&apos;t hesitate to reach out, we&apos;re here to help.{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
