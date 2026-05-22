import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";
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
    name: "Kyle Bjornstad",
    nickname: "",
    title: "Co-founder",
    image: "/team/kyle.jpg",
    socials: [
      {
        icon: (
          <SocialIcon
            url="https://www.instagram.com/bjorn2lead/"
            target="_blank"
          />
        ),
        url: "https://www.instagram.com/bjorn2lead/",
      },
      {
        icon: <SocialIcon url="https://x.com/bjorn2lead" target="_blank" />,
        url: "https://x.com/bjorn2lead",
      },
    ],
  },
  {
    name: "Peter Mazzocco",
    image: "/team/peter.png",
    title: "Co-founder",
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
            url="https://threads.com/@petermazzocco"
            target="_blank"
          />
        ),
        url: "https://threads.com/@petermazzocco",
      },
      {
        icon: (
          <SocialIcon
            url="https://www.instagram.com/petermazzocco/"
            target="_blank"
          />
        ),
        url: "https://www.instagram.com/petermazzocco/",
      },
    ],
  },
  // {
  //   name: "Travis Jones",
  //   image: "/team/travis.png",
  //   socials: [
  //     {
  //       icon: (
  //         <SocialIcon
  //           url="https://www.instagram.com/jupiterwilliams/"
  //           target="_blank"
  //         />
  //       ),
  //       url: "https://www.instagram.com/jupiterwilliams",
  //     },
  //     {
  //       icon: (
  //         <SocialIcon url="https://x.com/JupiterWil1iams" target="_blank" />
  //       ),
  //       url: "https://x.com/JupiterWil1iams",
  //     },
  //   ],
  // },
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

const pillars = [
  {
    n: "01",
    title: "Strategic Partnerships",
    body: "By aligning with NVIDIA through the Inception Program, we serve as the bridge connecting world-class technology partners with Oregon State Athletics, ensuring our athletic programs have access to industry-leading innovation.",
  },
  {
    n: "02",
    title: "Student Development",
    body: "We provide genuine, hands-on opportunities for Oregon State University students to gain real-world experience developing products and services that push athletics further. Students don't just learn—they build solutions that directly impact outcomes.",
  },
  {
    n: "03",
    title: "Scalable Innovation",
    body: "When we create successful products and services internally, we don't keep them to ourselves. We commercialize proven solutions and offer them to other universities and athletic programs, generating revenue while advancing industries broadly.",
  },
];

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl border-x border-border">

        {/* Hero / Who We Are */}
        <section className="border-b border-border px-6 py-20 md:px-12 md:py-28">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            About Us
          </p>
          <h1 className="mt-4 text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
            Who We Are
          </h1>
          <p className="mt-5 max-w-2xl font-light leading-relaxed text-muted-foreground">
            BVR ST STUDIO is Oregon State&apos;s innovation studio, dedicated to
            creating sustainable competitive advantages through cutting-edge
            technology and collaboration. Our mission centers on three strategic
            pillars.
          </p>
        </section>

        {/* Strategic Pillars */}
        <section className="border-b border-border px-6 py-20 md:px-12 md:py-28">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Our Strategic Pillars
          </p>
          <h2 className="mt-4 text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
            What drives us
          </h2>

          <div className="mt-12 grid border border-border md:grid-cols-3">
            {pillars.map((p, i) => (
              <div
                key={p.n}
                className={`flex flex-col p-8 transition-colors hover:bg-secondary md:p-10 ${
                  i !== 0 ? "border-t border-border md:border-l md:border-t-0" : ""
                }`}
              >
                <span className="font-mono text-sm font-bold text-primary">{p.n}</span>
                <h3 className="mt-4 text-xl font-medium uppercase tracking-wide text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Supporting Students */}
        <section className="border-b border-border px-6 py-20 md:px-12 md:py-28">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Students
          </p>
          <h2 className="mt-4 text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
            Supporting Students
          </h2>
          <div className="mt-8 flex max-w-3xl flex-col gap-4 font-light leading-relaxed text-muted-foreground">
            <p>
              At BVR ST STUDIO, we&apos;re committed to providing students with
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
          </div>
        </section>

        {/* Meet The Team */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            The Team
          </p>
          <h2 className="mt-4 text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
            Meet The Team
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => (
              <TeamMemberCard
                key={i}
                name={member.name}
                image={member.image}
                socials={member.socials}
                title={member.title as string}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
