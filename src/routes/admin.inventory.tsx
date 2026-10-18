import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/vyra/shell";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory & Procurement — VYRA" },
      { name: "description", content: "Track materials and approve procurement requests VYRA raises for blocked tasks." },
      { property: "og:title", content: "Inventory & Procurement — VYRA" },
      { property: "og:description", content: "Campus stock levels and procurement approvals." },
    ],
  }),
  component: Inventory,
});

const STOCK = [
  { m: "Capacitor 2.5µF", cat: "Electrician", q: 0, min: 5 },
  { m: "LED tube 20W", cat: "Electrician", q: 14, min: 10 },
  { m: "Tap washer", cat: "Plumber", q: 3, min: 8 },
  { m: "Wood screws (box)", cat: "Carpenter", q: 22, min: 5 },
];
const FLOW = ["Pending", "Approved", "Ordered", "Received"];

function Inventory() {
  const [st, setSt] = useState(0);
  const [rejected, setRejected] = useState(false);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Inventory & procurement" sub="VYRA raises requests — spending always needs your decision." />
      <div className="glass-1 overflow-x-auto rounded-[2rem] p-2">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground"><tr><th className="p-3 font-normal">Material</th><th className="p-3 font-normal">Category</th><th className="p-3 font-normal">Stock</th><th className="p-3 font-normal" /></tr></thead>
          <tbody>
            {STOCK.map((s) => {
              const q = s.m.startsWith("Capacitor") && st === 3 ? 20 : s.q;
              return (
                <tr key={s.m} className="border-t">
                  <td className="p-3 font-medium">{s.m}</td><td className="p-3 text-muted-foreground">{s.cat}</td><td className="p-3 font-mono">{q}</td>
                  <td className="p-3 text-right">{q < s.min && <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs">Low stock</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="glass-2 mt-4 rounded-[2rem] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-medium">PR-118 · Capacitor 2.5µF × 20 · est. ₹1,400</p>
          <p className="text-xs text-muted-foreground">For task VY-2041 (Aurora 204)</p>
        </div>
        <div className="mt-4 flex gap-1">{FLOW.map((f, i) => (
          <div key={f} className="flex-1"><div className={`h-1.5 rounded-full ${rejected ? "bg-destructive/40" : i <= st ? "bg-gold" : "bg-muted"}`} /><p className="mt-1.5 text-[11px] text-muted-foreground">{f}</p></div>))}
        </div>
        <p className="mt-3 text-sm">{rejected ? "Rejected — task stays waiting for material." : st === 3 ? "Inventory updated. Task VY-2041 is ready for scheduling." : "Task status: WAITING FOR MATERIAL"}</p>
        {!rejected && st < 3 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setSt(st + 1)} className="bg-gold rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold">
              {st === 0 ? "Approve" : st === 1 ? "Mark ordered" : "Mark received"}
            </button>
            {st === 0 && <button className="glass-3 rounded-xl px-4 py-2 text-sm">Edit</button>}
            {st === 0 && <button onClick={() => setRejected(true)} className="glass-3 rounded-xl px-4 py-2 text-sm">Reject</button>}
          </div>
        )}
      </div>
    </div>
  );
}
