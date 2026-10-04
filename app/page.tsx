"use client";

import { useEffect, useState } from "react";
import { getTourProgress } from "@/lib/tour";
import AITaskList, { type AITask } from "@/components/smoothui/ai-task-list";
import AnimatedStepper from "@/components/smoothui/animated-stepper";
import { Card, Icon, LinkButton } from "@/components/ui";

const PROBLEMS = [
  {
    icon: "hourglass_top",
    title: "Every contract waits for a lawyer",
    body: "First-pass review is manual, so a routine NDA queues behind a high-stakes processor agreement.",
  },
  {
    icon: "report",
    title: "Risk is found late",
    body: "Uncapped indemnities, auto-renewals and missing data processing terms surface at signature, or after.",
  },
  {
    icon: "visibility_off",
    title: "No portfolio view",
    body: "Legal can't see which agreements carry the most exposure, or which notice deadlines are coming up.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Upload",
    body: "Drop in a PDF or DOCX. Text is extracted in memory; the file is never stored.",
    href: "/intake",
    link: "Contract Intake",
  },
  {
    n: 2,
    title: "Extract",
    body: "AI pulls 20+ terms: parties, value, liability cap, termination, data protection, governing law.",
    href: "/analysis/seed-1",
    link: "Example analysis",
  },
  {
    n: 3,
    title: "Assess",
    body: "Each finding gets a severity, the clause it comes from, and a recommended action.",
    href: "/analysis/seed-1",
    link: "Example findings",
  },
  {
    n: 4,
    title: "Route",
    body: "One click creates a matter for the right legal team. The dashboard shows what needs attention.",
    href: "/dashboard",
    link: "Dashboard",
  },
];

const CHECKS = [
  { icon: "shield", title: "Liability & indemnity", body: "Caps, carve-outs and one-sided indemnities." },
  { icon: "lock", title: "Data protection", body: "DPAs, cross-border transfers, breach notice windows." },
  { icon: "verified_user", title: "Security & audit", body: "Named standards, audit rights, sub-processors." },
  { icon: "event_repeat", title: "Renewal & exit", body: "Auto-renewal, notice periods, termination rights." },
  { icon: "copyright", title: "IP & data use", body: "Who owns deliverables; whether your data trains their models." },
  { icon: "gavel", title: "Law & disputes", body: "Governing law, forum and escalation path." },
];

const ROADMAP = [
  { title: "CLM integration", body: "Push matters to Ironclad or DocuSign CLM instead of the simulated record." },
  { title: "SSO & roles", body: "Company single sign-on; requesters, reviewers and approvers see different views." },
  { title: "Nuvei playbook", body: "Score against Nuvei Legal's own fallback positions, not generic market norms." },
  { title: "Audit trail", body: "Every analysis, override and approval logged and retained." },
];

