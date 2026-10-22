import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

type ReportStatus =
  | "Reported"
  | "AI Analysed"
  | "Assigned"
  | "Scheduled"
  | "In Progress"
  | "Waiting for Material"
  | "Completed"
  | "Verified"
  | "Closed";

type ReportPriority = "Low" | "Medium" | "High" | "Critical";

type Report = {
  id: string;
  title: string;
  category: string;
  priority: ReportPriority;
  status: ReportStatus;
  location: string;
  reportedAt: string;
  assignedTo: string;
  workerType: string;
  material: string;
  aiConfidence: number;
  aiSummary: string;
  points: number;
  icon: ReactNode;
};

const REPORTS: Report[] = [
  {
    id: "VYR-1048",
    title: "Ceiling fan not working",
    category: "Electrical",
    priority: "High",
    status: "In Progress",
    location: "Block A · Room 204",
    reportedAt: "Today · 10:42 AM",
    assignedTo: "Ramesh Kumar",
    workerType: "Electrician",
    material: "Capacitor",
    aiConfidence: 96,
    aiSummary:
      "The uploaded image indicates a ceiling fan that is not operating. The likely cause is an electrical or capacitor-related fault.",
    points: 15,
    icon: <Zap size={17} />,
  },
  {
    id: "VYR-1042",
    title: "Water leakage near wash basin",
    category: "Plumbing",
    priority: "Medium",
    status: "Scheduled",
    location: "Block B · Ground Floor Washroom",
    reportedAt: "Yesterday · 3:18 PM",
    assignedTo: "Prakash",
    workerType: "Plumber",
    material: "Tap washer",
    aiConfidence: 93,
    aiSummary:
      "Visible water accumulation around the wash basin suggests a plumbing leak requiring inspection.",
    points: 10,
    icon: <Wrench size={17} />,
  },
  {
    id: "VYR-1036",
    title: "Broken classroom chair",
    category: "Furniture",
    priority: "Low",
    status: "Verified",
    location: "Block A · Room 108",
    reportedAt: "Oct 17, 2026 · 11:06 AM",
    assignedTo: "Furniture Maintenance",
    workerType: "Maintenance",
    material: "Replacement joint",
    aiConfidence: 98,
    aiSummary:
      "The chair has a visibly damaged structural joint and requires a simple furniture repair.",
    points: 10,
    icon: <Wrench size={17} />,
  },
  {
    id: "VYR-1029",
    title: "Exposed electrical wire",
    category: "Electrical",
    priority: "Critical",
    status: "Completed",
    location: "Block C · Lab 302",
    reportedAt: "Oct 16, 2026 · 2:51 PM",
    assignedTo: "Suresh",
    workerType: "Electrician",
    material: "Insulation tape",
    aiConfidence: 99,
    aiSummary:
      "An exposed electrical conductor presents an immediate safety hazard. The issue was correctly classified as critical.",
    points: 20,
    icon: <AlertTriangle size={17} />,
  },
  {
    id: "VYR-1027",
    title: "Classroom light not working",
    category: "Electrical",
    priority: "Medium",
    status: "Waiting for Material",
    location: "Block A · Room 116",
    reportedAt: "Oct 15, 2026 · 9:45 AM",
    assignedTo: "Electrical Team",
    workerType: "Electrician",
    material: "LED tube",
    aiConfidence: 95,
    aiSummary:
      "The light fixture appears faulty and requires replacement. The required LED tube is currently unavailable in inventory.",
    points: 10,
    icon: <Zap size={17} />,
  },
];

const PIPELINE: ReportStatus[] = [
  "Reported",
  "AI Analysed",
  "Assigned",
  "Scheduled",
  "In Progress",
  "Completed",
  "Verified",
  "Closed",
];

