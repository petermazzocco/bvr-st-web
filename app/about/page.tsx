import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import { Separator } from "@/components/ui/separator";
import { SocialIcon } from "react-social-icons";
import { TeamMemberCard } from "@/components/cards/team-member-card";

export const dynamic = "force-static";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description: "Learn about BVR ST STUDIO's mission.",
  canonical: "https://bvrst.studio/about",
  image: {
    url: "https://bvrst.studio/opengraph/index.png",
    alt: "BVR ST STUDIO About Us",
  },
});

const TEAM_MEMBERS = [
  {
    name: "Peter Mazzocco",
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
  // {
  //   name: "Kyle Bjornstad",
  //   nickname: "",
  //   image: "/team/kyle.jpg",
  //   socials: [
  //     {
  //       icon: (
  //         <SocialIcon url="https://www.x.com/kylebjornstad1/" target="_blank" />
  //       ),
  //       url: "https://www.x.com/kylebjornstad1/",
  //     },
  //   ],
  // },
  {
    name: "Travis Jones",
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
  // {
  //   name: "Michael Milord",
  //   title: "Director of Engineering",
  //   nickname: "Milord",
  //   image: "/team/milord.png",
  //   socials: [
  //     {
  //       icon: (
  //         <SocialIcon
  //           url="https://www.linkedin.com/in/michael-milord/"
  //           target="_blank"
  //         />
  //       ),
  //       url: "https://www.linkedin.com/in/michael-milord/",
  //     },
  //   ],
  // },
  // {
  //   name: "Matt Pfeifer",
  //   title: "Head of Product",
  //   nickname: "",
  //   image: "/team/matt.jpeg",
  //   socials: [
  //     {
  //       icon: (
  //         <SocialIcon
  //           url="https://www.linkedin.com/in/matthew-pfeifer/"
  //           target="_blank"
  //         />
  //       ),
  //       url: "https://www.linkedin.com/in/matthew-pfeifer/",
  //     },
  //     {
  //       icon: <SocialIcon url="https://x.com/trustless_matt" target="_blank" />,
  //       url: "https://x.com/trustless_matt",
  //     },
  //   ],
  // },
  // {
  //   name: "Giang Doan",
  //   title: "Systems Development Engineer",
  //   nickname: "",
  //   image: "/team/giang.jpg",
  //   socials: [
  //     {
  //       icon: (
  //         <SocialIcon
  //           url="https://www.linkedin.com/in/giang-doan-464058185/"
  //           target="_blank"
  //         />
  //       ),
  //       url: "https://www.linkedin.com/in/giang-doan-464058185/",
  //     },
  //   ],
  // },
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
              BVR ST STUDIO is Oregon State&apos;s innovation studio, dedicated
              to creating sustainable competitive advantages through
              cutting-edge technology and collaboration. Our mission centers on
              three strategic pillars.
            </p>
          </div>
          <Separator className="my-8" />
          <h2
            id="pillars"
            className="text-lg text-left font-bold text-foreground mb-4"
          >
            Our Strategic Pillars
          </h2>
          <div className="flex flex-col gap-6 text-xs text-muted-foreground leading-relaxed">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Strategic Partnerships
              </h3>
              <p>
                By aligning with NVIDIA and Oregon State, we serve as the bridge
                connecting world-class technology partners with Oregon State,
                ensuring our programs have access to industry-leading
                innovation.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Student Development
              </h3>
              <p>
                We provide genuine, hands-on opportunities for students to gain
                real-world experience developing performance-enhancing products
                and services for all of athletics. Students don&apos;t just
                learn—they build solutions that directly impact outcomes.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Scalable Innovation
              </h3>
              <p>
                When we create successful products and services internally, we
                don&apos;t keep them to ourselves. We commercialize proven
                solutions and offer them to other universities and programs,
                generating revenue while advancing the industry.
              </p>
            </div>
          </div>
          <Separator className="my-8" />
          <h2
            id="students"
            className="text-lg text-left font-bold text-foreground mb-4"
          >
            Supporting Students
          </h2>
          <div className="flex flex-col gap-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              At BVR ST, we&apos;re committed to providing students with
              meaningful opportunities to gain real-world experience while
              contributing to cutting-edge innovation.
            </p>
            <p>
              Our structured internship program offers students hands-on
              experience developing performance-enhancing products and services
              for Oregon State. Students work alongside industry professionals
              on real projects that directly impact competitive outcomes.
            </p>
            <p>
              Through our partnerships with NVIDIA and Oregon State&apos;s
              academic programs, interns gain access to industry-leading
              technology and mentorship while building solutions for athletics
              that matter. This isn&apos;t just resume-building—it&apos;s
              genuine product development experience that prepares students for
              careers in technology and innovation.
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
