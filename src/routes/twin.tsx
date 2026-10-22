import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  DoorOpen,
  Layers3,
  Map,
  Sparkles,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/vyra/shell";
import {
  DEMO_CAMPUS,
  type Building,
  type Campus,
  type Floor,
  type Room,
} from "../lib/campus-data";

export const Route = createFileRoute("/twin")({
  head: () => ({
    meta: [
      { title: "Campus Digital Twin — VYRA" },
      {
        name: "description",
        content:
          "Explore every building, floor and room of the campus in VYRA's digital twin.",
      },
      {
        property: "og:title",
        content: "Campus Digital Twin — VYRA",
      },
      {
        property: "og:description",
        content: "Interactive campus buildings, floors and rooms.",
      },
    ],
  }),
  component: Twin,
});

const CAMPUS_STORAGE_KEY = "vyra-campus-config";

function loadCampus(): Campus {
  if (typeof window === "undefined") {
    return DEMO_CAMPUS;
  }

  try {
    const stored = localStorage.getItem(CAMPUS_STORAGE_KEY);

    if (!stored) {
      return DEMO_CAMPUS;
    }

    const parsed = JSON.parse(stored) as Campus;

    if (
      !parsed ||
      !Array.isArray(parsed.buildings) ||
      parsed.buildings.length === 0
    ) {
      return DEMO_CAMPUS;
    }

    return parsed;
  } catch {
    return DEMO_CAMPUS;
  }
}

