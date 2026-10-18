import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/vyra/shell";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability & Impact — VYRA" },
      { name: "description", content: "See your verified contribution to a more sustainable campus." },
      { property: "og:title", content: "Sustainability & Impact — VYRA" },
      { property: "og:description", content: "Your verified campus sustainability impact." },
    ],
  }),
  component: Sustain,
});

function Sustain() {
  const stats = [["Verified reports", "12"], ["Sustainability actions", "5"], ["Contribution points", "240"], ["Energy saved via your reports", "61 kWh"]];
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Campus Impact" sub="Points only count after a report is verified on site." />
      <div className="glass-1 rounded-[2rem] p-8 text-center">
        <p className="text-sm text-muted-foreground">Campus sustainability score</p>
        <p className="text-gold-gradient mt-2 text-7xl font-semibold tracking-tight">82</p>
        <p className="mt-2 text-sm text-muted-foreground">+4 this month · 9% below expected energy use</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="glass-3 rounded-2xl p-4"><p className="text-xl font-semibold">{v}</p><p className="mt-1 text-xs text-muted-foreground">{k}</p></div>
        ))}
      </div>
    </div>
  );
}
