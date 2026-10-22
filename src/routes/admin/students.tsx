import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useRef, useState, type ChangeEvent } from "react";

export const Route = createFileRoute("/admin/students")({
  component: StudentsManagement,
});

type Student = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  course: string;
  year: string;
  semester: string;
  section: string;
  status: "Active" | "Inactive";
};

type StudentForm = Omit<Student, "id">;

const STORAGE_KEY = "vyra-students";

const DEMO_STUDENTS: Student[] = [
  {
    id: "student-001",
    studentId: "1DS24CS001",
    name: "Ratnesh Patil",
    email: "ratnesh@dsce.edu.in",
    phone: "+91 98765 43210",
    department: "Computer Science & Engineering",
    course: "B.E. CSE",
    year: "1st Year",
    semester: "2nd Semester",
    section: "A",
    status: "Active",
  },
  {
    id: "student-002",
    studentId: "1DS24CS002",
    name: "Aarav Sharma",
    email: "aarav@dsce.edu.in",
    phone: "+91 98765 43211",
    department: "Computer Science & Engineering",
    course: "B.E. CSE",
    year: "1st Year",
    semester: "2nd Semester",
    section: "A",
    status: "Active",
  },
  {
    id: "student-003",
    studentId: "1DS24EC014",
    name: "Ananya Rao",
    email: "ananya@dsce.edu.in",
    phone: "+91 98765 43212",
    department: "Electronics & Communication",
    course: "B.E. ECE",
    year: "1st Year",
    semester: "2nd Semester",
    section: "B",
    status: "Active",
  },
  {
    id: "student-004",
    studentId: "1DS23ME031",
    name: "Vikram Shetty",
    email: "vikram@dsce.edu.in",
    phone: "+91 98765 43213",
    department: "Mechanical Engineering",
    course: "B.E. Mechanical",
    year: "2nd Year",
    semester: "4th Semester",
    section: "A",
    status: "Active",
  },
];

const EMPTY_FORM: StudentForm = {
  studentId: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  course: "",
  year: "",
  semester: "",
  section: "",
  status: "Active",
};