function Twin() {
  const [campus] = useState<Campus>(() => loadCampus());
  const [selectedBuilding, setSelectedBuilding] =
    useState<Building | null>(null);
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const stats = useMemo(() => {
    const buildings = campus.buildings ?? [];

    const floors = buildings.reduce(
      (total, building) => total + building.floors.length,
      0
    );

    const rooms = buildings.reduce(
      (total, building) =>
        total +
        building.floors.reduce(
          (floorTotal, floor) => floorTotal + floor.rooms.length,
          0
        ),
      0
    );

    return {
      buildings: buildings.length,
      floors,
      rooms,
    };
  }, [campus]);

  function openBuilding(building: Building) {
    setSelectedBuilding(building);
    setSelectedFloorIndex(0);
    setSelectedRoom(null);
  }

  function closeBuilding() {
    setSelectedBuilding(null);
    setSelectedRoom(null);
  }

  if (!selectedBuilding) {
    return (
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 md:px-6 lg:px-8">
        <PageHeader
          title="Campus Digital Twin"
          sub="Explore your campus structure, buildings, floors and rooms."
        />

        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/75 p-5 shadow-xl backdrop-blur-2xl md:p-6">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-yellow-300/15 blur-3xl dark:bg-yellow-300/10" />

          <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
                  <Map size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-300">
                    Live Campus Model
                  </p>

                  <h2 className="mt-0.5 text-lg font-semibold">
                    {campus.name}
                  </h2>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">
                This digital twin is generated from the campus structure
                configured by the administrator. Buildings, floors and rooms
                are not manually hard-coded into the visualization.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MiniStat
                icon={<Building2 size={14} />}
                value={stats.buildings}
                label="Buildings"
              />

              <MiniStat
                icon={<Layers3 size={14} />}
                value={stats.floors}
                label="Floors"
              />

              <MiniStat
                icon={<DoorOpen size={14} />}
                value={stats.rooms}
                label="Rooms"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card/70 p-4 shadow-lg backdrop-blur-xl md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Campus Layout
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Select a building
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-[10px] text-muted-foreground sm:flex">
              <Sparkles
                size={13}
                className="text-yellow-600 dark:text-yellow-300"
              />
              Automatically generated
            </div>
          </div>

          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns:
                campus.buildings.length <= 2
                  ? "repeat(auto-fit, minmax(260px, 1fr))"
                  : "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {campus.buildings.map((building, index) => (
              <BuildingCard
                key={building.id}
                building={building}
                index={index}
                onClick={() => openBuilding(building)}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  const floor =
    selectedBuilding.floors[selectedFloorIndex] ??
    selectedBuilding.floors[0];

  if (!floor) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-5">
        <PageHeader
          title={selectedBuilding.name}
          sub="No floors have been configured for this building yet."
          right={
            <button
              type="button"
              onClick={closeBuilding}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Campus
            </button>
          }
        />

        <div className="rounded-3xl border border-border bg-card/70 p-10 text-center shadow-lg backdrop-blur-xl">
          <Layers3
            size={30}
            className="mx-auto text-muted-foreground/60"
          />

          <p className="mt-4 text-sm font-medium">
            Floor structure not configured
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add floors from the Campus Setup screen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 md:px-6 lg:px-8">
      <PageHeader
        title={selectedBuilding.name}
        sub={`${selectedBuilding.code} · ${
          selectedBuilding.description || "Campus building"
        }`}
        right={
          <button
            type="button"
            onClick={closeBuilding}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Campus
          </button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <MiniStat
          icon={<Building2 size={15} />}
          value={selectedBuilding.floors.length}
          label="Floors"
        />

        <MiniStat
          icon={<DoorOpen size={15} />}
          value={selectedBuilding.floors.reduce(
            (total, currentFloor) => total + currentFloor.rooms.length,
            0
          )}
          label="Rooms"
        />

        <MiniStat
          icon={<Users size={15} />}
          value={selectedBuilding.floors.reduce(
            (total, currentFloor) =>
              total +
              currentFloor.rooms.reduce(
                (roomTotal, room) => roomTotal + room.capacity,
                0
              ),
            0
          )}
          label="Capacity"
        />
      </section>

      <section className="flex gap-2 overflow-x-auto pb-1">
        {selectedBuilding.floors.map((currentFloor, index) => (
          <button
            key={currentFloor.id}
            type="button"
            onClick={() => {
              setSelectedFloorIndex(index);
              setSelectedRoom(null);
            }}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition ${
              index === selectedFloorIndex
                ? "border-yellow-400/40 bg-yellow-300/15 text-yellow-700 dark:text-yellow-200"
                : "border-border bg-card/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {currentFloor.name}
          </button>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-[2rem] border border-border bg-card/70 p-4 shadow-lg backdrop-blur-xl md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Floor Plan
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                {floor.name}
              </h2>
            </div>

            <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-[9px] text-muted-foreground">
              {floor.rooms.length} rooms
            </span>
          </div>

          <DynamicFloorPlan
            floor={floor}
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
          />

          <p className="mt-4 text-[10px] leading-5 text-muted-foreground">
            Select any room to view its details. Room positions are generated
            automatically from the configured room structure.
          </p>
        </div>

        <RoomDetails room={selectedRoom} />
      </section>
    </div>
  );
}

function BuildingCard({
  building,
  index,
  onClick,
}: {
  building: Building;
  index: number;
  onClick: () => void;
}) {
  const roomCount = building.floors.reduce(
    (total, floor) => total + floor.rooms.length,
    0
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-5 text-left shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-yellow-400/30 hover:bg-card"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-300/10 blur-3xl"
        style={{
          opacity: 0.35 + (index % 3) * 0.15,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
            <Building2 size={18} />
          </div>

          <ChevronRight
            size={17}
            className="text-muted-foreground/50 transition group-hover:translate-x-1 group-hover:text-foreground"
          />
        </div>

        <h3 className="mt-5 text-base font-semibold">
          {building.name}
        </h3>

        <p className="mt-1 text-[10px] text-muted-foreground">
          {building.code}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-[9px] text-muted-foreground">
            {building.floors.length} floors
          </span>

          <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-[9px] text-muted-foreground">
            {roomCount} rooms
          </span>
        </div>
      </div>
    </button>
  );
}

function DynamicFloorPlan({
  floor,
  selectedRoom,
  onSelectRoom,
}: {
  floor: Floor;
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
}) {
  const rooms = floor.rooms;

  if (rooms.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20">
        <div className="text-center">
          <DoorOpen
            size={28}
            className="mx-auto text-muted-foreground/50"
          />

          <p className="mt-3 text-sm font-medium">
            No rooms configured
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add rooms through Campus Setup.
          </p>
        </div>
      </div>
    );
  }

  const columns = Math.min(
    Math.max(Math.ceil(Math.sqrt(rooms.length)), 2),
    6
  );

  return (
    <div
      className="grid gap-2 rounded-3xl border border-border bg-muted/20 p-3 md:p-5"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {rooms.map((room, index) => {
        const selected = selectedRoom?.id === room.id;

        return (
          <button
            type="button"
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={`group relative flex min-h-[82px] flex-col justify-between rounded-2xl border p-3 text-left transition ${
              selected
                ? "border-yellow-400/50 bg-yellow-300/15 shadow-[0_0_25px_rgba(250,204,21,0.10)]"
                : "border-border bg-card/80 hover:border-yellow-400/25 hover:bg-card"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-[9px] text-muted-foreground">
                {room.roomNumber}
              </span>

              {index % 7 === 3 && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </div>

            <div>
              <p className="line-clamp-2 text-[11px] font-medium">
                {room.name}
              </p>

              <p className="mt-1 line-clamp-1 text-[8px] text-muted-foreground">
                {room.type}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function RoomDetails({ room }: { room: Room | null }) {
  if (!room) {
    return (
      <aside className="rounded-3xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl">
        <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/50 text-muted-foreground">
            <DoorOpen size={20} />
          </div>

          <p className="mt-4 text-sm font-medium">
            Select a room
          </p>

          <p className="mt-1 max-w-[190px] text-xs leading-5 text-muted-foreground">
            Room-level information will appear here.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-3xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl">
      <p className="font-mono text-[10px] text-muted-foreground">
        {room.id}
      </p>

      <h2 className="mt-1 text-lg font-semibold">
        {room.name}
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-lg border border-yellow-400/20 bg-yellow-300/10 px-2.5 py-1 text-[9px] text-yellow-700 dark:text-yellow-200">
          {room.type}
        </span>

        <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-[9px] text-muted-foreground">
          {room.capacity} capacity
        </span>
      </div>

      <div className="mt-5 space-y-2">
        <RoomInfo
          icon={<Users size={14} />}
          label="Capacity"
          value={`${room.capacity} people`}
        />

        <RoomInfo
          icon={<Zap size={14} />}
          label="Energy"
          value="Awaiting live sensor data"
        />

        <RoomInfo
          icon={<TriangleAlert size={14} />}
          label="Maintenance"
          value="No live issue data"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-yellow-400/15 bg-yellow-300/[0.05] p-3">
        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
          <Sparkles size={14} />

          <span className="text-[10px] font-semibold">
            Digital Twin
          </span>
        </div>

        <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
          This room is structurally connected to the campus data model.
          Energy, occupancy, timetable and maintenance data can be connected
          here later.
        </p>
      </div>
    </aside>
  );
}

function RoomInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
      <div className="text-muted-foreground">{icon}</div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 text-[10px] font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/65 px-3 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-[9px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}