export default function OverviewPage() {
  const [tour, setTour] = useState<ReturnType<typeof getTourProgress> | null>(null);

  useEffect(() => {
    setTour(getTourProgress());
  }, []);

  const tourSteps = [
    { done: tour?.analyzed, title: "Analyze a contract", body: "Run the demo, or upload the sample PDF.", href: "/intake?demo=1", cta: "Run demo" },
    { done: tour?.viewedAnalysis, title: "Read the risk analysis", body: "Findings, clauses and recommended actions.", href: "/analysis/seed-1", cta: "Open example" },
    { done: tour?.createdMatter, title: "Route it as a matter", body: "Create Matter on any analysis.", href: "/contracts", cta: "Pick a contract" },
    { done: tour?.viewedDashboard, title: "See the portfolio view", body: "What needs attention, and what's due.", href: "/dashboard", cta: "Open dashboard" },
  ];
  const nextStep = tourSteps.find((s) => !s.done);
  // The first unfinished step shows as running so the eye lands on it
  const tourTasks: AITask[] = tourSteps.map((s) => ({
    id: s.title,
    label: s.title,
    note: s.done ? "Done" : undefined,
    status: s.done ? "done" : s === nextStep ? "running" : "pending",
  }));

  return (
    <div className="max-w-5xl">
      {/* Hook */}
      <section className="mb-14">
        <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Concept prototype for Nuvei Legal</p>
        <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight leading-tight mb-4">
          From contract inbox to routed legal matter in minutes.
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-3xl mb-8">
          Nuvei signs a constant flow of vendor, partner and merchant agreements across many jurisdictions. Each one needs
          a first-pass legal read before anyone can act. This prototype does that first pass with AI, explains the risks in
          plain language, and sends only the contracts that need a lawyer to the right team.
        </p>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/intake?demo=1" variant="danger" icon="play_arrow">
            Run the 2-minute demo
          </LinkButton>
          <LinkButton href="/intake" variant="secondary" icon="upload_file">
            Upload a contract
          </LinkButton>
        </div>
      </section>

      {/* Chapter 1: the problem */}
      <section className="mb-14">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">01 · The problem</p>
        <h2 className="text-2xl font-bold text-primary mb-6">Legal review is the bottleneck between a deal and a signature.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROBLEMS.map((p) => (
            <Card key={p.title}>
              <Icon name={p.icon} className="text-[24px] text-secondary mb-3 block" />
              <h3 className="text-base font-bold text-primary mb-1">{p.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Chapter 2: how it works */}
      <section className="mb-14">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">02 · How it works</p>
        <h2 className="text-2xl font-bold text-primary mb-6">Four steps, each one a screen in this app.</h2>
        <Card>
          <AnimatedStepper
            allowClickNavigation
            steps={STEPS.map((s) => ({
              label: s.title,
              description: s.body,
              content: (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md bg-surface-container-low px-4 py-3">
                  <p className="text-sm text-primary-container flex-1">
                    {s.title} happens on <strong>{s.link}</strong>.
                  </p>
                  <LinkButton href={s.href} variant="secondary" className="h-9 shrink-0">
                    Open {s.link}
                  </LinkButton>
                </div>
              ),
            }))}
          />
          <p className="mt-3 text-xs text-on-surface-variant">Click a step to see where it happens in the app.</p>
        </Card>
      </section>

      {/* Chapter 3: proof, a guided demo that tracks itself */}
      <section className="mb-14">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">03 · See it working</p>
        <h2 className="text-2xl font-bold text-primary mb-6">Walk the whole flow yourself.</h2>
        <Card>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <AITaskList label="Demo progress" tasks={tourTasks} className="md:flex-1 border-outline-variant/50" />
            <div className="md:w-64 shrink-0 rounded-lg border border-outline-variant/50 p-4">
              {nextStep ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Next step</p>
                  <p className="text-sm font-semibold text-primary-container">{nextStep.title}</p>
                  <p className="text-xs text-on-surface-variant mb-3">{nextStep.body}</p>
                  <LinkButton href={nextStep.href} variant="danger" icon="arrow_forward" className="w-full h-9">
                    {nextStep.cta}
                  </LinkButton>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-primary-container mb-1">You have seen the whole flow.</p>
                  <p className="text-xs text-on-surface-variant">Try it on your own contract next.</p>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mt-4">
            To test with a real document,{" "}
            <a href="/samples/Sample_Software_Services_Agreement.pdf" download className="tap font-semibold underline underline-offset-2 hover:text-primary">
              download the sample contract
            </a>{" "}
            and upload it on Contract Intake.
          </p>
        </Card>
      </section>

      {/* Chapter 4: payments-specific checks */}
      <section className="mb-14">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">04 · Built for a payments company</p>
        <h2 className="text-2xl font-bold text-primary mb-6">It checks the terms that carry the most risk for a payments company.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHECKS.map((c) => (
            <div key={c.title} className="flex gap-3 rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-4">
              <Icon name={c.icon} className="text-[22px] text-primary-container shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-primary">{c.title}</h3>
                <p className="text-sm text-on-surface-variant">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 5: path to production + close */}
      <section className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">05 · Path to production</p>
        <h2 className="text-2xl font-bold text-primary mb-2">What it would take to run this at Nuvei.</h2>
        <p className="text-sm text-on-surface-variant mb-6 max-w-3xl">
          The AI does the first pass only. Lawyers stay the decision-makers; the tool decides what reaches them first.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {ROADMAP.map((r) => (
            <div key={r.title} className="rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-4">
              <h3 className="text-sm font-bold text-primary mb-1">{r.title}</h3>
              <p className="text-sm text-on-surface-variant">{r.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-primary-container text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold mb-1">See it on a real contract.</h2>
            <p className="text-sm text-white/80">The demo takes about two minutes, start to finish.</p>
          </div>
          <LinkButton href="/intake?demo=1" variant="danger" icon="play_arrow">
            Run the demo
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
