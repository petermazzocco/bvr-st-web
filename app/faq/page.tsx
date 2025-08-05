import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about BVR STR CO. Find answers about ordering, shipping, returns, partnerships, and more about our streetwear and Oregon State merchandise.",
  canonical: "https://bvrstco.com/faq",
  image: {
    url: "https://bvrstco.com/faq.jpg",
    alt: "BVR STR CO FAQ",
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
          <h1 className="text-8xl font-bold tracking-wider">FAQ</h1>
        </div>
      </div>

      <div className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 text-left">
          <h2 className="text-lg text-left font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col text-xs text-muted-foreground leading-relaxed gap-10 mb-16">
            <div>
              <p className="font-bold text-foreground mb-2">
                What is BVR STR CO?
              </p>
              <p>
                BVR STR CO (Beaver Street Co LLC) is an initiative focused on
                creating a renewed Oregon State culture. We curate exclusive
                drops, forge partnerships with boundary-pushing brands,
                entities, and influencers, and create experiences that blend
                digital and creative innovation with raw, punk-like energy. This
                is not your average grandma and grandpa shop. Expect nothing
                boring to be found here.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                Are you a NIL collective?
              </p>
              <p>
                No, we are not a NIL collective. However, we do work with
                student-athletes on marketing opportunities for their name,
                image and likeness.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                If you&apos;re not an NIL collective, why do you have a
                membership?
              </p>
              <p>
                Our membership is for those who want early access, exclusive
                discounts, and personalized experiences. You are welcome to join
                our community and enjoy the benefits of being a member, but we
                will not force you to join.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                Are you affiliated with Oregon State University and/or Dam
                Nation Collective?
              </p>
              <p>
                While we celebrate and proudly support Oregon State University
                and all that is has to offer, Beaver Street Co LLC operates
                independently from any official entity. We are fans and alumni
                creating culture-driven products and experiences for the Beaver
                community.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                Where does my money go?
              </p>
              <p>
                Your purchases and membership subscriptions contribute to the
                growth and sustainability of Beaver Street Co LLC (like
                supporting our student-intern led staff, expenses, etc.) and the
                Oregon State student-athletes for legit NIL marketing. We work
                directly with the student-athletes on all marketing efforts.
                Rest assured that your money is being used the{" "}
                <strong>right way.</strong>
              </p>
            </div>

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
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                How can I contact customer service?
              </p>
              <p>
                You can reach us through our contact form, email, or social
                media channels. We typically respond within 24-48 hours during
                business days. Unless it&apos;s game day, expect that timeframe
                to be longer.
              </p>
            </div>

            <p className="italic mt-8">
              Have more questions? Don&apos;t hesitate to reach out, we&apos;re
              here to help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
