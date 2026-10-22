import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Award,
  BatteryCharging,
  CheckCircle2,
  Droplets,
  Leaf,
  Lightbulb,
  Recycle,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/impact")({
  component: CampusImpactPage,
});

const MONTHLY_IMPACT = [
  { month: "May", points: 180 },
  { month: "Jun", points: 240 },
  { month: "Jul", points: 310 },
  { month: "Aug", points: 390 },
  { month: "Sep", points: 470 },
  { month: "Oct", points: 560 },
];

const ACTIVITIES = [
  {
    icon: CheckCircle2,
    title: "Valid maintenance reports",
    description: "Issues reported and successfully verified",
    value: "8",
    points: "+160",
  },
  {
    icon: Lightbulb,
    title: "Energy-saving actions",
    description: "Verified actions that helped reduce wastage",
    value: "6",
    points: "+120",
  },
  {
    icon: Recycle,
    title: "Sustainability participation",
    description: "Campus sustainability activities completed",
    value: "4",
    points: "+80",
  },
];

function CampusImpactPage() {
  const totalPoints = 560;
  const rank = 27;
  const nextMilestone = 750;
  const progress = Math.min(
    (totalPoints / nextMilestone) * 100,
    100,
  );

  return (
    <main className="relative min-h-[calc(100vh-96px)] overflow-hidden px-5 pb-10 pt-6 md:px-8 lg:px-10">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-yellow-200/30 blur-[120px] dark:bg-yellow-500/10" />

        <div className="absolute right-0 top-20 h-[420px] w-[420px] rounded-full bg-emerald-100/25 blur-[130px] dark:bg-emerald-500/10" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-orange-100/25 blur-[120px] dark:bg-orange-500/10" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#a28a45] dark:text-yellow-400/70">
            Sustainability
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#272521] dark:text-white md:text-4xl">
            Campus Impact
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77736c] dark:text-white/45">
            See how your verified actions contribute to a cleaner,
            safer and more efficient campus.
          </p>
        </div>

        {/* Hero impact card */}
        <section className="relative mb-5 overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/60 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.04] md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#f5bd24]/15 blur-[80px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] bg-[#f5bd24]/15 shadow-inner">
                <Leaf className="h-9 w-9 text-[#d29c00]" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#99948b] dark:text-white/35">
                  Your impact score
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-[#292724] dark:text-white">
                    {totalPoints}
                  </span>

                  <span className="mb-2 text-sm font-medium text-[#888279] dark:text-white/45">
                    points
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#77736c] dark:text-white/45">
                  Rank #{rank} across your campus
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-[#5f5a52] dark:text-white/70">
                  Next milestone
                </span>

                <span className="text-[#8b867e] dark:text-white/40">
                  {totalPoints} / {nextMilestone}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-[#f5bd24] transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] text-[#99948b] dark:text-white/35">
                {nextMilestone - totalPoints} more points to reach your
                next milestone.
              </p>
            </div>
          </div>
        </section>

        {/* Impact metrics */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Zap,
              value: "18.4",
              unit: "kWh",
              label: "Energy saved",
              description: "Estimated from verified actions",
            },
            {
              icon: Droplets,
              value: "420",
              unit: "L",
              label: "Water protected",
              description: "Reported leakage prevented",
            },
            {
              icon: Recycle,
              value: "12",
              unit: "kg",
              label: "Waste diverted",
              description: "Through campus activities",
            },
            {
              icon: Users,
              value: "14",
              unit: "",
              label: "Issues helped resolve",
              description: "Verified campus improvements",
            },
          ].map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-[24px] border border-black/[0.06] bg-white/55 p-5 shadow-[0_14px_45px_rgba(0,0,0,0.04)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.04]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5bd24]/10">
                  <Icon className="h-5 w-5 text-[#d29c00]" />
                </div>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-[#292724] dark:text-white">
                    {metric.value}
                  </span>

                  {metric.unit && (
                    <span className="text-xs font-medium text-[#8b867e] dark:text-white/40">
                      {metric.unit}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm font-medium text-[#4e4a44] dark:text-white/75">
                  {metric.label}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#99948b] dark:text-white/35">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Lower section */}
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Activity */}
          <section className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/55 shadow-[0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.04]">
            <div className="border-b border-black/[0.05] px-6 py-5 dark:border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#292724] dark:text-white">
                    Your contribution
                  </h2>

                  <p className="mt-1 text-xs text-[#807b73] dark:text-white/40">
                    Verified activities contributing to your impact score.
                  </p>
                </div>

                <Sparkles className="h-5 w-5 text-[#d29c00]" />
              </div>
            </div>

            <div>
              {ACTIVITIES.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.title}
                    className={`flex items-center gap-4 px-6 py-5 ${
                      index !== ACTIVITIES.length - 1
                        ? "border-b border-black/[0.05] dark:border-white/[0.06]"
                        : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/[0.035] text-[#706b63] dark:bg-white/[0.05] dark:text-white/55">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#3b3833] dark:text-white/85">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs text-[#8a857d] dark:text-white/40">
                        {activity.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#37342f] dark:text-white/80">
                        {activity.value}
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-[#b08800] dark:text-yellow-400">
                        {activity.points}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Campus ranking */}
          <section className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/55 shadow-[0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.04]">
            <div className="border-b border-black/[0.05] px-6 py-5 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5bd24]/10">
                  <Trophy className="h-5 w-5 text-[#d29c00]" />
                </div>

                <div>
                  <h2 className="text-[15px] font-semibold text-[#292724] dark:text-white">
                    Campus standing
                  </h2>

                  <p className="mt-1 text-xs text-[#807b73] dark:text-white/40">
                    Your current position
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight text-[#292724] dark:text-white">
                  #{rank}
                </span>

                <ArrowUpRight className="mb-2 h-5 w-5 text-emerald-500" />
              </div>

              <p className="mt-2 text-xs leading-5 text-[#807b73] dark:text-white/40">
                You're making a measurable contribution to your campus.
              </p>

              <div className="mt-7 rounded-2xl bg-[#f5bd24]/[0.07] p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#d29c00]" />

                  <div>
                    <p className="text-xs font-semibold text-[#5c4b18] dark:text-yellow-300">
                      Keep going
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-[#8b7a4c] dark:text-white/40">
                      Verified actions increase your impact score.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Monthly trend */}
        <section className="mt-5 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/55 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.04] md:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-[#292724] dark:text-white">
                Impact over time
              </h2>

              <p className="mt-1 text-xs text-[#807b73] dark:text-white/40">
                Your verified contribution points over the last six months.
              </p>
            </div>

            <span className="text-xs font-medium text-[#9b7700] dark:text-yellow-400">
              +{MONTHLY_IMPACT[MONTHLY_IMPACT.length - 1].points -
                MONTHLY_IMPACT[0].points}{" "}
              points
            </span>
          </div>

          <div className="mt-8 flex h-40 items-end gap-3 sm:gap-5">
            {MONTHLY_IMPACT.map((item, index) => {
              const max = Math.max(
                ...MONTHLY_IMPACT.map((entry) => entry.points),
              );

              const height = Math.max(
                (item.points / max) * 100,
                8,
              );

              return (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[10px] text-[#99948b] dark:text-white/35">
                    {item.points}
                  </span>

                  <div className="flex h-[105px] w-full items-end overflow-hidden rounded-xl bg-black/[0.035] dark:bg-white/[0.04]">
                    <div
                      className={`w-full rounded-xl transition-all duration-700 ${
                        index === MONTHLY_IMPACT.length - 1
                          ? "bg-[#f5bd24]"
                          : "bg-[#f5bd24]/45"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>

                  <span className="text-[10px] font-medium text-[#807b73] dark:text-white/40">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <p className="mt-6 text-center text-[11px] text-[#aaa59d] dark:text-white/30">
          Impact points are awarded only for verified campus
          contributions.
        </p>
      </div>
    </main>
  );
}