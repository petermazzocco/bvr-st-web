import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import { Separator } from "@/components/ui/separator";
import { SocialIcon } from "react-social-icons";
import { TeamMemberCard } from "@/components/cards/team-member-card";

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

const TEAM_MEMBERS = [
  {
    name: "Peter Mazzocco",
    title: "Founder",
    image: "/team/peter.png",
    socials: [
      {
        icon: (
          <SocialIcon
            url="https://linkedin.com/in/petermazzocco"
            target="_blank"
          />
        ),
        url: "https://linkedin.com/in/petermazzocco",
      },
      {
        icon: (
          <SocialIcon
            url="https://bsky.app/profile/thedigitaldam.com"
            target="_blank"
          />
        ),
        url: "https://bsky.app/profile/thedigitaldam.com",
      },
      {
        icon: (
          <SocialIcon
            url="https://www.instagram.com/thedigitaldam/"
            target="_blank"
          />
        ),
        url: "https://www.instagram.com/thedigitaldam",
      },
      {
        icon: (
          <SocialIcon
            url="https://www.youtube.com/@thedigitaldam/"
            target="_blank"
          />
        ),
        url: "https://www.youtube.com/@thedigitaldam",
      },
    ],
  },
  {
    name: "Travis Jones",
    title: "Co-Founder",
    image: "/team/travis.png",
    socials: [
      {
        icon: (
          <SocialIcon
            url="https://www.instagram.com/jupiterwilliams/"
            target="_blank"
          />
        ),
        url: "https://www.instagram.com/jupiterwilliams",
      },
      {
        icon: (
          <SocialIcon url="https://x.com/JupiterWil1iams" target="_blank" />
        ),
        url: "https://x.com/JupiterWil1iams",
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="py-16">
        <div className="bg-background gap-4 rounded-lg max-w-4xl mx-auto p-4 text-left">
          <h2
            id="mission"
            className="text-lg text-left font-bold text-foreground"
          >
            Mission
          </h2>
          <div className="flex flex-col gap-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              BVR ST CO (Beaver Street Co) isn&apos;t a typical collective, a
              company, or a community—we&apos;re all three and none of them.
              We&apos;re a movement built to drag Oregon State out of outdated
              traditions and into the pulse of modern, tech-inspired culture.
            </p>
            <p>
              <strong className="text-primary">
                Our mission is simple: elevate, disrupt, innovate.
              </strong>
            </p>
            <p>
              We&apos;re here to provide Oregon State&apos;s fans, athletes, and
              community with a new energy that refuses to play it safe and
              pushes the boundaries on what is possible. While others stick to
              the playbook, we&apos;re writing our own, new set of rules. Our
              goal is to curate exclusive high-quality products, goods, and
              services, forge partnerships with boundary-pushing and successful
              brands, influeners, and creators, and craft experiences that range
              between digital innovation and raw, in-person energy.
            </p>
            <p>
              BVR ST CO is where Oregon State&apos;s new culture meets
              mainstream impact. We&apos;re building a collective space where
              authenticity trumps conformity, where the products, experiences,
              and partnerships create sustainable long-term growth, shock-value,
              and tell the story of a new Oregon State.
            </p>
            <p>
              Welcome to the new era of Oregon State. Welcome to BVR ST CO—where
              tradition meets innovation, and the future of Oregon State begins.
            </p>
          </div>
          <Separator className="my-8" />
          <h2
            id="pricing"
            className="text-lg text-left font-bold text-foreground"
          >
            Supporting Student-Athletes
          </h2>
          <div className="flex flex-col gap-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              We&apos;re committed to supporting Oregon State student-athletes
              through authentic NIL partnerships with forward-thinking brands,
              influencers, and creators. Every student-athlete we work with
              receives genuine opportunities to monetize their Name, Image, and
              Likeness—exactly as NIL was intended to work.
            </p>
            <p>
              Rather than simply asking for donations, we believe in providing
              real value to fans in return. That is why every marketing
              collaboration with our student-athletes centers around goods and
              services that you can actually use, purchase, and enjoy. When you
              support these partnerships, you are not just making a donation—you
              are getting something meaningful back while directly supporting
              the athletes who represent Oregon State
            </p>
            <p>
              Soon, we plan on launching our affilaite marketing program. This
              means, every athelte at Oregon State is eligible to earn income
              for their Name, Image, and Likeness. Our goal is that the majority
              of our profits are reinvested into marketing efforts that showcase
              and financially benefit the student-athletes who partner with our
              brand. Whether you use an affiliate code or not, your purchase
              creates real NIL earning opportunities for Oregon State
              student-athletes.
            </p>
          </div>{" "}
          <Separator className="my-8" />
          <h2
            id="team"
            className="text-lg text-left font-bold  text-foreground"
          >
            Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM_MEMBERS.map((member, i) => (
              <TeamMemberCard
                key={i}
                name={member.name}
                title={member.title}
                image={member.image}
                socials={member.socials}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
