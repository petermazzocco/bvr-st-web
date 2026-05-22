import type { Metadata } from "next";
import Image from "next/image";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import { Separator } from "@/components/ui/separator";
import { ApplyForScoutModal } from "@/components/modals/apply-for-scout-modal";
import { GrainGradientBackground } from "@/components/ui/grain-gradient-background";

export const dynamic = "force-static";

export const metadata: Metadata = createMetadata({
  title: "The Scout Program",
  description:
    "A new initiative from BVR ST STUDIO. Oregon State students and student-athletes train Scout — a family of sport-specialized AI models powering COORDINATOR — through scheduled testing windows, synthetic data, and direct feedback. NIL-paid for student-athletes.",
  canonical: "https://bvrst.studio/scout",
  image: {
    url: "https://bvrst.studio/opengraph/index.png",
    alt: "The Scout Program — BVR ST STUDIO",
  },
});

const programSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  name: "The Scout Program",
  description:
    "A BVR ST STUDIO initiative where Oregon State students and student-athletes improve Scout, a family of sport-specialized AI models that power COORDINATOR's agentic engine, through scheduled testing windows, synthetic data generation, and structured feedback.",
  url: "https://bvrst.studio/scout",
  provider: {
    "@type": "Organization",
    name: "BVR ST STUDIO",
    url: "https://bvrst.studio",
  },
  programType: "Research and testing program",
  educationalProgramMode: "part-time",
  occupationalCategory: [
    "Technical Tester",
    "Athlete Tester",
    "Alumni & Fan Contributor",
  ],
  offers: {
    "@type": "Offer",
    category: "NIL",
    description:
      "Oregon State student-athletes are paid a flat rate per completed session as a structured NIL opportunity for technical contribution to sports AI.",
  },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-4 font-mono">
      {children}
    </p>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-background py-16 px-6 md:px-12 relative z-20">
      <div className="w-full">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-thin tracking-[-0.02em] text-foreground mb-8">
          {title}
        </h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed font-light">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(programSchema) }}
      />

      <div className="mx-auto w-full max-w-6xl border-x border-border">
        {/* Hero */}
        <header className="sticky top-0 z-0 h-[80vh] sm:h-[70vh] flex flex-col justify-center overflow-hidden px-6 py-24">
          <GrainGradientBackground />
          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col-reverse items-center gap-8 text-white md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="text-center md:text-left">
              <p className="text-primary text-sm font-bold tracking-[0.25em] uppercase mb-6 font-mono">
                A New Initiative from BVR ST STUDIO
              </p>
              <h1 className="text-[4rem] md:text-[6rem] leading-[0.85] font-thin tracking-[-0.02em] mb-6">
                THE SCOUT
                <br />
                PROGRAM
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto md:mx-0 mb-10">
                Oregon State students and student-athletes train Scout — a
                family of sport-specialized AI models powering COORDINATOR —
                through scheduled testing windows, synthetic data, and direct
                feedback.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
                <ApplyForScoutModal />
              </div>
            </div>

            <Image
              src="/assets/scout-on-white.svg"
              alt="Scout"
              width={200}
              height={2}
              priority
              className="h-20 w-20 shrink-0 rounded-2xl shadow-lg sm:h-44 sm:w-44"
            />
          </div>
        </header>

        <div className="relative z-20 bg-background">
          {/* What it is */}
          <Section eyebrow="The Scout Program" title="What it is">
            <p>
              The Scout Program is a new initiative from BVR ST STUDIO built to
              improve Scout, a family of sport-specialized AI models that will
              power COORDINATOR&apos;s agentic engine. Through scheduled testing
              windows, current Oregon State students and student-athletes
              interact directly with Scout, generate the data that trains it,
              and provide the feedback that shapes how it learns over time.
            </p>
            <p>
              <strong className="font-medium text-foreground">
                What is Scout?
              </strong>{" "}
              Scout is a family of sport-specialized AI models and will be the
              intelligence layer that powers COORDINATOR, an agentic platform
              for athletes and sports programs coming soon. Where
              general-purpose AI is trained on the open internet, Scout is
              trained on the language, strategy, and data of athletics like
              film, playbooks, scouting reports, biometric streams, training
              plans, and more. The result is an AI that actually speaks sport:
              one that reads a Cover 3 shell, recognizes a training block, and
              understands the difference between mileage the week before a
              marathon and the week after.
            </p>
            <p>
              The program runs on a two-pronged tester model.{" "}
              <strong className="font-medium text-foreground">
                Technical testers
              </strong>{" "}
              are current CS, AI/ML, and data science students who generate the
              synthetic datasets that expand Scout&apos;s training corpus and
              run new fine-tuned versions of the model.{" "}
              <strong className="font-medium text-foreground">
                Athlete testers
              </strong>{" "}
              are current and former Oregon State student-athletes who chat
              directly with those new versions and flag where Scout misreads
              strategy, terminology, or the realities of their sport. Together
              they form a working group that makes Scout sharper, more accurate,
              and more useful with every iteration.
            </p>
          </Section>

          <Separator />

          {/* Why it matters */}
          <Section eyebrow="Why This Matters" title="Why it matters">
            <p>
              Sports tech is the next frontier in athletics, and AI is the
              engine driving it. The teams, schools, and companies that take
              this seriously first will define what the next decade of sport
              looks like — how athletes train, how coaches strategize, and how
              analysts read the game.
            </p>
            <p>
              Athletes, coaches, and more deserve AI that speaks the language of
              sports and athletics. One that reads strategy with depth, handles
              terminology with precision, and gives answers grounded in how the
              game is actually played. The Scout models exist to deliver exactly
              that, and the Scout Program exists to make sure Scout is shaped by
              the people who actually live in sport by putting student-athletes,
              technical students, and the broader Beaver Nation community at the
              center of how it is built.
            </p>
          </Section>

          <Separator />

          {/* Mission */}
          <Section eyebrow="Our Mission" title="A twofold mission">
            <div>
              <h3 className="text-foreground font-medium mb-2">
                Establishing Oregon State as a leader in AI-powered sports
                technology
              </h3>
              <p>
                AI is being used extensively in sports, and the university and
                program that take it seriously first will define the field for
                generations. By concentrating Scout&apos;s development in and
                around Oregon State, we&apos;re putting OSU students and
                student-athletes at the front of an industry that is still being
                written.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-medium mb-2">
                Powering COORDINATOR with the best Scout models possible
              </h3>
              <p>
                Scout is the model that powers the agentic engine inside of
                COORDINATOR. Every interaction, every piece of feedback, and
                every synthetic data contribution from the Scout Program
                directly improves the models behind COORDINATOR. The better
                Scout gets, the better COORDINATOR gets.
              </p>
            </div>
          </Section>

          <Separator />

          {/* How it works */}
          <section
            id="how-it-works"
            className="bg-background py-16 px-6 md:px-12 relative z-20 scroll-mt-24"
          >
            <div className="w-full">
              <Eyebrow>How the Program Works</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-thin tracking-[-0.02em] text-foreground mb-10">
                A scheduled testing window model
              </h2>
              <ol className="space-y-8">
                {[
                  {
                    t: "Onboarding",
                    d: "Accepted applicants complete a one-time onboarding covering how Scout works at a high level, how to give structured and useful feedback, how synthetic data is created, and any required paperwork.",
                  },
                  {
                    t: "Testing Windows",
                    d: "We open short, focused testing windows on a periodic basis. The windowed model keeps the program cost-efficient and lets us stress-test COORDINATOR's agentic engine on various NVIDIA GPUs before public launch. Each window runs roughly 1–2 hours, has limited seats, and targets a specific objective.",
                  },
                  {
                    t: "Feedback & Synthetic Data",
                    d: "During each window, testers interact with Scout in guided and open-ended ways, submit structured feedback on chat outputs, and contribute to the synthetic data that feeds the next training run.",
                  },
                  {
                    t: "Iteration",
                    d: "What we learn from each window informs the next training run, the next version of Scout, the newly created synthetic data, and the next testing window. Testers see their feedback show up in the model, and eventually in COORDINATOR.",
                  },
                ].map((step, i) => (
                  <li key={step.t} className="flex gap-6">
                    <span className="text-primary text-2xl font-bold tabular-nums shrink-0 w-10 font-mono">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-foreground font-medium mb-2 uppercase tracking-wide text-sm">
                        {step.t}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed font-light">
                        {step.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <Separator />

          {/* The two roles */}
          <Section eyebrow="How Testers Work Together" title="A complete loop">
            <p>
              The Scout Program is structured around two groups of testers who
              work in tandem. Each plays a distinct role, and together they form
              a complete loop that funnels real, sport-grounded improvements
              into Scout.
            </p>
            <div className="grid md:grid-cols-2 gap-8 pt-4">
              <div className="border border-border bg-card p-6 rounded shadow-sm shadow-black/20">
                <h3 className="text-foreground font-medium mb-3 uppercase tracking-wide text-sm">
                  Technical Testers
                </h3>
                <p className="text-muted-foreground leading-relaxed font-light mb-3">
                  Current Oregon State students in CS, AI/ML, or data science.
                  Their core contribution is building the synthetic datasets
                  that train Scout. Building useful sports AI requires training
                  data that is structured, labeled, and rich in sport-specific
                  context, and technical testers use Scout&apos;s training
                  portal to generate exactly that.
                </p>
                <p className="text-muted-foreground leading-relaxed font-light">
                  They also get hands-on experience with the NVIDIA developer
                  stack, which is the same work AI teams at major companies do
                  every day. Real, resume-grade experience on real
                  infrastructure.
                </p>
              </div>
              <div className="border border-border bg-card p-6 rounded shadow-sm shadow-black/20">
                <h3 className="text-foreground font-medium mb-3 uppercase tracking-wide text-sm">
                  Athlete Testers
                </h3>
                <p className="text-muted-foreground leading-relaxed font-light mb-3">
                  When technical testers ship a new fine-tuned version of Scout,
                  athlete testers take over: they ask real questions about their
                  sport, walk through real scenarios, probe for depth, and call
                  out anything that misreads strategy, terminology, or athlete
                  intent.
                </p>
                <p className="text-muted-foreground leading-relaxed font-light">
                  Current student-athletes bring sport expertise no annotation
                  contractor and no general-purpose AI can match. Their feedback
                  feeds the next round of synthetic data and training, closing
                  the loop for Scout.
                </p>
              </div>
            </div>
          </Section>

          <Separator />

          {/* Who can get involved */}
          <Section eyebrow="Who Can Get Involved" title="Three ways in">
            <ul className="space-y-4">
              <li>
                <strong className="font-medium text-foreground">
                  Technical Testers.
                </strong>{" "}
                Current Oregon State students studying computer science, AI/ML,
                data science, or related technical fields.
              </li>
              <li>
                <strong className="font-medium text-foreground">
                  Athlete Testers.
                </strong>{" "}
                Current Oregon State student-athletes across any sport Scout
                supports. Structured as a genuine NIL opportunity with paid
                sessions.
              </li>
              <li>
                <strong className="font-medium text-foreground">
                  Alumni &amp; Fan Contributors.
                </strong>{" "}
                Oregon State alumni and fans with backgrounds in CS, AI/ML,
                software engineering, or applied research who want to stay
                connected to the work happening on campus and with their
                favorite teams.
              </li>
            </ul>
          </Section>

          <Separator />

          {/* NIL */}
          <Section
            eyebrow="Paid Opportunities for Athletes"
            title="Genuine NIL for sport expertise"
          >
            <p>
              Sport expertise is real, valuable work, and the Scout Program
              treats it that way. For the life of the program, athlete testers
              are paid a flat rate per session they complete. The flat-rate
              model keeps participation simple, predictable, and easy to plan
              around alongside training and class schedules. Compensation rates
              are shared at onboarding.
            </p>
            <p>
              The Scout Program is open to{" "}
              <strong className="font-medium text-foreground">
                every eligible OSU student-athlete.
              </strong>{" "}
              There are no roster restrictions, no sport-by-sport caps, and no
              quotas. Once enrolled and onboarded, athletes opt into testing
              windows as their schedule allows, complete the session, and get
              paid.
            </p>
            <p>
              Most NIL deals today are built around image, likeness, and
              endorsement. The Scout Program is built around something
              different: technical work that only student-athletes can do.
              Athletes bring sport expertise that no annotation contractor and
              no general-purpose AI can replicate, and the Scout Program is
              structured to compensate that expertise directly. We see this as a
              model for what NIL can look like when companies invest in athletes
              for the work they&apos;re uniquely positioned to contribute.
            </p>
          </Section>

          <Separator />

          {/* NVIDIA */}
          <section className="bg-background py-16 px-6 md:px-12 relative z-20">
            <div className="w-full">
              <Eyebrow>Powered by NVIDIA</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-thin tracking-[-0.02em] text-foreground mb-8">
                Built on NVIDIA, end to end
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed font-light mb-8">
                <p>
                  BVR ST STUDIO is a member of the NVIDIA Inception Program, and
                  Scout is built on NVIDIA&apos;s own family of models, trained
                  on NVIDIA hardware, and served through NVIDIA&apos;s
                  infrastructure.
                </p>
                <p>
                  Scout is built on the{" "}
                  <strong className="font-medium text-foreground">
                    NVIDIA Nemotron
                  </strong>{" "}
                  model family — spanning lightweight versions designed for
                  fast, efficient use up to large versions built for deep,
                  multi-step reasoning. Scout uses the full spectrum, which is
                  what lets it move fast across many sports while maintaining
                  depth where it counts.
                </p>
                <p>
                  All training runs on NVIDIA hardware. NVIDIA gives us
                  on-demand access to high-powered GPUs via their cloud services
                  and on-campus with the new Huang Complex Center. NVIDIA is the
                  foundation underneath everything Scout — and therefore
                  everything COORDINATOR — runs on.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Closing CTA */}
          <section className="bg-background py-24 px-6 md:px-12 relative z-20">
            <div className="w-full text-center">
              <Eyebrow>Get Involved</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-thin tracking-[-0.02em] text-foreground mb-6">
                Help build the future of athletic AI
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto mb-10">
                Whether you&apos;re an engineering student, a current
                student-athlete, or part of Beaver Nation, there&apos;s a place
                for you in the Scout Program.
              </p>
              <div className="flex justify-center">
                <ApplyForScoutModal />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
