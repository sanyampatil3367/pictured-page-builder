import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/vyra/shell";

export const Route = createFileRoute("/twin")({
  head: () => ({
    meta: [
      { title: "Campus Digital Twin — VYRA" },
      { name: "description", content: "Explore every building, floor and room of the campus in VYRA's digital twin." },
      { property: "og:title", content: "Campus Digital Twin — VYRA" },
      { property: "og:description", content: "Interactive campus buildings, floors and rooms." },
    ],
  }),
  component: Twin,
});

type Room = { id: string; name: string; x: number; y: number; w: number; h: number; status?: "issue" | "waste" };
type Floor = { id: string; name: string; rooms: Room[]; corridor: [number, number, number, number]; stairs: [number, number] };
type Building = { id: string; name: string; kind: string; pos: [number, number, number, number]; floors: Floor[] };

const BUILDINGS: Building[] = [
  { id: "B-AUR", name: "Aurora Block", kind: "Academic", pos: [40, 40, 220, 120], floors: [
    { id: "AUR-F0", name: "Ground", corridor: [0, 45, 100, 10], stairs: [92, 2], rooms: [
      { id: "AUR-001", name: "Reception", x: 0, y: 0, w: 30, h: 44 }, { id: "AUR-002", name: "Seminar Hall", x: 31, y: 0, w: 60, h: 44 },
      { id: "AUR-003", name: "Cafeteria", x: 0, y: 56, w: 55, h: 44 }, { id: "AUR-004", name: "Store", x: 56, y: 56, w: 44, h: 44 } ] },
    { id: "AUR-F2", name: "Floor 2", corridor: [0, 45, 100, 10], stairs: [92, 2], rooms: [
      { id: "AUR-201", name: "201", x: 0, y: 0, w: 22, h: 44 }, { id: "AUR-202", name: "202", x: 23, y: 0, w: 22, h: 44 },
      { id: "AUR-203", name: "203", x: 46, y: 0, w: 22, h: 44 }, { id: "AUR-204", name: "204", x: 69, y: 0, w: 22, h: 44, status: "waste" },
      { id: "AUR-205", name: "Faculty", x: 0, y: 56, w: 40, h: 44 }, { id: "AUR-206", name: "206", x: 41, y: 56, w: 30, h: 44, status: "issue" }, { id: "AUR-207", name: "WC", x: 72, y: 56, w: 28, h: 44 } ] },
  ] },
  { id: "B-BAN", name: "Banyan Block", kind: "Labs", pos: [300, 30, 160, 170], floors: [
    { id: "BAN-F1", name: "Floor 1", corridor: [45, 0, 10, 100], stairs: [46, 90], rooms: [
      { id: "BAN-101", name: "Physics", x: 0, y: 0, w: 44, h: 32 }, { id: "BAN-102", name: "Chem", x: 0, y: 33, w: 44, h: 32 },
      { id: "BAN-103", name: "Bio", x: 0, y: 66, w: 44, h: 34 }, { id: "BAN-105", name: "CS Lab 105", x: 56, y: 0, w: 44, h: 60, status: "issue" }, { id: "BAN-106", name: "Server", x: 56, y: 61, w: 44, h: 39 } ] },
  ] },
  { id: "B-CED", name: "Cedar Library", kind: "Library", pos: [60, 200, 180, 110], floors: [
    { id: "CED-F0", name: "Ground", corridor: [0, 80, 100, 8], stairs: [2, 90], rooms: [
      { id: "CED-RH", name: "Reading Hall", x: 0, y: 0, w: 70, h: 78 }, { id: "CED-ST", name: "Stacks", x: 71, y: 0, w: 29, h: 78 } ] },
  ] },
  { id: "B-DEL", name: "Delta Hostel", kind: "Residential", pos: [300, 230, 180, 90], floors: [
    { id: "DEL-F3", name: "Floor 3", corridor: [0, 42, 100, 14], stairs: [0, 44], rooms: Array.from({ length: 8 }, (_, i) => ({
      id: `DEL-3${String(i + 1).padStart(2, "0")}`, name: `3${String(i + 1).padStart(2, "0")}`, x: (i % 4) * 25, y: i < 4 ? 0 : 58, w: 24, h: 42,
      status: i === 5 ? ("waste" as const) : undefined })) },
  ] },
];

