import { createFileRoute } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/admin/workers")({
  component: WorkersPage,
});

type WorkerStatus = "Active" | "Inactive";
type Availability = "Available" | "Busy" | "On Leave";

type Worker = {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  skills: string[];
  language: string;
  availability: Availability;
  status: WorkerStatus;
  assignedTasks: number;
  completedTasks: number;
  monthlyPay: number;
  joinedDate: string;
  location: string;
};

const STORAGE_KEY = "vyra-workers";

const CATEGORIES = [
  "Electrician",
  "Plumber",
  "Cleaner",
  "Gardener",
  "Carpenter",
  "General Maintenance",
  "HVAC Technician",
  "Security",
];

const LANGUAGES = ["English", "Hindi", "Kannada"];

const INITIAL_WORKERS: Worker[] = [
  {
    id: "worker-1",
    employeeId: "VYRA-W-001",
    name: "Ramesh Kumar",
    email: "ramesh@vyra.demo",
    phone: "+91 90000 00001",
    category: "Electrician",
    skills: ["Electrical Repair", "Fans", "Lighting", "Switches"],
    language: "English",
    availability: "Available",
    status: "Active",
    assignedTasks: 3,
    completedTasks: 84,
    monthlyPay: 22000,
    joinedDate: "2026-01-10",
    location: "Main Campus",
  },
  {
    id: "worker-2",
    employeeId: "VYRA-W-002",
    name: "Suresh Babu",
    email: "suresh@vyra.demo",
    phone: "+91 90000 00002",
    category: "Plumber",
    skills: ["Pipe Repair", "Water Leakage", "Drainage", "Taps"],
    language: "Kannada",
    availability: "Busy",
    status: "Active",
    assignedTasks: 5,
    completedTasks: 71,
    monthlyPay: 21000,
    joinedDate: "2026-01-18",
    location: "Main Campus",
  },
  {
    id: "worker-3",
    employeeId: "VYRA-W-003",
    name: "Manjunath R",
    email: "manjunath@vyra.demo",
    phone: "+91 90000 00003",
    category: "Cleaner",
    skills: ["Classrooms", "Washrooms", "Waste Management"],
    language: "Kannada",
    availability: "Available",
    status: "Active",
    assignedTasks: 2,
    completedTasks: 126,
    monthlyPay: 18000,
    joinedDate: "2026-02-02",
    location: "Science Block",
  },
  {
    id: "worker-4",
    employeeId: "VYRA-W-004",
    name: "Arjun Singh",
    email: "arjun@vyra.demo",
    phone: "+91 90000 00004",
    category: "Carpenter",
    skills: ["Furniture", "Doors", "Windows", "Desks"],
    language: "Hindi",
    availability: "On Leave",
    status: "Active",
    assignedTasks: 0,
    completedTasks: 58,
    monthlyPay: 20000,
    joinedDate: "2026-02-14",
    location: "Main Campus",
  },
  {
    id: "worker-5",
    employeeId: "VYRA-W-005",
    name: "Naveen Kumar",
    email: "naveen@vyra.demo",
    phone: "+91 90000 00005",
    category: "Gardener",
    skills: ["Plants", "Irrigation", "Lawn", "Garden Maintenance"],
    language: "Kannada",
    availability: "Available",
    status: "Active",
    assignedTasks: 1,
    completedTasks: 43,
    monthlyPay: 17500,
    joinedDate: "2026-03-01",
    location: "Main Campus",
  },
];

