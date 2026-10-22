import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Camera,
  Check,
  ChevronDown,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

type Role = "student" | "worker" | "admin";

type AuthSession = {
  email: string;
  role: Role;
  collegeCode: string;
};

type ProfileData = {
  name: string;
  id: string;
  email: string;
  phone: string;
  alternateEmail: string;
  college: string;
  campus: string;
  department: string;
  course: string;
  year: string;
  semester: string;
  section: string;
  role: string;
  language: string;
  status: string;
  designation?: string;
  employeeId?: string;
  responsibilities?: string;
};

const SESSION_KEY = "vyra-auth-session";
const PROFILE_KEY = "vyra-role-profiles";

const DEMO_PROFILES: Record<Role, ProfileData> = {
  student: {
    name: "Ratnesh Patil",
    id: "1DS24CS001",
    email: "student@vyra.demo",
    phone: "+91 98765 43210",
    alternateEmail: "",
    college: "Dayananda Sagar College of Engineering",
    campus: "Main Campus",
    department: "Computer Science & Engineering",
    course: "B.E. Computer Science & Engineering",
    year: "1st Year",
    semester: "2nd Semester",
    section: "A",
    role: "Student",
    language: "English",
    status: "Active",
  },

  worker: {
    name: "Ramesh Kumar",
    id: "VYRA-W-001",
    email: "worker@vyra.demo",
    phone: "+91 90000 00001",
    alternateEmail: "",
    college: "Dayananda Sagar College of Engineering",
    campus: "Main Campus",
    department: "Maintenance",
    course: "",
    year: "",
    semester: "",
    section: "",
    role: "Worker",
    language: "English",
    status: "Active",
    designation: "Electrical Maintenance",
    employeeId: "VYRA-W-001",
    responsibilities:
      "Electrical maintenance, classroom equipment and power-related issues.",
  },

  admin: {
    name: "VYRA Campus Administrator",
    id: "VYRA-A-001",
    email: "admin@vyra.demo",
    phone: "+91 90000 00002",
    alternateEmail: "",
    college: "Dayananda Sagar College of Engineering",
    campus: "Main Campus",
    department: "Campus Administration",
    course: "",
    year: "",
    semester: "",
    section: "",
    role: "Administrator",
    language: "English",
    status: "Active",
    designation: "Campus Administrator",
    employeeId: "VYRA-A-001",
    responsibilities:
      "Campus operations, people management, maintenance, inventory, procurement, energy and sustainability.",
  },
};

