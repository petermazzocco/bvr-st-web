import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import { Separator } from "@/components/ui/separator";
import { SocialIcon } from "react-social-icons";
import { TeamMemberCard } from "@/components/cards/team-member-card";

export const dynamic = "force-static";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description: "Learn about BVR ST CO's mission.",
  canonical: "https://bvrstco.com/about",
  image: {
    url: "https://bvrstco.com/opengraph/about.png",
    alt: "BVR ST CO About Us",
  },
});

const TEAM_MEMBERS = [
  {
    name: "Peter Mazzocco",
    title: "Founder",
    nickname: "The Digital DAM",
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
    nickname: "Jupiter Williams",
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
  {
    name: "Michael Milord",
    title: "Director of Engineering",
    nickname: "Milord",
    image: "/team/milord.png",
    socials: [
      {
        icon: (
          <SocialIcon
            url="https://www.linkedin.com/in/michael-milord/"
            target="_blank"
          />
        ),
        url: "https://www.linkedin.com/in/michael-milord/",
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="py-16">
        <div className="bg-background gap-4 rounded-lg max-w-4xl mx-auto p-4 text-left border shadow-sm">
          <h2
            id="mission"
            className="text-lg text-left font-bold text-foreground  mb-4"
          >
            Who We Are
          </h2>
          <div className="flex flex-col gap-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              BVR ST CO (Beaver Street Co) is an innovative studio that
              leverages Oregon State&apos;s strong alumni network and tech
              heritage to offer forward-thinking products and services that will
              be marketed, modeled, and co-created by Beaver student-athletes to
              maximize their earning opportunities.
            </p>
          </div>
          <Separator className="my-8" />
          <h2
            id="pricing"
            className="text-lg text-left font-bold text-foreground mb-4"
          >
            Supporting Student-Athletes
          </h2>
          <div className="flex flex-col gap-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              We&apos;re committed to supporting Oregon State student-athletes
              through authentic marketing partnerships with our own internal
              offerings and with forward-thinking brands, influencers, and
              creators. The current collegiate landscape allows us to utilize
              student-athletes&apos; unique identities and reach in exchange for
              financial compensation.
            </p>
            <p>
              Rather than asking for contributions, we believe in offering
              products and services to fans in return. That is why every
              marketing opportunity with a student-athlete centers around these
              offerings that you can use, purchase, and enjoy.
            </p>
          </div>{" "}
          <Separator className="my-8" />
          <h2
            id="team"
            className="text-lg text-left font-bold  text-foreground"
          >
            Meet The Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM_MEMBERS.map((member, i) => (
              <TeamMemberCard
                key={i}
                name={member.name}
                nickname={member.nickname}
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
