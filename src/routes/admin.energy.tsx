import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Lightbulb, LightbulbOff, Users } from "lucide-react";
import { PageHeader } from "@/components/vyra/shell";

export const Route = createFileRoute("/admin/energy")({
  head: () => ({
    meta: [
      { title: "Energy & Sustainability — VYRA" },
      { name: "description", content: "Expected vs actual energy use across rooms, floors and buildings, with smart light control." },
      { property: "og:title", content: "Energy & Sustainability — VYRA" },
      { property: "og:description", content: "Expected vs actual campus energy intelligence." },
    ],
  }),
  component: Energy,
});

const LEVELS = {
  Room: { name: "Room 204", exp: 6.7, act: 8.4, unit: "kWh/day" },
  Floor: { name: "Aurora · Floor 2", exp: 54, act: 61, unit: "kWh/day" },
  Building: { name: "Aurora Block", exp: 310, act: 298, unit: "kWh/day" },
  Campus: { name: "Main Campus", exp: 1340, act: 1284, unit: "kWh/day" },
};

function Energy() {
  const [lvl, setLvl] = useState<keyof typeof LEVELS>("Room");
  const d = LEVELS[lvl];
  const excess = Math.round(((d.act - d.exp) / d.exp) * 100);
  const max = Math.max(d.exp, d.act);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Energy intelligence" sub="Expected vs actual, at every level." right={
        <div className="glass-3 flex rounded-full p-1">{(Object.keys(LEVELS) as (keyof typeof LEVELS)[]).map((k) => (
          <button key={k} onClick={() => setLvl(k)} className={`rounded-full px-3 py-1 text-sm ${k === lvl ? "bg-gold font-medium text-primary-foreground" : "text-muted-foreground"}`}>{k}</button>))}
        </div>} />
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass-1 rounded-[2rem] p-6">
          <p className="text-sm text-muted-foreground">{d.name}</p>
          <div className="mt-6 space-y-5">
            {[["Expected", d.exp, "bg-muted-foreground/30"], ["Actual", d.act, "bg-gold shadow-gold"]].map(([k, v, c]) => (
              <div key={k as string}>
                <div className="flex justify-between text-sm"><span>{k}</span><span className="font-mono">{v} {d.unit}</span></div>
                <div className="mt-2 h-3 rounded-full bg-muted"><div className={`h-3 rounded-full transition-all duration-700 ${c}`} style={{ width: `${((v as number) / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
            <Stat k={excess > 0 ? "Excess" : "Saved"} v={`${Math.abs(excess)}%`} hot={excess > 0} />
            <Stat k="Est. cost" v={`₹${Math.round(d.act * 8)}`} />
            <Stat k="CO₂" v={`${(d.act * 0.71).toFixed(1)} kg`} />
          </div>
          {excess > 0 && <p className="mt-6 text-sm text-muted-foreground"><span className="font-medium text-foreground">Possible cause:</span> equipment running outside scheduled hours. <span className="font-medium text-foreground">Recommendation:</span> inspect equipment / enable automatic shutdown.</p>}
        </div>
        <div className="space-y-4">
          <LightCard room="Room 204" occ={0} source="CCTV (anonymous count)" />
          <LightCard room="Lab 105" occ={18} source="Occupancy sensor" />
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v, hot }: { k: string; v: string; hot?: boolean }) {
  return <div className="glass-3 rounded-2xl p-3"><p className="text-[11px] text-muted-foreground">{k}</p><p className={`mt-0.5 text-lg font-semibold ${hot ? "text-gold-gradient" : ""}`}>{v}</p></div>;
}

function LightCard({ room, occ, source }: { room: string; occ: number; source: string }) {
  const [on, setOn] = useState(true);
  const [msg, setMsg] = useState("");
  const waste = on && occ === 0;
  return (
    <div className="glass-1 rounded-[2rem] p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold tracking-wide">{room.toUpperCase()}</p>
        {on ? <Lightbulb className="h-5 w-5 text-gold-deep" /> : <LightbulbOff className="h-5 w-5 text-muted-foreground" />}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Class</dt><dd>No scheduled class</dd>
        <dt className="text-muted-foreground">Occupancy</dt><dd className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {occ}</dd>
        <dt className="text-muted-foreground">Source</dt><dd className="text-xs">{source}</dd>
        <dt className="text-muted-foreground">Light</dt><dd className="font-medium">{on ? "ON" : "OFF"} <span className="text-muted-foreground">· expected OFF</span></dd>
      </dl>
      <p className={`mt-3 rounded-xl px-3 py-2 text-xs font-medium ${waste ? "bg-warning/20" : occ > 0 && on ? "bg-accent" : "bg-success/15"}`}>
        {waste ? "ENERGY WASTAGE DETECTED" : occ > 0 && on ? "Unexpected occupancy detected — not switching off automatically." : "All good"}
      </p>
      {waste && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => { setOn(false); setMsg("Light switched off successfully."); }} className="bg-gold rounded-xl py-2 text-sm font-semibold text-primary-foreground">Turn OFF Light</button>
          <button onClick={() => setMsg("Worker notified.")} className="glass-2 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm"><Bell className="h-3.5 w-3.5" /> Notify Worker</button>
        </div>
      )}
      {msg && <p className="animate-rise mt-2 text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}