function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>(() =>
    loadStudents()
  );

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAdd, setShowAdd] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(
    null
  );

  const [form, setForm] = useState<StudentForm>(EMPTY_FORM);

  const [importOpen, setImportOpen] = useState(false);
  const [importRows, setImportRows] = useState<Student[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importFileName, setImportFileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const departments = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(students.map((student) => student.department))
      ),
    ];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query) ||
        student.course.toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === "All" ||
        student.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        student.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [students, search, departmentFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = students.filter(
      (student) => student.status === "Active"
    ).length;

    const inactive = students.length - active;

    const departmentsCount = new Set(
      students.map((student) => student.department)
    ).size;

    return {
      total: students.length,
      active,
      inactive,
      departments: departmentsCount,
    };
  }, [students]);

  function persist(nextStudents: Student[]) {
    setStudents(nextStudents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStudents));
  }

  function openAddStudent() {
    setForm(EMPTY_FORM);
    setEditingStudent(null);
    setShowAdd(true);
  }

  function openEditStudent(student: Student) {
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      course: student.course,
      year: student.year,
      semester: student.semester,
      section: student.section,
      status: student.status,
    });

    setEditingStudent(student);
    setShowAdd(true);
  }

  function closeStudentForm() {
    setShowAdd(false);
    setEditingStudent(null);
    setForm(EMPTY_FORM);
  }

  function updateForm(field: keyof StudentForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveStudent() {
    if (
      !form.studentId.trim() ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.department.trim() ||
      !form.course.trim()
    ) {
      return;
    }

    if (editingStudent) {
      persist(
        students.map((student) =>
          student.id === editingStudent.id
            ? {
                ...student,
                ...form,
                studentId: form.studentId.trim(),
                name: form.name.trim(),
                email: form.email.trim(),
              }
            : student
        )
      );
    } else {
      const newStudent: Student = {
        id: `student-${Date.now()}`,
        ...form,
        studentId: form.studentId.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
      };

      persist([newStudent, ...students]);
    }

    closeStudentForm();
  }

  function deleteStudent(student: Student) {
    const confirmed = window.confirm(
      `Remove ${student.name} from the student dataset?`
    );

    if (!confirmed) return;

    persist(
      students.filter((item) => item.id !== student.id)
    );
  }

  function toggleStatus(student: Student) {
    persist(
      students.map((item) =>
        item.id === student.id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : item
      )
    );
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImportFileName(file.name);
    setImportErrors([]);
    setImportRows([]);

    const reader = new FileReader();

    reader.onload = () => {
      const text = String(reader.result ?? "");
      const result = parseCsv(text);

      setImportRows(result.students);
      setImportErrors(result.errors);
      setImportOpen(true);
    };

    reader.readAsText(file);

    event.target.value = "";
  }

  function importStudents() {
    if (importRows.length === 0) return;

    const existingIds = new Set(
      students.map((student) =>
        student.studentId.trim().toLowerCase()
      )
    );

    const uniqueRows = importRows.filter(
      (student) =>
        !existingIds.has(student.studentId.trim().toLowerCase())
    );

    persist([...uniqueRows, ...students]);

    setImportRows([]);
    setImportErrors([]);
    setImportFileName("");
    setImportOpen(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 md:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-300">
            <GraduationCap size={14} />
            Campus Administration
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Students
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
            Manage the student dataset used for campus membership,
            identity verification and role-based access.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-2.5 text-xs font-semibold transition hover:bg-muted"
          >
            <Upload size={15} />
            Import Dataset
          </button>

          <button
            type="button"
            onClick={openAddStudent}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300"
          >
            <UserPlus size={15} />
            Add Student
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Users size={16} />}
          label="Total Students"
          value={stats.total}
        />

        <StatCard
          icon={<Check size={16} />}
          label="Active"
          value={stats.active}
          positive
        />

        <StatCard
          icon={<Users size={16} />}
          label="Inactive"
          value={stats.inactive}
        />

        <StatCard
          icon={<GraduationCap size={16} />}
          label="Departments"
          value={stats.departments}
        />
      </section>

      {/* Search and filters */}
      <section className="rounded-[2rem] border border-border bg-card/70 p-4 shadow-lg backdrop-blur-xl md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, student ID, email, department..."
              className="h-10 w-full rounded-xl border border-border bg-background/50 pl-9 pr-3 text-xs outline-none transition placeholder:text-muted-foreground/50 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(event.target.value)
            }
            className="h-10 rounded-xl border border-border bg-background/50 px-3 text-xs outline-none focus:border-yellow-400/50"
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department === "All"
                  ? "All Departments"
                  : department}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="h-10 rounded-xl border border-border bg-background/50 px-3 text-xs outline-none focus:border-yellow-400/50"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </section>

      {/* Student table */}
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card/70 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">
              Student Dataset
            </h2>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {filteredStudents.length} students shown
            </p>
          </div>

          <div className="hidden items-center gap-2 text-[9px] text-muted-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Dataset active
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <EmptyState
            search={search}
            onAdd={openAddStudent}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Student
                  </th>

                  <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Student ID
                  </th>

                  <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Academic
                  </th>

                  <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact
                  </th>

                  <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-border/70 transition hover:bg-muted/20"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-300/10 text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                          {getInitials(student.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {student.name}
                          </p>

                          <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                            {student.course}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-lg border border-border bg-muted/30 px-2.5 py-1 font-mono text-[9px]">
                        {student.studentId}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-[10px] font-medium">
                        {student.department}
                      </p>

                      <p className="mt-1 text-[9px] text-muted-foreground">
                        {student.year} · {student.semester} · Section{" "}
                        {student.section}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                        <Mail size={11} />
                        {student.email}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-[9px] text-muted-foreground">
                        <Phone size={11} />
                        {student.phone || "Not provided"}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(student)}
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-medium transition ${
                          student.status === "Active"
                            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300"
                            : "border-border bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {student.status}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            openEditStudent(student)
                          }
                          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label={`Edit ${student.name}`}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteStudent(student)
                          }
                          className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500"
                          aria-label={`Delete ${student.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Dataset explanation */}
      <section className="rounded-2xl border border-border bg-muted/20 p-4">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-yellow-400/20 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
            <FileSpreadsheet size={15} />
          </div>

          <div>
            <p className="text-xs font-semibold">
              Dataset is the source of truth
            </p>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              Students cannot decide their own role, college or student ID.
              During the final Supabase implementation, this dataset will be
              connected to authentication so VYRA can verify that a Google
              account actually belongs to a student registered at this
              college.
            </p>
          </div>
        </div>
      </section>

      {/* Add/Edit modal */}
      {showAdd && (
        <StudentModal
          form={form}
          editing={Boolean(editingStudent)}
          onChange={updateForm}
          onClose={closeStudentForm}
          onSave={saveStudent}
        />
      )}

      {/* Import modal */}
      {importOpen && (
        <ImportModal
          fileName={importFileName}
          rows={importRows}
          errors={importErrors}
          onClose={() => {
            setImportOpen(false);
            setImportRows([]);
            setImportErrors([]);
            setImportFileName("");
          }}
          onImport={importStudents}
        />
      )}
    </div>
  );
}

function StudentModal({
  form,
  editing,
  onChange,
  onClose,
  onSave,
}: {
  form: StudentForm;
  editing: boolean;
  onChange: (field: keyof StudentForm, value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-yellow-600 dark:text-yellow-300">
              Student Dataset
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              {editing ? "Edit student" : "Add student"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={17} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <FormField
            label="Student ID / USN"
            value={form.studentId}
            onChange={(value) => onChange("studentId", value)}
            placeholder="1DS24CS001"
          />

          <FormField
            label="Full name"
            value={form.name}
            onChange={(value) => onChange("name", value)}
            placeholder="Student full name"
          />

          <FormField
            label="College email"
            value={form.email}
            onChange={(value) => onChange("email", value)}
            placeholder="student@college.edu.in"
            type="email"
          />

          <FormField
            label="Phone number"
            value={form.phone}
            onChange={(value) => onChange("phone", value)}
            placeholder="+91 98765 43210"
          />

          <FormField
            label="Department"
            value={form.department}
            onChange={(value) => onChange("department", value)}
            placeholder="Computer Science & Engineering"
          />

          <FormField
            label="Course"
            value={form.course}
            onChange={(value) => onChange("course", value)}
            placeholder="B.E. CSE"
          />

          <FormField
            label="Year"
            value={form.year}
            onChange={(value) => onChange("year", value)}
            placeholder="1st Year"
          />

          <FormField
            label="Semester"
            value={form.semester}
            onChange={(value) => onChange("semester", value)}
            placeholder="2nd Semester"
          />

          <FormField
            label="Section"
            value={form.section}
            onChange={(value) => onChange("section", value)}
            placeholder="A"
          />

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-medium text-muted-foreground">
              Status
            </span>

            <select
              value={form.status}
              onChange={(event) =>
                onChange(
                  "status",
                  event.target.value as "Active" | "Inactive"
                )
              }
              className="h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-xs outline-none focus:border-yellow-400/50"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-yellow-300"
          >
            <Check size={14} />
            {editing ? "Save Changes" : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImportModal({
  fileName,
  rows,
  errors,
  onClose,
  onImport,
}: {
  fileName: string;
  rows: Student[];
  errors: string[];
  onClose: () => void;
  onImport: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-yellow-600 dark:text-yellow-300">
              Dataset Import
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Review imported students
            </h2>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {fileName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted"
          >
            <X size={17} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {errors.length > 0 && (
            <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/5 p-4">
              <p className="text-xs font-semibold text-red-500">
                Some rows could not be imported
              </p>

              <ul className="mt-2 space-y-1">
                {errors.map((error) => (
                  <li
                    key={error}
                    className="text-[10px] text-red-500"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <FileSpreadsheet
                size={28}
                className="mx-auto text-muted-foreground/50"
              />

              <p className="mt-3 text-sm font-medium">
                No valid students found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Check the CSV column names and try again.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold">
                  {rows.length} valid student
                  {rows.length === 1 ? "" : "s"}
                </p>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-600 dark:text-emerald-300">
                  Ready to import
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/20 text-left">
                      <th className="px-3 py-2 text-[9px] text-muted-foreground">
                        Student ID
                      </th>

                      <th className="px-3 py-2 text-[9px] text-muted-foreground">
                        Name
                      </th>

                      <th className="px-3 py-2 text-[9px] text-muted-foreground">
                        Email
                      </th>

                      <th className="px-3 py-2 text-[9px] text-muted-foreground">
                        Department
                      </th>

                      <th className="px-3 py-2 text-[9px] text-muted-foreground">
                        Course
                      </th>

                      <th className="px-3 py-2 text-[9px] text-muted-foreground">
                        Year
                      </th>

                      <th className="px-3 py-2 text-[9px] text-muted-foreground">
                        Section
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.slice(0, 100).map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border/60"
                      >
                        <td className="px-3 py-2 font-mono text-[9px]">
                          {student.studentId}
                        </td>

                        <td className="px-3 py-2 text-[10px] font-medium">
                          {student.name}
                        </td>

                        <td className="px-3 py-2 text-[9px] text-muted-foreground">
                          {student.email}
                        </td>

                        <td className="px-3 py-2 text-[9px]">
                          {student.department}
                        </td>

                        <td className="px-3 py-2 text-[9px]">
                          {student.course}
                        </td>

                        <td className="px-3 py-2 text-[9px]">
                          {student.year}
                        </td>

                        <td className="px-3 py-2 text-[9px]">
                          {student.section}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rows.length > 100 && (
                <p className="mt-2 text-[9px] text-muted-foreground">
                  Previewing the first 100 rows. All {rows.length} valid
                  rows will be imported.
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={rows.length === 0}
            onClick={onImport}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={14} />
            Import {rows.length} Students
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-medium text-muted-foreground">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-xs outline-none transition placeholder:text-muted-foreground/50 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
      />
    </label>
  );
}

function StatCard({
  icon,
  label,
  value,
  positive = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-[9px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 text-2xl font-semibold ${
          positive
            ? "text-emerald-500 dark:text-emerald-300"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  search,
  onAdd,
}: {
  search: string;
  onAdd: () => void;
}) {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
        <Users size={20} />
      </div>

      <p className="mt-4 text-sm font-medium">
        {search ? "No students found" : "No students yet"}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {search
          ? "Try changing your search or filters."
          : "Add a student or import your college dataset."}
      </p>

      {!search && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-xs font-semibold text-black"
        >
          <Plus size={14} />
          Add Student
        </button>
      )}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function loadStudents(): Student[] {
  if (typeof window === "undefined") {
    return DEMO_STUDENTS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEMO_STUDENTS;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return DEMO_STUDENTS;
    }

    return parsed;
  } catch {
    return DEMO_STUDENTS;
  }
}

function parseCsv(text: string): {
  students: Student[];
  errors: string[];
} {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return {
      students: [],
      errors: ["CSV must contain a header row and at least one student row."],
    };
  }

  const headers = parseCsvLine(lines[0]).map((header) =>
    normalizeHeader(header)
  );

  const findColumn = (...names: string[]) => {
    for (const name of names) {
      const index = headers.indexOf(normalizeHeader(name));

      if (index !== -1) return index;
    }

    return -1;
  };

  const columns = {
    studentId: findColumn(
      "student id",
      "student_id",
      "usn",
      "roll number",
      "roll no",
      "id"
    ),
    name: findColumn("name", "full name", "student name"),
    email: findColumn(
      "email",
      "college email",
      "email address"
    ),
    phone: findColumn("phone", "phone number", "mobile"),
    department: findColumn(
      "department",
      "dept",
      "branch"
    ),
    course: findColumn("course", "program", "degree"),
    year: findColumn("year", "year of study"),
    semester: findColumn(
      "semester",
      "sem"
    ),
    section: findColumn("section", "sec"),
    status: findColumn("status"),
  };

  const requiredColumns = [
    ["Student ID / USN", columns.studentId],
    ["Name", columns.name],
    ["Email", columns.email],
    ["Department", columns.department],
    ["Course", columns.course],
  ];

  const missing = requiredColumns
    .filter(([, index]) => index === -1)
    .map(([name]) => name);

  if (missing.length > 0) {
    return {
      students: [],
      errors: [
        `Missing required columns: ${missing.join(", ")}.`,
        "Supported examples: student_id, name, email, phone, department, course, year, semester, section.",
      ],
    };
  }

  const students: Student[] = [];
  const errors: string[] = [];

  lines.slice(1).forEach((line, rowIndex) => {
    const values = parseCsvLine(line);
    const rowNumber = rowIndex + 2;

    const getValue = (index: number) =>
      index >= 0 ? (values[index] ?? "").trim() : "";

    const studentId = getValue(columns.studentId);
    const name = getValue(columns.name);
    const email = getValue(columns.email);
    const phone = getValue(columns.phone);
    const department = getValue(columns.department);
    const course = getValue(columns.course);
    const year = getValue(columns.year);
    const semester = getValue(columns.semester);
    const section = getValue(columns.section);
    const statusValue = getValue(columns.status);

    if (!studentId || !name || !email || !department || !course) {
      errors.push(
        `Row ${rowNumber}: missing one or more required values.`
      );
      return;
    }

    const status: "Active" | "Inactive" =
      statusValue.toLowerCase() === "inactive"
        ? "Inactive"
        : "Active";

    students.push({
      id: `import-${Date.now()}-${rowIndex}`,
      studentId,
      name,
      email,
      phone,
      department,
      course,
      year,
      semester,
      section,
      status,
    });
  });

  return {
    students,
    errors,
  };
}

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current.trim());

  return values;
}