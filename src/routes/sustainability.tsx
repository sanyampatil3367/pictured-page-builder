import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Droplets,
  Leaf,
  Recycle,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/sustainability")({
  component: SustainabilityPage,
});

type ActivityFilter = "All" | "Energy" | "Water" | "Waste";

type Activity = {
  id: string;
  title: string;
  description: string;
  category: Exclude<ActivityFilter, "All">;
  points: number;
  impact: string;
  date: string;
  verified: boolean;
  icon: ReactNode;
};

const ACTIVITIES: Activity[] = [
  {
    id: "impact-01",
    title: "Reported unnecessary classroom energy usage",
    description:
      "Your verified report helped the maintenance team identify a classroom where electrical equipment was being left on after scheduled hours.",
    category: "Energy",
    points: 25,
    impact: "8.4 kWh estimated savings",
    date: "Oct 17, 2026",
    verified: true,
    icon: <Zap size={16} />,
  },
  {
    id: "impact-02",
    title: "Reported a leaking wash basin",
    description:
      "The plumbing issue was verified and repaired before continued water loss could occur.",
    category: "Water",
    points: 20,
    impact: "420 L estimated water protected",
    date: "Oct 16, 2026",
    verified: true,
    icon: <Droplets size={16} />,
  },
  {
    id: "impact-03",
    title: "Participated in campus waste segregation",
    description:
      "Your participation was recorded during the verified campus sustainability activity.",
    category: "Waste",
    points: 15,
    impact: "12 kg waste diverted",
    date: "Oct 14, 2026",
    verified: true,
    icon: <Recycle size={16} />,
  },
  {
    id: "impact-04",
    title: "Reported classroom light issue",
    description:
      "The issue was verified and sent to the electrical maintenance team.",
    category: "Energy",
    points: 10,
    impact: "Maintenance efficiency improved",
    date: "Oct 12, 2026",
    verified: true,
    icon: <Zap size={16} />,
  },
];

const MONTHLY_POINTS = [
  { month: "May", points: 55 },
  { month: "Jun", points: 80 },
  { month: "Jul", points: 95 },
  { month: "Aug", points: 110 },
  { month: "Sep", points: 140 },
  { month: "Oct", points: 185 },
];

function SustainabilityPage() {
  const [filter, setFilter] = useState<ActivityFilter>("All");

  const filteredActivities = useMemo(() => {
    if (filter === "All") return ACTIVITIES;

    return ACTIVITIES.filter((activity) => activity.category === filter);
  }, [filter]);

  const totalPoints = 560;
  const campusScore = 82;
  const nextMilestone = 750;
  const progress = Math.min((totalPoints / nextMilestone) * 100, 100);

  return (
    <div className="min-h-full px-4 py-5 text-foreground md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px] space-y-5">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/75 p-6 shadow-xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-yellow-300/15 blur-3xl dark:bg-yellow-300/10" />
          <div className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl dark:bg-emerald-400/[0.06]" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-600 dark:text-yellow-300">
                <Leaf size={14} />
                Sustainability
              </div>

              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Your Campus Impact
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                See how verified actions contribute to your campus energy,
                water, waste, and sustainability goals.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-300/[0.08] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
                <Award size={19} />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Impact Points
                </p>

                <p className="text-xl font-semibold">
                  {totalPoints}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main metrics */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Leaf size={18} />}
            label="Campus Sustainability"
            value={`${campusScore}%`}
            description="Current campus score"
          />

          <MetricCard
            icon={<Zap size={18} />}
            label="Energy Saved"
            value="18.4 kWh"
            description="Estimated verified impact"
          />

          <MetricCard
            icon={<Droplets size={18} />}
            label="Water Protected"
            value="420 L"
            description="Estimated verified impact"
          />

          <MetricCard
            icon={<Recycle size={18} />}
            label="Waste Diverted"
            value="12 kg"
            description="Verified campus activity"
          />
        </section>

        {/* Progress + trend */}
        <section className="grid gap-5 lg:grid-cols-[1fr_1.35fr]">
          <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Next Milestone
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Sustainability Champion
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
                <Award size={18} />
              </div>
            </div>

            <div className="mt-7">
              <div className="flex items-end justify-between gap-3">
                <span className="text-3xl font-semibold">
                  {totalPoints}
                </span>

                <span className="text-xs text-muted-foreground">
                  / {nextMilestone} points
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-300 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {nextMilestone - totalPoints} more verified points to reach
                your next milestone.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.05] p-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                <TrendingUp size={15} />
                <span className="text-xs font-semibold">
                  Impact is trending upward
                </span>
              </div>

              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                Your verified contribution increased compared with the
                previous month.
              </p>
            </div>
          </div>

          <ImpactTrend />
        </section>

        {/* Activity */}
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-yellow-600 dark:text-yellow-300" />
                <h2 className="text-lg font-semibold">
                  Verified Contributions
                </h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Every contribution below has passed the appropriate
                verification stage.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["All", "Energy", "Water", "Waste"] as ActivityFilter[]).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-xl border px-3 py-2 text-[10px] font-medium transition ${
                      filter === item
                        ? "border-yellow-400/40 bg-yellow-300/15 text-yellow-700 dark:text-yellow-200"
                        : "border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>

        {/* Verification principle */}
        <section className="rounded-3xl border border-yellow-400/15 bg-yellow-300/[0.045] p-5 shadow-lg backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/15 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
              <CheckCircle2 size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Verified impact only
              </p>

              <p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">
                VYRA does not automatically reward or penalize students based
                only on AI predictions. Sustainability points are based on
                verified actions, reports, or participation so the system
                remains fair and accountable.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/15 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
        {icon}
      </div>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ImpactTrend() {
  const maxPoints = Math.max(...MONTHLY_POINTS.map((item) => item.points));

  return (
    <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Contribution Trend
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            Monthly Impact
          </h2>
        </div>

        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
          <TrendingUp size={16} />
          <span className="text-xs font-semibold">Growing</span>
        </div>
      </div>

      <div className="mt-7 flex h-44 items-end gap-3">
        {MONTHLY_POINTS.map((item) => {
          const height = Math.max((item.points / maxPoints) * 100, 10);

          return (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-[9px] text-muted-foreground">
                {item.points}
              </span>

              <div className="flex h-[120px] w-full items-end rounded-lg bg-muted/60">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-yellow-500/70 to-yellow-300"
                  style={{ height: `${height}%` }}
                />
              </div>

              <span className="text-[9px] text-muted-foreground">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="rounded-3xl border border-border bg-card/70 p-4 shadow-lg backdrop-blur-xl transition hover:bg-card md:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          {activity.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold">
                  {activity.title}
                </h3>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-300">
                  Verified
                </span>
              </div>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
                {activity.description}
              </p>
            </div>

            <div className="shrink-0 text-left md:text-right">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                +{activity.points} pts
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                {activity.date}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-[9px] text-muted-foreground">
              {activity.category}
            </span>

            <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-[9px] text-muted-foreground">
              {activity.impact}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}