function ProfilePage() {
  const [role, setRole] = useState<Role>("student");
  const [profile, setProfile] = useState<ProfileData>(DEMO_PROFILES.student);
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem(SESSION_KEY);

      if (!sessionRaw) {
        return;
      }

      const session = JSON.parse(sessionRaw) as AuthSession;

      if (
        session.role === "student" ||
        session.role === "worker" ||
        session.role === "admin"
      ) {
        setRole(session.role);

        const savedProfilesRaw = localStorage.getItem(PROFILE_KEY);

        if (savedProfilesRaw) {
          const savedProfiles = JSON.parse(savedProfilesRaw) as Partial<
            Record<Role, ProfileData>
          >;

          setProfile({
            ...DEMO_PROFILES[session.role],
            ...(savedProfiles[session.role] ?? {}),
          });
        } else {
          setProfile(DEMO_PROFILES[session.role]);
        }
      }
    } catch {
      setRole("student");
      setProfile(DEMO_PROFILES.student);
    }
  }, []);

  const updateProfile = (field: keyof ProfileData, value: string) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  };

  const saveChanges = () => {
    try {
      const existingRaw = localStorage.getItem(PROFILE_KEY);

      const existing = existingRaw
        ? (JSON.parse(existingRaw) as Partial<Record<Role, ProfileData>>)
        : {};

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({
          ...existing,
          [role]: profile,
        }),
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2200);
    } catch {
      setSaved(false);
    }
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setPhoto(result);
        localStorage.setItem(`vyra-profile-photo-${role}`, result);
      }
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const existingPhoto = localStorage.getItem(
      `vyra-profile-photo-${role}`,
    );

    if (existingPhoto) {
      setPhoto(existingPhoto);
    } else {
      setPhoto("");
    }
  }, [role]);

  const isAdmin = role === "admin";
  const isWorker = role === "worker";

  return (
    <main className="min-h-screen px-4 pb-12 pt-24 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-muted-foreground backdrop-blur-xl transition hover:bg-white/[0.09] hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-yellow-400">
              Account
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your VYRA account and personal information.
            </p>
          </div>
        </div>

        {/* Profile Hero */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-yellow-400/25 bg-yellow-400/10 text-3xl font-semibold text-yellow-300 shadow-lg">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  )}
                </div>

                <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-background shadow-xl transition hover:bg-white/10">
                  <Camera className="h-4 w-4" />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhoto}
                  />
                </label>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-semibold">
                    {profile.name}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-yellow-300">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {profile.role}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {isAdmin
                    ? profile.designation
                    : isWorker
                      ? profile.designation
                      : profile.course}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {profile.college}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.campus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>

              <div>
                <p className="text-xs font-medium text-emerald-300">
                  Account Status
                </p>

                <p className="text-sm font-semibold text-foreground">
                  {profile.status}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          {/* Main profile */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl backdrop-blur-2xl md:p-7">
            <div className="mb-6">
              <p className="text-lg font-semibold">
                Profile Information
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                College-controlled information cannot be changed from your
                profile.
              </p>
            </div>

            <div className="space-y-7">
              {/* Identity */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400/10">
                    <User className="h-4 w-4 text-yellow-300" />
                  </div>

                  <h3 className="font-medium">Identity</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyField
                    label="Full Name"
                    value={profile.name}
                  />

                  <ReadOnlyField
                    label={
                      isAdmin || isWorker
                        ? "Employee ID"
                        : "Student ID / USN"
                    }
                    value={profile.id}
                  />

                  <ReadOnlyField
                    label="Role"
                    value={profile.role}
                  />

                  <ReadOnlyField
                    label="Account Status"
                    value={profile.status}
                  />
                </div>
              </div>

              {/* College */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400/10">
                    <Building2 className="h-4 w-4 text-yellow-300" />
                  </div>

                  <h3 className="font-medium">
                    College Information
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyField
                    label="College"
                    value={profile.college}
                  />

                  <ReadOnlyField
                    label="Campus"
                    value={profile.campus}
                  />

                  <ReadOnlyField
                    label="Department"
                    value={profile.department}
                  />

                  {!isWorker && !isAdmin && (
                    <>
                      <ReadOnlyField
                        label="Course"
                        value={profile.course}
                      />

                      <ReadOnlyField
                        label="Year"
                        value={profile.year}
                      />

                      <ReadOnlyField
                        label="Semester"
                        value={profile.semester}
                      />

                      <ReadOnlyField
                        label="Section"
                        value={profile.section}
                      />
                    </>
                  )}

                  {(isWorker || isAdmin) && (
                    <>
                      <ReadOnlyField
                        label="Designation"
                        value={profile.designation ?? ""}
                      />

                      <ReadOnlyField
                        label="Employee ID"
                        value={
                          profile.employeeId ?? profile.id
                        }
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Admin responsibilities */}
              {isAdmin && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400/10">
                      <Users className="h-4 w-4 text-yellow-300" />
                    </div>

                    <h3 className="font-medium">
                      Administrative Access
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {profile.responsibilities}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400/10">
                    <Mail className="h-4 w-4 text-yellow-300" />
                  </div>

                  <h3 className="font-medium">
                    Contact Information
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyField
                    label="Verified Account Email"
                    value={profile.email}
                    icon={<Mail className="h-4 w-4" />}
                  />

                  <EditableField
                    label="Contact Number"
                    value={profile.phone}
                    icon={<Phone className="h-4 w-4" />}
                    onChange={(value) =>
                      updateProfile("phone", value)
                    }
                  />

                  <EditableField
                    label="Alternate Email"
                    value={profile.alternateEmail}
                    icon={<Mail className="h-4 w-4" />}
                    placeholder="Optional"
                    onChange={(value) =>
                      updateProfile("alternateEmail", value)
                    }
                  />
                </div>
              </div>

              {/* Preferences */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400/10">
                    <GraduationCap className="h-4 w-4 text-yellow-300" />
                  </div>

                  <h3 className="font-medium">
                    Preferences
                  </h3>
                </div>

                <div className="max-w-sm">
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Preferred Language
                  </label>

                  <div className="relative">
                    <select
                      value={profile.language}
                      onChange={(event) =>
                        updateProfile(
                          "language",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-3 pr-10 text-sm outline-none transition focus:border-yellow-400/40 focus:ring-2 focus:ring-yellow-400/10"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Kannada">Kannada</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                    <Check className="h-4 w-4" />
                    Changes saved
                  </span>
                )}

                <button
                  onClick={saveChanges}
                  className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-300 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-yellow-500/10 transition hover:scale-[1.01] hover:shadow-yellow-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          {/* Security / account */}
          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl backdrop-blur-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="font-semibold">
                    Account Protection
                  </p>

                  <p className="text-xs text-muted-foreground">
                    VYRA identity verification
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <SecurityRow
                  label="College Membership"
                  value="Verified"
                />

                <SecurityRow
                  label="Role Verification"
                  value={`${profile.role} verified`}
                />

                <SecurityRow
                  label="Account"
                  value="Active"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl backdrop-blur-2xl">
              <p className="mb-1 font-semibold">
                College-controlled data
              </p>

              <p className="mb-5 text-sm leading-6 text-muted-foreground">
                Your college controls your identity, role, department
                and membership information. These fields cannot be
                changed from this screen.
              </p>

              <div className="space-y-3">
                <InfoRow
                  label="College"
                  value={profile.college}
                />

                <InfoRow
                  label="Campus"
                  value={profile.campus}
                />

                <InfoRow
                  label="Role"
                  value={profile.role}
                />

                <InfoRow
                  label="Status"
                  value={profile.status}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ReadOnlyField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-muted-foreground">
        {label}
      </label>

      <div className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-black/[0.08] px-3 text-sm text-foreground/90">
        {icon && (
          <span className="text-muted-foreground">
            {icon}
          </span>
        )}

        <span className="truncate">
          {value || "—"}
        </span>
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  icon,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-muted-foreground">
        {label}
      </label>

      <div className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 transition focus-within:border-yellow-400/40 focus-within:ring-2 focus-within:ring-yellow-400/10">
        {icon && (
          <span className="text-muted-foreground">
            {icon}
          </span>
        )}

        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
}

function SecurityRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.025] px-3 py-3">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {value}
      </span>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="max-w-[60%] truncate text-right text-sm font-medium">
        {value}
      </span>
    </div>
  );
}