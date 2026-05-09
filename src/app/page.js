"use client";

import HeroVideoPlayer from "@/components/HeroVideoPlayer";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  MessageCircle,
  Swords,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Build Custom Challenges",
    description:
      "Create challenges tailored to your goals, whether you are learning a language, mastering a framework, or building side projects.",
    image: "/assets/images/journeyskill-challenge.png",
    icon: Swords,
  },
  {
    title: "Track Streaks",
    description:
      "Stay consistent with visual progress, streak tracking, and milestones that make your daily effort easier to see.",
    image: "/assets/images/journeyskill-streak.png",
    icon: Trophy,
  },
  {
    title: "Analytics That Matter",
    description:
      "Track completed tasks, review progress over time, and understand what is helping your coding habit grow.",
    image: "/assets/images/journeyskill-analytics.png",
    icon: BarChart3,
  },
  {
    title: "Community Accountability",
    description:
      "Share updates, get feedback, and stay accountable with likes, comments, and developers working toward similar goals.",
    image: "/assets/images/journeyskill-community.png",
    icon: MessageCircle,
  },
];

const steps = [
  "Create your own coding challenge with tasks and duration.",
  "Complete tasks and post progress as you learn.",
  "Monitor streaks, completion rate, and challenge analytics.",
  "Use community feedback to keep yourself accountable.",
];

const techLogos = [
  { src: "/assets/images/js.svg", alt: "JavaScript" },
  { src: "/assets/images/react.svg", alt: "React" },
  { src: "/assets/images/vue.svg", alt: "Vue" },
  { src: "/assets/images/svelte.svg", alt: "Svelte" },
];

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <GridBackground />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-11/12 max-w-6xl items-center gap-10 py-20 md:grid-cols-[0.95fr_1.05fr] md:py-24 lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" />
              JourneySkill beta
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
              Build your coding habit with challenges, posts, and progress.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Plan a skill challenge, complete daily tasks, share what you
              learned, and track streaks from one focused workspace.
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/challenges"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                Explore Challenges
                <Swords className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 divide-y divide-border rounded-lg border border-border bg-background/85 text-left shadow-sm backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <HeroStat value="01" label="Create a challenge" />
              <HeroStat value="14d" label="Keep streaks visible" />
              <HeroStat value="68%" label="Track completion" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border px-2 pb-3">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">
                    React Mastery Challenge
                  </p>
                  <p className="text-xs text-muted-foreground">
                    30 days of focused frontend practice
                  </p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-accent">
                  <Trophy className="h-5 w-5" />
                </span>
              </div>

              <div className="grid gap-3 py-4 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-md border border-border bg-secondary/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      Today
                    </p>
                    <span className="rounded-full bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                      Day 14
                    </span>
                  </div>
                  <p className="mt-4 text-4xl font-bold tracking-normal text-foreground">
                    3/4
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    tasks completed
                  </p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
                    <div className="h-full w-3/4 rounded-full bg-accent" />
                  </div>
                </div>

                <div className="space-y-3">
                  <HeroTask done label="Build reusable tab component" />
                  <HeroTask done label="Write progress notes" />
                  <HeroTask done label="Share learning update" />
                  <HeroTask label="Review challenge analytics" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
                <HeroMetric icon={BarChart3} title="Completion" value="68%" />
                <HeroMetric
                  icon={MessageCircle}
                  title="Feedback"
                  value="37 replies"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto w-11/12 max-w-6xl">
          <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
            <div className="flex items-center justify-between gap-4 px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-card-foreground">
                  JourneySkill in action
                </p>
                <p className="text-xs text-muted-foreground">
                  Create, track, and complete coding challenges.
                </p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                {techLogos.map((logo) => (
                  <span
                    key={logo.alt}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={18}
                      height={18}
                    />
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-md border border-border bg-background">
              <HeroVideoPlayer />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24">
        <div className="mx-auto w-11/12 max-w-6xl">
          <SectionHeading
            eyebrow="Why JourneySkill"
            title="A clean system for consistent developer growth."
            description="Built for developers who learn through challenges like #100DaysOfCode, framework sprints, and project-based practice."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} index={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="mx-auto grid w-11/12 max-w-6xl gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <SectionHeading
            eyebrow="How it works"
            title="Start with one challenge. Keep going with proof."
            description="Every step is focused on making progress visible without adding extra noise to the learning process."
          />

          <div className="grid gap-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className="grid grid-cols-[2.5rem_1fr] items-start gap-4 rounded-lg border border-border bg-background p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="pt-1 text-sm leading-6 text-muted-foreground">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="signup" className="relative overflow-hidden py-16 md:py-24">
        <GridBackground />
        <div className="relative mx-auto w-11/12 max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-normal sm:text-4xl">
            Master coding habits that stick.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Your journey starts with one challenge, one task, and a place to
            track the progress you are already making.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Join Now
            <CheckCircle2 className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} JourneySkill. All rights reserved.
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </main>
  );
}

function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--border) / 0.45) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.45) 1px, transparent 1px), radial-gradient(circle at top, hsl(var(--accent) / 0.10), transparent 36rem)",
        backgroundSize: "44px 44px, 44px 44px, 100% 100%",
        maskImage:
          "linear-gradient(to bottom, black, black 62%, transparent 100%)",
      }}
    />
  );
}

function HeroStat({ value, label }) {
  return (
    <div className="p-5">
      <p className="text-2xl font-bold leading-none text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function HeroTask({ done = false, label }) {
  return (
    <div className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-background px-3 text-sm text-foreground">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          done ? "bg-accent text-accent-foreground" : "border border-border"
        }`}
      >
        {done && <CheckCircle2 className="h-4 w-4" />}
      </span>
      <span>{label}</span>
    </div>
  );
}

function HeroMetric({ icon: Icon, title, value }) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-medium">{title}</p>
      </div>
      <p className="mt-3 text-xl font-semibold tracking-normal text-foreground">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function Stat({ title, description }) {
  return (
    <div className="p-5">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FeatureCard({ title, description, image, icon: Icon, index }) {
  const isPrimary = index === 0;
  const isWide = index === 3;

  return (
    <article
      className={`group overflow-hidden rounded-lg border border-border bg-card transition hover:border-accent/50 ${
        isPrimary ? "md:col-span-2 md:row-span-2" : ""
      } ${isWide ? "md:col-span-2 lg:col-span-2" : ""}`}
    >
      <div
        className={`relative flex items-center justify-center border-b border-border bg-secondary/50 ${
          isPrimary ? "min-h-72 p-6 md:min-h-96" : "min-h-52 p-5"
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border) / 0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <Image
          src={image}
          alt={title}
          width={isPrimary ? 720 : 420}
          height={isPrimary ? 520 : 320}
          className={`relative w-auto object-contain transition duration-300 group-hover:scale-[1.02] ${
            isPrimary ? "max-h-80" : "max-h-44"
          }`}
        />
      </div>

      <div className={isPrimary ? "p-6 md:p-7" : "p-5"}>
        <div className="flex items-center justify-between gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-accent">
            <Icon className="h-5 w-5" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3
          className={`mt-5 font-semibold tracking-normal text-card-foreground ${
            isPrimary ? "text-2xl md:text-3xl" : "text-xl"
          }`}
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
}
