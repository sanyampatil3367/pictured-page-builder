import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  DoorOpen,
  GripVertical,
  Layers3,
  MapPin,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import {
  type BuildingSetup,
  type Campus,
  type RoomType,
  generateCampus,
  getCampusStats,
} from "../../lib/campus-data";

export const Route = createFileRoute("/admin/campus")({
  component: CampusSetup,
});

const CAMPUS_STORAGE_KEY = "vyra-campus-config";

const ROOM_TYPES: RoomType[] = [
  "Classroom",
  "Computer Lab",
  "Physics Lab",
  "Chemistry Lab",
  "Electronics Lab",
  "Mechanical Lab",
  "Office",
  "Principal Office",
  "Staff Room",
  "Seminar Hall",
  "Auditorium",
  "Library",
  "Washroom",
  "Store Room",
  "Server Room",
  "Workshop",
  "Other",
];

type EditableRoom = {
  id: string;
  roomNumber: string;
  name: string;
  type: RoomType;
  capacity: number;
};

type EditableFloor = {
  id: string;
  name: string;
  rooms: EditableRoom[];
};

type EditableBuilding = {
  id: string;
  name: string;
  code: string;
  description: string;
  floors: EditableFloor[];
};

function CampusSetup() {
  const [campusName, setCampusName] = useState("North Ridge Institute");
  const [campusCode, setCampusCode] = useState("NRI001");
  const [campusAddress, setCampusAddress] = useState(
    "Main Campus, Bengaluru, Karnataka"
  );

  const [buildings, setBuildings] = useState<BuildingSetup[]>([
    {
      name: "Block A",
      code: "A",
      description: "Academic Block",
      floorCount: 3,
      roomsPerFloor: 8,
      roomType: "Classroom",
      roomCapacity: 60,
      includeGroundFloor: false,
    },
  ]);

  const [generatedCampus, setGeneratedCampus] = useState<Campus | null>(null);
  const [editableBuildings, setEditableBuildings] = useState<
    EditableBuilding[]
  >([]);
  const [expandedBuildings, setExpandedBuildings] = useState<
    Record<string, boolean>
  >({});
  const [expandedFloors, setExpandedFloors] = useState<
    Record<string, boolean>
  >({});
  const [saved, setSaved] = useState(false);

  const previewStats = useMemo(() => {
    if (!generatedCampus) {
      return {
        buildings: buildings.length,
        floors: buildings.reduce(
          (sum, building) => sum + building.floorCount,
          0
        ),
        rooms: buildings.reduce(
          (sum, building) =>
            sum + building.floorCount * building.roomsPerFloor,
          0
        ),
      };
    }

    return getCampusStats(generatedCampus);
  }, [generatedCampus, buildings]);

  function updateBuilding(
    index: number,
    field: keyof BuildingSetup,
    value: string | number | boolean
  ) {
    setBuildings((current) =>
      current.map((building, buildingIndex) =>
        buildingIndex === index
          ? {
              ...building,
              [field]: value,
            }
          : building
      )
    );

    setGeneratedCampus(null);
    setSaved(false);
  }

  function addBuilding() {
    const number = buildings.length + 1;

    setBuildings((current) => [
      ...current,
      {
        name: `Block ${String.fromCharCode(64 + number)}`,
        code: `B${number}`,
        description: "Academic Block",
        floorCount: 2,
        roomsPerFloor: 8,
        roomType: "Classroom",
        roomCapacity: 60,
        includeGroundFloor: false,
      },
    ]);

    setGeneratedCampus(null);
    setSaved(false);
  }

  function removeBuilding(index: number) {
    if (buildings.length === 1) return;

    setBuildings((current) =>
      current.filter((_, buildingIndex) => buildingIndex !== index)
    );

    setGeneratedCampus(null);
    setSaved(false);
  }

  function generateStructure() {
    const campus = generateCampus(
      campusName.trim() || "My Campus",
      campusCode.trim().toUpperCase() || "CAMPUS001",
      campusAddress.trim(),
      buildings
    );

    const editable: EditableBuilding[] = campus.buildings.map((building) => ({
      id: building.id,
      name: building.name,
      code: building.code,
      description: building.description,
      floors: building.floors.map((floor) => ({
        id: floor.id,
        name: floor.name,
        rooms: floor.rooms.map((room) => ({
          id: room.id,
          roomNumber: room.roomNumber,
          name: room.name,
          type: room.type,
          capacity: room.capacity,
        })),
      })),
    }));

    setGeneratedCampus(campus);
    setEditableBuildings(editable);

    setExpandedBuildings(
      Object.fromEntries(
        editable.map((building, index) => [building.id, index === 0])
      )
    );

    setExpandedFloors(
      Object.fromEntries(
        editable.flatMap((building) =>
          building.floors.map((floor, index) => [
            floor.id,
            index === 0,
          ])
        )
      )
    );

    setSaved(false);
  }

  function updateRoom(
    buildingId: string,
    floorId: string,
    roomId: string,
    field: keyof EditableRoom,
    value: string | number
  ) {
    setEditableBuildings((current) =>
      current.map((building) =>
        building.id !== buildingId
          ? building
          : {
              ...building,
              floors: building.floors.map((floor) =>
                floor.id !== floorId
                  ? floor
                  : {
                      ...floor,
                      rooms: floor.rooms.map((room) =>
                        room.id !== roomId
                          ? room
                          : {
                              ...room,
                              [field]: value,
                            }
                      ),
                    }
              ),
            }
      )
    );

    setSaved(false);
  }

  function saveCampus() {
    if (!generatedCampus) {
      generateStructure();
      return;
    }

    const updatedCampus: Campus = {
      ...generatedCampus,
      name: campusName.trim() || generatedCampus.name,
      code:
        campusCode.trim().toUpperCase() || generatedCampus.code,
      address: campusAddress.trim(),
      buildings: editableBuildings.map((building) => ({
        ...generatedCampus.buildings.find(
          (item) => item.id === building.id
        )!,
        name: building.name,
        code: building.code,
        description: building.description,
        floors: building.floors.map((floor) => ({
          ...generatedCampus.buildings
            .find((item) => item.id === building.id)!
            .floors.find((item) => item.id === floor.id)!,
          name: floor.name,
          rooms: floor.rooms.map((room) => ({
            ...generatedCampus.buildings
              .find((item) => item.id === building.id)!
              .floors.find((item) => item.id === floor.id)!
              .rooms.find((item) => item.id === room.id)!,
            roomNumber: room.roomNumber,
            name: room.name,
            type: room.type,
            capacity: room.capacity,
          })),
        })),
      })),
    };

    localStorage.setItem(
      CAMPUS_STORAGE_KEY,
      JSON.stringify(updatedCampus)
    );

    setGeneratedCampus(updatedCampus);
    setSaved(true);
  }

  function toggleBuilding(id: string) {
    setExpandedBuildings((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  function toggleFloor(id: string) {
    setExpandedFloors((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 md:px-6 lg:px-8">
      <header>
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-300">
          <Building2 size={14} />
          Campus Administration
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Campus Setup
        </h1>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
          Define the physical structure of the campus once. VYRA will use this
          structure across the Digital Twin, maintenance, energy, occupancy,
          timetable and sustainability systems.
        </p>
      </header>

      {/* Campus information */}
      <section className="rounded-[2rem] border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl md:p-6">
        <SectionHeading
          icon={<MapPin size={17} />}
          eyebrow="Step 01"
          title="Campus information"
          description="Basic information used to identify this campus."
        />

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field
            label="College / Campus name"
            value={campusName}
            onChange={(event) => {
              setCampusName(event.target.value);
              setGeneratedCampus(null);
              setSaved(false);
            }}
            placeholder="Example: North Ridge Institute"
          />

          <Field
            label="College code"
            value={campusCode}
            onChange={(event) => {
              setCampusCode(event.target.value.toUpperCase());
              setGeneratedCampus(null);
              setSaved(false);
            }}
            placeholder="Example: NRI001"
          />

          <Field
            label="Campus address"
            value={campusAddress}
            onChange={(event) => {
              setCampusAddress(event.target.value);
              setGeneratedCampus(null);
              setSaved(false);
            }}
            placeholder="Campus location"
          />
        </div>
      </section>

      {/* Buildings */}
      <section className="rounded-[2rem] border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl md:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <SectionHeading
            icon={<Building2 size={17} />}
            eyebrow="Step 02"
            title="Buildings"
            description="Create the buildings that belong to this campus."
          />

          <button
            type="button"
            onClick={addBuilding}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-300/10 px-4 py-2.5 text-xs font-semibold text-yellow-700 transition hover:bg-yellow-300/20 dark:text-yellow-200"
          >
            <Plus size={15} />
            Add Building
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {buildings.map((building, index) => (
            <BuildingForm
              key={`${building.code}-${index}`}
              building={building}
              index={index}
              canDelete={buildings.length > 1}
              onChange={updateBuilding}
              onDelete={removeBuilding}
            />
          ))}
        </div>
      </section>

      {/* Generation */}
      <section className="rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-300/[0.08] via-card/70 to-card/70 p-5 shadow-lg backdrop-blur-xl md:p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-600 dark:text-yellow-300">
              Structure Preview
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Generate campus structure
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
              VYRA will generate the buildings, floors and rooms from the
              configuration above. You can then edit individual rooms before
              saving the final structure.
            </p>
          </div>

          <button
            type="button"
            onClick={generateStructure}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-xs font-semibold text-black shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300"
          >
            <Layers3 size={15} />
            Generate Structure
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat
            label="Buildings"
            value={previewStats.buildings}
            icon={<Building2 size={14} />}
          />

          <Stat
            label="Floors"
            value={previewStats.floors}
            icon={<Layers3 size={14} />}
          />

          <Stat
            label="Rooms"
            value={previewStats.rooms}
            icon={<DoorOpen size={14} />}
          />
        </div>
      </section>

      {/* Generated structure */}
      {editableBuildings.length > 0 && (
        <section className="rounded-[2rem] border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl md:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Step 03
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Review generated rooms
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                You can change individual room numbers, names, types and
                capacities before saving.
              </p>
            </div>

            <button
              type="button"
              onClick={saveCampus}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-xs font-semibold text-black shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300"
            >
              {saved ? <Check size={15} /> : <Save size={15} />}
              {saved ? "Campus Saved" : "Save Campus"}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {editableBuildings.map((building) => {
              const expanded = expandedBuildings[building.id] ?? false;

              return (
                <div
                  key={building.id}
                  className="overflow-hidden rounded-2xl border border-border bg-muted/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleBuilding(building.id)}
                    className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-muted/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
                      <Building2 size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {building.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {building.code} · {building.floors.length} floors ·{" "}
                        {building.floors.reduce(
                          (sum, floor) => sum + floor.rooms.length,
                          0
                        )}{" "}
                        rooms
                      </p>
                    </div>

                    {expanded ? (
                      <ChevronDown
                        size={17}
                        className="text-muted-foreground"
                      />
                    ) : (
                      <ChevronRight
                        size={17}
                        className="text-muted-foreground"
                      />
                    )}
                  </button>

                  {expanded && (
                    <div className="border-t border-border p-3 md:p-4">
                      <div className="space-y-3">
                        {building.floors.map((floor) => {
                          const floorExpanded =
                            expandedFloors[floor.id] ?? false;

                          return (
                            <div
                              key={floor.id}
                              className="overflow-hidden rounded-xl border border-border bg-card/60"
                            >
                              <button
                                type="button"
                                onClick={() => toggleFloor(floor.id)}
                                className="flex w-full items-center gap-3 px-3 py-3 text-left"
                              >
                                {floorExpanded ? (
                                  <ChevronDown
                                    size={14}
                                    className="text-muted-foreground"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={14}
                                    className="text-muted-foreground"
                                  />
                                )}

                                <Layers3
                                  size={14}
                                  className="text-yellow-600 dark:text-yellow-300"
                                />

                                <span className="flex-1 text-xs font-medium">
                                  {floor.name}
                                </span>

                                <span className="text-[9px] text-muted-foreground">
                                  {floor.rooms.length} rooms
                                </span>
                              </button>

                              {floorExpanded && (
                                <div className="border-t border-border p-3">
                                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {floor.rooms.map((room) => (
                                      <RoomEditor
                                        key={room.id}
                                        room={room}
                                        onChange={(field, value) =>
                                          updateRoom(
                                            building.id,
                                            floor.id,
                                            room.id,
                                            field,
                                            value
                                          )
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Architecture note */}
      <section className="rounded-2xl border border-border bg-muted/20 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-yellow-400/20 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
            <GripVertical size={15} />
          </div>

          <div>
            <p className="text-xs font-semibold">
              One campus structure, many VYRA systems
            </p>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              This structure will eventually become the shared source for
              Digital Twin, maintenance locations, energy analysis, classroom
              scheduling, occupancy, inventory context and sustainability
              intelligence. The current version stores it locally for the
              frontend MVP; Supabase will become the authoritative database
              later.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function BuildingForm({
  building,
  index,
  canDelete,
  onChange,
  onDelete,
}: {
  building: BuildingSetup;
  index: number;
  canDelete: boolean;
  onChange: (
    index: number,
    field: keyof BuildingSetup,
    value: string | number | boolean
  ) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
            <Building2 size={15} />
          </div>

          <div>
            <p className="text-xs font-semibold">
              Building {index + 1}
            </p>

            <p className="text-[9px] text-muted-foreground">
              Define its physical structure
            </p>
          </div>
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500"
            aria-label={`Delete building ${index + 1}`}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field
          label="Building name"
          value={building.name}
          onChange={(event) =>
            onChange(index, "name", event.target.value)
          }
          placeholder="Block A"
        />

        <Field
          label="Building code"
          value={building.code}
          onChange={(event) =>
            onChange(index, "code", event.target.value.toUpperCase())
          }
          placeholder="A"
        />

        <Field
          label="Description"
          value={building.description}
          onChange={(event) =>
            onChange(index, "description", event.target.value)
          }
          placeholder="Academic Block"
        />

        <NumberField
          label="Floors"
          value={building.floorCount}
          min={1}
          max={50}
          onChange={(value) =>
            onChange(index, "floorCount", value)
          }
        />

        <NumberField
          label="Rooms per floor"
          value={building.roomsPerFloor}
          min={1}
          max={500}
          onChange={(value) =>
            onChange(index, "roomsPerFloor", value)
          }
        />

        <SelectField
          label="Default room type"
          value={building.roomType}
          options={ROOM_TYPES}
          onChange={(value) =>
            onChange(index, "roomType", value)
          }
        />

        <NumberField
          label="Default capacity"
          value={building.roomCapacity}
          min={1}
          max={2000}
          onChange={(value) =>
            onChange(index, "roomCapacity", value)
          }
        />

        <label className="flex min-h-[68px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-card/60 px-3 py-2.5">
          <input
            type="checkbox"
            checked={building.includeGroundFloor}
            onChange={(event) =>
              onChange(
                index,
                "includeGroundFloor",
                event.target.checked
              )
            }
            className="h-4 w-4 accent-yellow-400"
          />

          <span>
            <span className="block text-xs font-medium">
              Include ground floor
            </span>

            <span className="mt-0.5 block text-[9px] text-muted-foreground">
              Generate G01, G02...
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

function RoomEditor({
  room,
  onChange,
}: {
  room: EditableRoom;
  onChange: (
    field: keyof EditableRoom,
    value: string | number
  ) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3">
      <div className="mb-3 flex items-center justify-between">
        <DoorOpen
          size={14}
          className="text-yellow-600 dark:text-yellow-300"
        />

        <span className="font-mono text-[9px] text-muted-foreground">
          {room.id}
        </span>
      </div>

      <div className="space-y-2.5">
        <SmallField
          label="Room number"
          value={room.roomNumber}
          onChange={(event) =>
            onChange("roomNumber", event.target.value)
          }
        />

        <SmallField
          label="Room name"
          value={room.name}
          onChange={(event) =>
            onChange("name", event.target.value)
          }
        />

        <SelectField
          label="Room type"
          value={room.type}
          options={ROOM_TYPES}
          small
          onChange={(value) => onChange("type", value)}
        />

        <NumberField
          label="Capacity"
          value={room.capacity}
          min={1}
          max={2000}
          small
          onChange={(value) => onChange("capacity", value)}
        />
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
        {icon}
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-yellow-600 dark:text-yellow-300">
          {eyebrow}
        </p>

        <h2 className="mt-0.5 text-base font-semibold">
          {title}
        </h2>

        <p className="mt-0.5 text-[10px] leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-medium text-muted-foreground">
        {label}
      </span>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-xs outline-none transition placeholder:text-muted-foreground/50 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
      />
    </label>
  );
}

function SmallField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[8px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>

      <input
        value={value}
        onChange={onChange}
        className="h-8 w-full rounded-lg border border-border bg-background/60 px-2.5 text-[10px] outline-none transition focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  small = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  small?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span
        className={`mb-1.5 block font-medium text-muted-foreground ${
          small ? "text-[8px] uppercase tracking-wider" : "text-[10px]"
        }`}
      >
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);

          if (Number.isNaN(next)) return;

          onChange(Math.min(max, Math.max(min, next)));
        }}
        className={`w-full rounded-xl border border-border bg-background/60 px-3 outline-none transition focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10 ${
          small ? "h-8 rounded-lg text-[10px]" : "h-10 text-xs"
        }`}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  small = false,
  onChange,
}: {
  label: string;
  value: RoomType;
  options: RoomType[];
  small?: boolean;
  onChange: (value: RoomType) => void;
}) {
  return (
    <label className="block">
      <span
        className={`mb-1.5 block font-medium text-muted-foreground ${
          small ? "text-[8px] uppercase tracking-wider" : "text-[10px]"
        }`}
      >
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as RoomType)
        }
        className={`w-full border border-border bg-background/60 px-3 outline-none transition focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10 ${
          small
            ? "h-8 rounded-lg text-[10px]"
            : "h-10 rounded-xl text-xs"
        }`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[9px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}