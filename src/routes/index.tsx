import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  Leaf,
  MapPin,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ReportFlow } from "@/components/vyra/report-flow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VYRA — Student Dashboard" },
      {
        name: "description",
        content:
          "VYRA intelligent campus operations for students.",
      },
    ],
  }),
  component: StudentHome,
});

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StudentHome() {
  const [reportOpen, setReportOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="w-full">
      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      {/*
       * The VYRA shell/header occupies roughly 4.5rem of the viewport.
       *
       * Therefore the hero gets exactly the remaining viewport height.
       * This keeps the hero CONTENT vertically centered without adding
       * artificial blank space.
       *
       * Campus Activity starts immediately after this viewport.
       */}

      <section className="box-border flex min-h-[calc(100dvh-4.5rem)] w-full items-center justify-center px-4 py-8 md:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          {/* Greeting */}

          <p className="text-sm text-muted-foreground">
            {greeting}, Ratnesh.
          </p>

          {/* Main heading */}

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            How can VYRA help you today?
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            See something wrong on campus? Capture it and let VYRA
            understand, route and track it for you.
          </p>

          {/* ============================================================ */}
          {/* REPORT ISSUE                                                  */}
          {/* ============================================================ */}

          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="group relative mt-9 w-full max-w-md rounded-[2.5rem] p-2 transition duration-500 hover:-translate-y-1 active:scale-[.98] active:duration-150 md:mt-10"
          >
            <span className="bg-gold animate-breathe absolute inset-6 -z-10 rounded-full opacity-60 blur-3xl transition group-hover:opacity-100" />

            <span className="glass-1 absolute inset-0 rounded-[2.5rem]" />

            <span className="bg-gold sweep relative flex flex-col items-center gap-3 rounded-[2rem] px-8 py-9 text-primary-foreground shadow-gold md:py-10">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-background/25 backdrop-blur transition group-hover:scale-105">
                <Camera
                  className="h-7 w-7"
                  strokeWidth={1.75}
                />
              </span>

              <span className="text-2xl font-semibold tracking-tight">
                Report an Issue
              </span>

              <span className="text-sm opacity-75">
                Capture a problem and let VYRA analyze it.
              </span>
            </span>
          </button>

          {/* ============================================================ */}
          {/* STATUS                                                        */}
          {/* ============================================================ */}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground md:mt-9">
            <Link
              to="/reports"
              className="glass-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:text-foreground"
            >
              <span className="bg-gold h-1.5 w-1.5 rounded-full" />

              3 active reports

              <ArrowRight className="h-3 w-3" />
            </Link>

            <Link
              to="/sustainability"
              className="glass-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:text-foreground"
            >
              <Leaf className="h-3 w-3" />

              240 impact points

              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CAMPUS ACTIVITY                                                   */}
      {/* ================================================================== */}

      <section className="w-full px-4 pb-20 pt-8 md:px-6 md:pb-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Your Campus Activity
            </p>

            <div className="mt-1 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Stay in the loop
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Things happening around your campus that VYRA
                  thinks you may care about.
                </p>
              </div>

              <Link
                to="/reports"
                className="hidden items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground sm:flex"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ACTIVITY GRID                                                 */}
          {/* ============================================================ */}

          <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
            <div className="glass-1 overflow-hidden rounded-[2rem]">
              <div className="border-b px-5 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <span className="glass-3 grid h-9 w-9 place-items-center rounded-xl">
                    <Wrench className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      Your active reports
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Track what is happening with your reports.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y">
                <ActivityRow
                  icon={<Wrench className="h-4 w-4" />}
                  title="Ceiling fan issue · VY-2048"
                  location="Aurora Block · Room 204"
                  status="In progress"
                  progress="72% complete"
                  progressWidth="72%"
                />

                <ActivityRow
                  icon={<Zap className="h-4 w-4" />}
                  title="Leaking tap · VY-2031"
                  location="Banyan Block · Floor 1"
                  status="Assigned"
                  progress="38% complete"
                  progressWidth="38%"
                />

                <ActivityRow
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Broken classroom chair · VY-2017"
                  location="Aurora Block · Room 118"
                  status="Verified"
                  progress="Completed"
                  progressWidth="100%"
                />
              </div>
            </div>

            {/* Recent campus activity */}

            <div className="glass-1 rounded-[2rem]">
              <div className="border-b px-5 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <span className="glass-3 grid h-9 w-9 place-items-center rounded-xl">
                    <Sparkles className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      Recent campus activity
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Things VYRA thinks you may care about.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 p-3">
                <ActivityNotice
                  icon={<Zap className="h-4 w-4" />}
                  title="Energy usage is down"
                  description="Your campus used 8% less electricity than yesterday."
                />

                <ActivityNotice
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Report verified"
                  description="Your broken chair report was verified by campus staff."
                />

                <ActivityNotice
                  icon={<Leaf className="h-4 w-4" />}
                  title="Campus impact improved"
                  description="Your campus sustainability score increased this week."
                />

                <ActivityNotice
                  icon={<Clock3 className="h-4 w-4" />}
                  title="Maintenance scheduled"
                  description="A maintenance visit has been scheduled for your report."
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* IMPACT                                                        */}
          {/* ============================================================ */}

          <div className="glass-1 mt-4 rounded-[2rem] p-5 md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="bg-gold/15 grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                  <Leaf className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    Your campus impact
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your verified contributions help make the campus
                    safer, cleaner and more efficient.
                  </p>
                </div>
              </div>

              <Link
                to="/sustainability"
                className="glass-3 flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition hover:bg-accent"
              >
                View impact
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <ImpactStat
                value="240"
                label="Impact points"
              />

              <ImpactStat
                value="3"
                label="Reports submitted"
              />

              <ImpactStat
                value="82/100"
                label="Campus score"
              />
            </div>
          </div>

          <Link
            to="/reports"
            className="mt-5 flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground sm:hidden"
          >
            View all activity
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ================================================================== */}
      {/* REPORT FLOW                                                        */}
      {/* ================================================================== */}

      {reportOpen && (
        <ReportFlow
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  );
}

/* ========================================================================== */
/* ACTIVITY ROW                                                               */
/* ========================================================================== */

function ActivityRow({
  icon,
  title,
  location,
  status,
  progress,
  progressWidth,
}: {
  icon: React.ReactNode;
  title: string;
  location: string;
  status: string;
  progress: string;
  progressWidth: string;
}) {
  return (
    <div className="flex gap-4 px-5 py-4 md:px-6">
      <span className="glass-3 mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground">
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {title}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-xs font-medium">
              {status}
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              {progress}
            </p>
          </div>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted/40">
          <div
            className="bg-gold h-full rounded-full"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* ACTIVITY NOTICE                                                            */
/* ========================================================================== */

function ActivityNotice({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl px-3 py-3 transition hover:bg-accent/40">
      <span className="glass-3 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* IMPACT STAT                                                                */
/* ========================================================================== */

function ImpactStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="glass-3 rounded-2xl px-4 py-4">
      <p className="text-xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  );
}