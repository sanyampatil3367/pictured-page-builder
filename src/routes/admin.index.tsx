import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Package, Sparkles, Zap } from "lucide-react";
import { PageHeader } from "@/components/vyra/shell";
import { Pipeline } from "@/components/vyra/pipeline";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — VYRA" },
      { name: "description", content: "Maintenance, energy and inventory at a glance for campus administrators." },
      { property: "og:title", content: "Admin Overview — VYRA" },
      { property: "og:description", content: "Campus operations overview for administrators." },
    ],
  }),
  component: Admin,
});

const week = [62, 58, 71, 66, 74, 69, 81];

function Admin() {
  const kpis = [["Open tasks", "18", "−3 vs last week"], ["Energy today", "1,284 kWh", "4% under expected"], ["Wastage flagged", "2 rooms", "≈ ₹420/day"], ["Low stock", "3 items", "1 blocking a task"]];
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Campus overview" sub="North Ridge Institute · live" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(([k, v, d]) => (
          <div key={k} className="glass-2 rounded-3xl p-5"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-2 text-2xl font-semibold tracking-tight">{v}</p><p className="mt-1 text-xs text-muted-foreground">{d}</p></div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-1 rounded-[2rem] p-6">
          <p className="text-sm font-medium">Reports resolved · last 7 days</p>
          <div className="mt-6 flex h-40 items-end gap-3">
            {week.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className={`w-full rounded-xl ${i === 6 ? "bg-gold shadow-gold" : "bg-muted"}`} style={{ height: `${v}%` }} />
                <span className="text-[10px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-1 rounded-[2rem] p-6">
          <p className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4 text-gold-deep" /> AI insights</p>
          <div className="mt-4 space-y-3 text-sm">
            <Insight to="/admin/energy" icon={Zap} t="Room 204 is 25% over expected energy" />
            <Insight to="/admin/inventory" icon={Package} t="Capacitor out of stock — 1 task blocked" />
            <Insight to="/admin/energy" icon={AlertTriangle} t="Unexpected occupancy in Lab 105 (18 people, no class)" />
          </div>
        </div>
      </div>
      <div className="glass-2 mt-4 rounded-[2rem] p-6">
        <p className="text-sm font-medium">VY-2041 · Ceiling fan · Aurora 204</p>
        <Pipeline stage={3} waiting />
      </div>
    </div>
  );
}

function Insight({ to, icon: I, t }: { to: "/admin/energy" | "/admin/inventory"; icon: typeof Zap; t: string }) {
  return (
    <Link to={to} className="glass-3 flex items-center gap-3 rounded-2xl p-3 transition hover:bg-accent">
      <I className="h-4 w-4 shrink-0" /><span className="flex-1">{t}</span><ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
    </Link>
  );
}