function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved) as Worker[];
      }
    } catch {
      // Fall back to demo data.
    }

    return INITIAL_WORKERS;
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: CATEGORIES[0],
    skills: "",
    language: LANGUAGES[0],
    availability: "Available" as Availability,
    monthlyPay: "20000",
    location: "Main Campus",
  });

  const saveWorkers = (next: Worker[]) => {
    setWorkers(next);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Local persistence is best-effort in the demo.
    }
  };

  const filteredWorkers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return workers.filter((worker) => {
      const matchesSearch =
        !query ||
        worker.name.toLowerCase().includes(query) ||
        worker.employeeId.toLowerCase().includes(query) ||
        worker.email.toLowerCase().includes(query) ||
        worker.category.toLowerCase().includes(query) ||
        worker.skills.some((skill) =>
          skill.toLowerCase().includes(query),
        );

      const matchesCategory =
        categoryFilter === "All" ||
        worker.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        worker.status === statusFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        worker.availability === availabilityFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesAvailability
      );
    });
  }, [
    workers,
    search,
    categoryFilter,
    statusFilter,
    availabilityFilter,
  ]);

  const totalWorkers = workers.length;
  const activeWorkers = workers.filter(
    (worker) => worker.status === "Active",
  ).length;
  const availableWorkers = workers.filter(
    (worker) =>
      worker.status === "Active" &&
      worker.availability === "Available",
  ).length;
  const assignedTasks = workers.reduce(
    (total, worker) => total + worker.assignedTasks,
    0,
  );

  const openAddModal = () => {
    setEditingWorker(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      category: CATEGORIES[0],
      skills: "",
      language: LANGUAGES[0],
      availability: "Available",
      monthlyPay: "20000",
      location: "Main Campus",
    });

    setModalOpen(true);
  };

  const openEditModal = (worker: Worker) => {
    setEditingWorker(worker);

    setForm({
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      category: worker.category,
      skills: worker.skills.join(", "),
      language: worker.language,
      availability: worker.availability,
      monthlyPay: String(worker.monthlyPay),
      location: worker.location,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingWorker(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      return;
    }

    const skills = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const monthlyPay = Math.max(
      0,
      Number(form.monthlyPay) || 0,
    );

    if (editingWorker) {
      const updated = workers.map((worker) =>
        worker.id === editingWorker.id
          ? {
              ...worker,
              name: form.name.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              category: form.category,
              skills,
              language: form.language,
              availability: form.availability,
              monthlyPay,
              location: form.location.trim() || "Main Campus",
            }
          : worker,
      );

      saveWorkers(updated);
    } else {
      const nextNumber =
        workers.reduce((max, worker) => {
          const number = Number(
            worker.employeeId.replace("VYRA-W-", ""),
          );

          return Number.isFinite(number)
            ? Math.max(max, number)
            : max;
        }, 0) + 1;

      const newWorker: Worker = {
        id: `worker-${Date.now()}`,
        employeeId: `VYRA-W-${String(nextNumber).padStart(
          3,
          "0",
        )}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        category: form.category,
        skills,
        language: form.language,
        availability: form.availability,
        status: "Active",
        assignedTasks: 0,
        completedTasks: 0,
        monthlyPay,
        joinedDate: new Date().toISOString().slice(0, 10),
        location: form.location.trim() || "Main Campus",
      };

      saveWorkers([newWorker, ...workers]);
    }

    closeModal();
  };

  const toggleStatus = (workerId: string) => {
    const updated = workers.map((worker) =>
      worker.id === workerId
        ? {
            ...worker,
            status:
              worker.status === "Active"
                ? ("Inactive" as WorkerStatus)
                : ("Active" as WorkerStatus),
          }
        : worker,
    );

    saveWorkers(updated);
  };

  const deleteWorker = (worker: Worker) => {
    const confirmed = window.confirm(
      `Remove ${worker.name} from the worker dataset?`,
    );

    if (!confirmed) {
      return;
    }

    saveWorkers(
      workers.filter(
        (current) => current.id !== worker.id,
      ),
    );
  };

  return (
    <main className="min-h-screen px-4 pb-12 pt-24 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-yellow-400">
              People Management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Workers
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage maintenance workers, skills, availability,
              assignments and payment information.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-300 px-5 text-sm font-semibold text-black shadow-lg shadow-yellow-500/10 transition hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            Add Worker
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Total Workers"
            value={totalWorkers}
            description="Registered workforce"
          />

          <StatCard
            icon={<UserCheck className="h-5 w-5" />}
            label="Active Workers"
            value={activeWorkers}
            description="Currently active"
          />

          <StatCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Available Now"
            value={availableWorkers}
            description="Ready for assignment"
          />

          <StatCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            label="Assigned Tasks"
            value={assignedTasks}
            description="Currently assigned"
          />
        </div>

        {/* Dataset information */}
        <div className="mb-6 rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.035] p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium">
                Worker dataset
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                This dataset will later become the source of truth
                for AI-based worker recommendations and maintenance
                assignments.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-yellow-300">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Local demo database
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-xl backdrop-blur-2xl">
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_160px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search workers, skills or employee ID..."
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-yellow-400/40 focus:ring-2 focus:ring-yellow-400/10"
              />
            </div>

            <SelectFilter
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={["All", ...CATEGORIES]}
              label="Category"
            />

            <SelectFilter
              value={statusFilter}
              onChange={setStatusFilter}
              options={["All", "Active", "Inactive"]}
              label="Status"
            />

            <SelectFilter
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
              options={[
                "All",
                "Available",
                "Busy",
                "On Leave",
              ]}
              label="Availability"
            />
          </div>
        </section>

        {/* Worker table/cards */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-xl backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-6">
            <div>
              <h2 className="font-semibold">
                Worker Directory
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {filteredWorkers.length} worker
                {filteredWorkers.length === 1 ? "" : "s"} shown
              </p>
            </div>
          </div>

          {filteredWorkers.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05]">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>

              <p className="font-medium">
                No workers found
              </p>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try changing your search or filters, or add a new
                worker.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredWorkers.map((worker) => (
                <WorkerRow
                  key={worker.id}
                  worker={worker}
                  onEdit={() => openEditModal(worker)}
                  onToggleStatus={() =>
                    toggleStatus(worker.id)
                  }
                  onDelete={() => deleteWorker(worker)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Architecture note */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-muted-foreground">
          <span className="font-medium text-foreground">
            VYRA workflow:
          </span>{" "}
          AI analyzes a maintenance issue → identifies required
          skill → checks worker availability → recommends a worker
          → admin confirms assignment → worker receives the task.
          Worker payment data is tracked separately from task
          assignment.
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-background/95 shadow-2xl backdrop-blur-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-background/95 px-6 py-5 backdrop-blur-xl">
              <div>
                <p className="font-semibold">
                  {editingWorker
                    ? "Edit Worker"
                    : "Add Worker"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {editingWorker
                    ? "Update worker information."
                    : "Create a worker profile for the campus."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Full Name"
                  value={form.name}
                  placeholder="Worker name"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      name: value,
                    }))
                  }
                />

                <FormField
                  label="Phone Number"
                  value={form.phone}
                  placeholder="+91..."
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      phone: value,
                    }))
                  }
                />

                <FormField
                  label="Email"
                  value={form.email}
                  placeholder="worker@college.edu"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      email: value,
                    }))
                  }
                />

                <SelectFormField
                  label="Worker Category"
                  value={form.category}
                  options={CATEGORIES}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      category: value,
                    }))
                  }
                />

                <SelectFormField
                  label="Preferred Language"
                  value={form.language}
                  options={LANGUAGES}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      language: value,
                    }))
                  }
                />

                <SelectFormField
                  label="Availability"
                  value={form.availability}
                  options={[
                    "Available",
                    "Busy",
                    "On Leave",
                  ]}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      availability: value as Availability,
                    }))
                  }
                />

                <FormField
                  label="Monthly Pay"
                  value={form.monthlyPay}
                  type="number"
                  placeholder="20000"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      monthlyPay: value,
                    }))
                  }
                />

                <FormField
                  label="Campus / Location"
                  value={form.location}
                  placeholder="Main Campus"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      location: value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted-foreground">
                  Skills
                </label>

                <input
                  value={form.skills}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      skills: event.target.value,
                    }))
                  }
                  placeholder="Electrical Repair, Fans, Lighting"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-yellow-400/40 focus:ring-2 focus:ring-yellow-400/10"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Separate multiple skills using commas.
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.035] p-4">
                <p className="text-sm font-medium">
                  Payment tracking
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Monthly pay is stored for administrative tracking
                  only. Actual bank transfers will be integrated
                  later.
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium transition hover:bg-white/[0.07]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={
                    !form.name.trim() || !form.phone.trim()
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-300 px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check className="h-4 w-4" />

                  {editingWorker
                    ? "Save Changes"
                    : "Create Worker"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function WorkerRow({
  worker,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  worker: Worker;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-5 transition hover:bg-white/[0.025] md:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/15 bg-yellow-400/[0.07] text-sm font-semibold text-yellow-300">
            {worker.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                {worker.name}
              </h3>

              <StatusBadge status={worker.status} />

              <AvailabilityBadge
                availability={worker.availability}
              />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{worker.employeeId}</span>

              <span className="flex items-center gap-1">
                <BriefcaseBusiness className="h-3 w-3" />
                {worker.category}
              </span>

              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {worker.location}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {worker.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/5 bg-white/[0.035] px-2 py-1 text-[11px] text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[510px]">
          <MiniMetric
            label="Assigned"
            value={worker.assignedTasks}
          />

          <MiniMetric
            label="Completed"
            value={worker.completedTasks}
          />

          <MiniMetric
            label="Language"
            value={worker.language}
          />

          <MiniMetric
            label="Monthly Pay"
            value={`₹${worker.monthlyPay.toLocaleString("en-IN")}`}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {worker.phone}
          </span>

          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {worker.email || "No email"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium transition hover:bg-white/[0.07]"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            onClick={onToggleStatus}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium transition hover:bg-white/[0.07]"
          >
            {worker.status === "Active" ? (
              <>
                <UserX className="h-3.5 w-3.5" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="h-3.5 w-3.5" />
                Activate
              </>
            )}
          </button>

          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center rounded-lg border border-red-400/10 bg-red-400/[0.04] p-2 text-red-300 transition hover:bg-red-400/[0.08]"
            title="Delete worker"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-lg backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300">
          {icon}
        </div>

        <span className="text-xs text-muted-foreground">
          VYRA
        </span>
      </div>

      <p className="text-2xl font-semibold">{value}</p>

      <p className="mt-1 text-sm font-medium">{label}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.025] px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: WorkerStatus;
}) {
  const active = status === "Active";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
        active
          ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"
          : "border-white/10 bg-white/[0.04] text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

function AvailabilityBadge({
  availability,
}: {
  availability: Availability;
}) {
  const className =
    availability === "Available"
      ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
      : availability === "Busy"
        ? "border-yellow-400/15 bg-yellow-400/[0.06] text-yellow-300"
        : "border-orange-400/15 bg-orange-400/[0.06] text-orange-300";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${className}`}
    >
      {availability}
    </span>
  );
}

function SelectFilter({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.035] px-3 pr-9 text-sm outline-none transition focus:border-yellow-400/40 focus:ring-2 focus:ring-yellow-400/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function FormField({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-muted-foreground">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-yellow-400/40 focus:ring-2 focus:ring-yellow-400/10"
      />
    </div>
  );
}

function SelectFormField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <label className="mb-2 block text-sm text-muted-foreground">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-3 pr-9 text-sm outline-none transition focus:border-yellow-400/40 focus:ring-2 focus:ring-yellow-400/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 text-muted-foreground" />
    </div>
  );
}