const fill = (s?: string) => (s === "waste" ? "var(--warning)" : s === "issue" ? "var(--destructive)" : "var(--glass-2)");

function Twin() {
  const [b, setB] = useState<Building | null>(null);
  const [f, setF] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);

  if (!b)
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Campus Digital Twin" sub="Select a building to explore its floors and rooms." />
        <div className="glass-1 rounded-[2rem] p-4">
          <svg viewBox="0 0 520 340" className="w-full">
            <path d="M 0 185 H 520 M 280 0 V 340" stroke="var(--border)" strokeWidth="14" strokeLinecap="round" />
            {BUILDINGS.map((x) => {
              const [px, py, w, h] = x.pos;
              return (
                <g key={x.id} onClick={() => { setB(x); setF(0); setRoom(null); }} className="cursor-pointer [&:hover_rect]:stroke-[var(--gold)]">
                  <rect x={px} y={py} width={w} height={h} rx="16" fill="var(--glass-1)" stroke="var(--glass-edge)" strokeWidth="1.5" className="transition" />
                  <text x={px + 14} y={py + 26} fontSize="13" fontWeight="600" fill="var(--foreground)">{x.name}</text>
                  <text x={px + 14} y={py + 44} fontSize="10" fill="var(--muted-foreground)">{x.id} · {x.kind}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );

  const floor = b.floors[f] ?? b.floors[0]!;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={b.name} sub={`${b.id} · ${b.kind}`} right={
        <button onClick={() => setB(null)} className="glass-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm"><ArrowLeft className="h-3.5 w-3.5" /> Campus</button>} />
      <div className="mb-4 flex gap-2">
        {b.floors.map((fl, i) => (
          <button key={fl.id} onClick={() => { setF(i); setRoom(null); }} className={`rounded-full px-4 py-1.5 text-sm transition ${i === f ? "bg-gold font-medium text-primary-foreground" : "glass-3"}`}>{fl.name}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
        <div className="glass-1 rounded-[2rem] p-5">
          <svg viewBox="-2 -2 104 104" className="w-full">
            <rect x={floor.corridor[0]} y={floor.corridor[1]} width={floor.corridor[2]} height={floor.corridor[3]} fill="var(--muted)" rx="1" />
            {floor.rooms.map((r) => (
              <g key={r.id} onClick={() => setRoom(r)} className="cursor-pointer">
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="2" fill={fill(r.status)} fillOpacity={r.status ? 0.35 : 1}
                  stroke={room?.id === r.id ? "var(--gold-deep)" : "var(--glass-edge)"} strokeWidth={room?.id === r.id ? 0.8 : 0.3} />
                <text x={r.x + r.w / 2} y={r.y + r.h / 2} fontSize="3.2" textAnchor="middle" fill="var(--foreground)">{r.name}</text>
              </g>
            ))}
            <rect x={floor.stairs[0]} y={floor.stairs[1]} width="6" height="6" fill="var(--gold)" rx="1" />
          </svg>
          <p className="mt-2 text-xs text-muted-foreground">Floor ID {floor.id} · gold square = stairs · grey band = corridor</p>
        </div>
        <div className="glass-2 rounded-3xl p-5 text-sm">
          {room ? (
            <>
              <p className="font-mono text-xs text-muted-foreground">{room.id}</p>
              <p className="mt-1 text-lg font-semibold">{room.name}</p>
              <p className="mt-3 text-muted-foreground">{room.status === "waste" ? "Energy wastage detected — light on, room empty." : room.status === "issue" ? "1 open maintenance report." : "All clear."}</p>
            </>
          ) : <p className="text-muted-foreground">Select a room to see its status.</p>}
        </div>
      </div>
    </div>
  );
}
