import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/vyra/shell";
import { Pipeline } from "@/components/vyra/pipeline";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "My Reports — VYRA" },
      { name: "description", content: "Track every campus issue you reported, from analysis to verification." },
      { property: "og:title", content: "My Reports — VYRA" },
      { property: "og:description", content: "Track your campus issue reports in VYRA." },
    ],
  }),
  component: Reports,
});

const REPORTS = [
  { id: "VY-2041", t: "Broken ceiling fan", loc: "Aurora · Room 204", stage: 3, waiting: true },
  { id: "VY-2032", t: "Leaking tap", loc: "Cedar Library · Ground", stage: 5 },
  { id: "VY-2017", t: "Flickering tube light", loc: "Banyan · Lab 105", stage: 8 },
];

function Reports() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="My Reports" sub="Every issue you've raised, and where it is now." />
      <div className="space-y-4">
        {REPORTS.map((r) => (
          <div key={r.id} className="glass-2 rounded-3xl p-5">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <p className="font-medium">{r.t}</p>
              <p className="text-sm text-muted-foreground">{r.loc}</p>
              <span className="ml-auto font-mono text-xs text-muted-foreground">{r.id}</span>
            </div>
            <Pipeline stage={r.stage} waiting={!!r.waiting} />
          </div>
        ))}
      </div>
    </div>
  );
}