function priorityClasses(priority: ReportPriority) {
  switch (priority) {
    case "Critical":
      return "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-300";
    case "High":
      return "border-orange-500/25 bg-orange-500/10 text-orange-600 dark:text-orange-300";
    case "Medium":
      return "border-yellow-500/25 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";
    default:
      return "border-border bg-muted/60 text-muted-foreground";
  }
}

function statusClasses(status: ReportStatus) {
  switch (status) {
    case "Completed":
    case "Verified":
    case "Closed":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";

    case "In Progress":
      return "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-300";

    case "Waiting for Material":
      return "border-orange-500/25 bg-orange-500/10 text-orange-600 dark:text-orange-300";

    case "Scheduled":
      return "border-yellow-500/25 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";

    default:
      return "border-border bg-muted/60 text-muted-foreground";
  }
}

function getProgressIndex(status: ReportStatus) {
  if (status === "Waiting for Material") {
    return 4;
  }

  return PIPELINE.indexOf(status);
}

function ReportsPage() {
  const [filter, setFilter] = useState<
    "All" | "Active" | "Completed" | "Critical"
  >("All");

  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return REPORTS.filter((report) => {
      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Active"
            ? !["Completed", "Verified", "Closed"].includes(report.status)
            : filter === "Completed"
              ? ["Completed", "Verified", "Closed"].includes(report.status)
              : report.priority === "Critical";

      const matchesSearch =
        !query ||
        [
          report.id,
          report.title,
          report.category,
          report.location,
          report.status,
          report.assignedTo,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const activeCount = REPORTS.filter(
    (report) => !["Completed", "Verified", "Closed"].includes(report.status)
  ).length;

  const verifiedPoints = REPORTS.reduce(
    (total, report) =>
      ["Verified", "Completed", "Closed"].includes(report.status)
        ? total + report.points
        : total,
    0
  );

  return (
    <div className="min-h-full px-4 py-5 text-foreground md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px] space-y-5">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/75 p-6 shadow-xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-yellow-300/15 blur-3xl dark:bg-yellow-300/10" />
          <div className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl dark:bg-amber-400/[0.06]" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-600 dark:text-yellow-300">
                <Wrench size={14} />
                Maintenance Reports
              </div>

              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                My Reports
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Track every issue you report from AI analysis through
                maintenance, verification, and closure.
              </p>
            </div>

            <div className="flex gap-3">
              <SummaryCard
                label="Active"
                value={activeCount}
                icon={<Clock3 size={14} />}
              />

              <SummaryCard
                label="Verified Points"
                value={`+${verifiedPoints}`}
                icon={<ShieldCheck size={14} />}
                positive
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filter === "All"}
              onClick={() => setFilter("All")}
            >
              All
            </FilterButton>

            <FilterButton
              active={filter === "Active"}
              onClick={() => setFilter("Active")}
            >
              Active
            </FilterButton>

            <FilterButton
              active={filter === "Completed"}
              onClick={() => setFilter("Completed")}
            >
              Completed
            </FilterButton>

            <FilterButton
              active={filter === "Critical"}
              onClick={() => setFilter("Critical")}
            >
              Critical
            </FilterButton>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reports..."
              className="h-10 w-full rounded-xl border border-border bg-card/70 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-yellow-400/50"
            />
          </div>
        </section>

        {/* Reports */}
        <section className="space-y-3">
          {filteredReports.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card/70 p-12 text-center shadow-lg backdrop-blur-xl">
              <Filter size={28} className="mx-auto text-muted-foreground/60" />

              <h2 className="mt-4 text-sm font-semibold">
                No reports found
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Try changing the filter or search term.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            ))
          )}
        </section>
      </div>

      {/* Details modal */}
      {selectedReport && (
        <ReportDetails
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  positive = false,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  positive?: boolean;
}) {
  return (
    <div className="min-w-[112px] rounded-2xl border border-border bg-card/70 px-4 py-3 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[9px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 text-lg font-semibold ${
          positive ? "text-emerald-600 dark:text-emerald-300" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-xs font-medium transition ${
        active
          ? "border-yellow-400/40 bg-yellow-300/15 text-yellow-700 dark:text-yellow-200"
          : "border-border bg-card/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ReportCard({
  report,
  onClick,
}: {
  report: Report;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-3xl border border-border bg-card/70 p-4 text-left shadow-lg backdrop-blur-xl transition hover:border-yellow-400/25 hover:bg-card md:p-5"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-yellow-600 dark:text-yellow-300">
          {report.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              {report.title}
            </h2>

            <span
              className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${priorityClasses(
                report.priority
              )}`}
            >
              {report.priority}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <span>{report.id}</span>
            <span>•</span>
            <span>{report.location}</span>
            <span>•</span>
            <span>{report.reportedAt}</span>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <div className="text-right">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[9px] font-medium ${statusClasses(
                report.status
              )}`}
            >
              {report.status}
            </span>

            <p className="mt-2 text-[10px] text-muted-foreground">
              {report.workerType}
            </p>
          </div>

          <ChevronRight
            size={17}
            className="text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between sm:hidden">
        <span
          className={`rounded-full border px-3 py-1 text-[9px] font-medium ${statusClasses(
            report.status
          )}`}
        >
          {report.status}
        </span>

        <ChevronRight size={16} className="text-muted-foreground/50" />
      </div>
    </button>
  );
}

function ReportDetails({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  const progressIndex = getProgressIndex(report.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-md dark:bg-black/60"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-2xl md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-yellow-600 dark:text-yellow-300">
              {report.icon}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {report.title}
                </h2>

                <span
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${priorityClasses(
                    report.priority
                  )}`}
                >
                  {report.priority}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {report.id} · {report.location}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Pipeline */}
        <div className="mt-7">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Maintenance Pipeline
          </p>

          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-[720px] items-center">
              {PIPELINE.map((stage, index) => {
                const complete = index <= progressIndex;

                return (
                  <div key={stage} className="flex flex-1 items-center">
                    <div className="flex min-w-0 flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-semibold ${
                          complete
                            ? "border-yellow-400/40 bg-yellow-300/15 text-yellow-700 dark:text-yellow-200"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <span
                        className={`mt-2 whitespace-nowrap text-[8px] ${
                          complete
                            ? "text-foreground"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {stage}
                      </span>
                    </div>

                    {index < PIPELINE.length - 1 && (
                      <div
                        className={`mx-1 h-px flex-1 ${
                          index < progressIndex
                            ? "bg-yellow-400/50"
                            : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {report.status === "Waiting for Material" && (
            <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-xs text-orange-700 dark:text-orange-200">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle size={14} />
                Waiting for material
              </div>

              <p className="mt-1 text-orange-700/70 dark:text-orange-200/60">
                Required material: {report.material}. The task will return to
                scheduling when inventory is replenished.
              </p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <DetailCard label="Location" value={report.location} />
          <DetailCard label="Assigned Worker" value={report.assignedTo} />
          <DetailCard label="Worker Type" value={report.workerType} />
          <DetailCard label="Required Material" value={report.material} />
          <DetailCard
            label="AI Confidence"
            value={`${report.aiConfidence}%`}
          />
          <DetailCard
            label="Verified Points"
            value={`+${report.points}`}
          />
        </div>

        {/* AI summary */}
        <div className="mt-5 rounded-2xl border border-yellow-400/15 bg-yellow-300/[0.06] p-4">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-200">
            <Sparkles size={15} />
            <span className="text-xs font-semibold">AI Analysis</span>
          </div>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {report.aiSummary}
          </p>
        </div>

        {/* Verification */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.05] p-4">
          <CheckCircle2
            size={17}
            className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-300"
          />

          <div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-200">
              Points are awarded only after verification
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              VYRA does not award or deduct points based only on an AI
              prediction. A report must pass the appropriate verification
              stage first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}