import { Link, useLocation, useRouter } from "@tanstack/react-router";
import {
  Bell,
  Box,
  Building2,
  ClipboardList,
  FileWarning,
  Gauge,
  Home,
  Leaf,
  LogOut,
  Map as MapIcon,
  Menu,
  Mic,
  Moon,
  Package,
  Send,
  Settings,
  Sparkles,
  Sun,
  User,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Role = "student" | "worker" | "admin";

type Ctx = {
  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;
  role: Role;
};

const ShellCtx = createContext<Ctx>({
  aiOpen: false,
  setAiOpen: () => {},
  role: "student",
});

export const useShell = () => useContext(ShellCtx);

const NAV: Record<
  Role,
  { to: string; label: string; icon: typeof Home }[]
> = {
  student: [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/twin", label: "Campus Digital Twin", icon: MapIcon },
    { to: "/reports", label: "My Reports", icon: ClipboardList },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/sustainability", label: "Sustainability", icon: Leaf },
    { to: "/impact", label: "Campus Impact", icon: Sparkles },
  ],

  worker: [
    { to: "/worker", label: "Your Tasks", icon: Wrench },
  ],

    admin: [
    { to: "/admin", label: "Dashboard", icon: Gauge },
    { to: "/twin", label: "Buildings & Rooms", icon: Building2 },
    { to: "/admin/students", label: "Students", icon: User },
    { to: "/admin/workers", label: "Workers", icon: Wrench },
    { to: "/admin/energy", label: "Energy & Sustainability", icon: Zap },
    {
      to: "/admin/inventory",
      label: "Inventory & Procurement",
      icon: Package,
    },
  ],
};

const SESSION_KEY = "vyra-auth-session";

type StoredUser = {
  email?: string;
  role?: Role;
  collegeCode?: string;
  name?: string;
  verificationStatus?: "verified" | "pending";
};

function getStoredRole(): Role {
  if (typeof window === "undefined") return "student";

  try {
    const stored = window.localStorage.getItem(SESSION_KEY);

    if (!stored) return "student";

    const user = JSON.parse(stored) as StoredUser;

    if (
      user.role === "student" ||
      user.role === "worker" ||
      user.role === "admin"
    ) {
      return user.role;
    }

    return "student";
  } catch {
    return "student";
  }
}

export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="orb-1 animate-drift-a absolute -top-[20vh] left-[10vw] h-[70vh] w-[70vh] rounded-full blur-3xl" />
      <div className="orb-2 animate-drift-b absolute bottom-[-25vh] right-[-5vw] h-[75vh] w-[75vh] rounded-full blur-3xl" />
      <div className="orb-3 animate-drift-a absolute right-[30vw] top-[30vh] h-[45vh] w-[45vh] rounded-full blur-3xl" />
    </div>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="relative grid h-8 w-8 place-items-center">
        <span className="bg-gold animate-liquid absolute inset-0 shadow-gold" />
        <span className="relative text-sm font-bold text-primary-foreground">
          V
        </span>
      </span>

      <span className="text-[15px] font-semibold tracking-[0.18em]">
        VYRA
      </span>
    </Link>
  );
}

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const d = localStorage.getItem("vyra-theme") === "dark";

    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);

  const toggle = () => {
    const d = !dark;

    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("vyra-theme", d ? "dark" : "light");
  };

  return { dark, toggle };
}

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const router = useRouter();

  const [role, setRole] = useState<Role>("student");
  const [aiOpen, setAiOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [notif, setNotif] = useState(false);

  const { dark, toggle } = useTheme();

  useEffect(() => {
    setRole(getStoredRole());
  }, []);

  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  function logout() {
    localStorage.removeItem(SESSION_KEY);

    setAiOpen(false);
    setNotif(false);
    setDrawer(false);

    window.location.assign("/");
  }

  return (
    <ShellCtx.Provider value={{ aiOpen, setAiOpen, role }}>
      <Background />

      <header className="glass-1 fixed inset-x-3 top-3 z-40 flex h-14 items-center gap-3 rounded-2xl px-3 md:px-4">
        <button
          className="rounded-lg p-2 hover:bg-accent lg:hidden"
          onClick={() => setDrawer(true)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Logo />

        <span className="ml-3 hidden items-center gap-2 rounded-full glass-3 px-3 py-1 text-xs text-muted-foreground md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          North Ridge Institute · Main Campus
        </span>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={toggle}
            className="rounded-xl p-2 transition hover:bg-accent"
            aria-label="Toggle theme"
          >
            {dark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setNotif(!notif)}
              className="relative rounded-xl p-2 transition hover:bg-accent"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />

              <span className="bg-gold absolute right-1.5 top-1.5 h-2 w-2 rounded-full" />
            </button>

            {notif && (
              <Notifications onClose={() => setNotif(false)} />
            )}
          </div>

          <Link
            to="/profile"
            className="bg-gold ml-1 grid h-8 w-8 place-items-center rounded-full text-xs font-semibold text-primary-foreground transition hover:scale-105"
            aria-label="Open profile"
          >
            {role === "student"
              ? "RK"
              : role === "worker"
                ? "SM"
                : "AD"}
          </Link>
        </div>
      </header>

      {drawer && (
        <div
          className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawer(false)}
        />
      )}

      <Sidebar
        role={role}
        open={drawer}
        onClose={() => setDrawer(false)}
        onAi={() => setAiOpen(true)}
        onLogout={logout}
      />

      <div
        className={`flex min-h-screen pt-[5.25rem] transition-[padding] duration-500 lg:pl-[17.5rem] ${
          aiOpen ? "xl:pr-[25rem]" : ""
        }`}
      >
        <main
          key={pathname}
          className="animate-rise w-full min-w-0 px-4 pb-24 md:px-8"
        >
          {children}
        </main>
      </div>

      <AiPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        role={role}
      />

      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="glass-1 fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full py-2.5 pl-3 pr-4 text-sm font-medium transition hover:-translate-y-0.5"
        >
          <AiOrb size={22} />
          Ask VYRA
        </button>
      )}
    </ShellCtx.Provider>
  );
}

function Sidebar({
  role,
  open,
  onClose,
  onAi,
  onLogout,
}: {
  role: Role;
  open: boolean;
  onClose: () => void;
  onAi: () => void;
  onLogout: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <aside
      className={`glass-1 fixed bottom-3 left-3 top-[5.25rem] z-50 flex w-64 flex-col rounded-3xl p-3 transition-transform duration-500 ease-[cubic-bezier(.2,.9,.25,1.1)] lg:z-30 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-[110%]"
      }`}
    >
      <div className="flex items-center justify-between px-3 pb-2 pt-1 lg:hidden">
        <span className="text-xs text-muted-foreground">Menu</span>

        <button
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="px-3 pb-2 pt-1 text-[11px] font-medium tracking-wider text-muted-foreground capitalize">
        {role} workspace
      </p>

      <nav className="flex flex-col gap-0.5">
        {NAV[role].map(({ to, label, icon: I }) => {
          const active = pathname === to;

          return (
            <Link
              key={to + label}
              to={to}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {active && (
                <span className="glass-2 absolute inset-0 rounded-xl" />
              )}

              {active && (
                <span className="bg-gold absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full shadow-gold" />
              )}

              <I
                className={`relative h-4 w-4 ${
                  active ? "text-gold-deep" : ""
                }`}
              />

              <span className="relative">{label}</span>
            </Link>
          );
        })}

        <button
          onClick={onAi}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </button>
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 border-t pt-2">
        <Link
          to="/profile"
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
            pathname === "/profile"
              ? "font-medium text-foreground bg-accent"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          Profile
        </Link>

        <Link
          to="/settings"
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
            pathname === "/settings"
              ? "font-medium text-foreground bg-accent"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function Notifications({ onClose }: { onClose: () => void }) {
  const items = [
    {
      t: "Report assigned",
      d: "Ceiling fan · Room 204 → Electrician",
      i: Wrench,
    },
    {
      t: "Report verified",
      d: "Leaking tap · Block C, Floor 1",
      i: FileWarning,
    },
    {
      t: "Sustainability",
      d: "Campus saved 42 kWh yesterday",
      i: Leaf,
    },
  ];

  return (
    <div
      className="glass-1 animate-rise absolute right-0 top-12 w-80 rounded-2xl p-2"
      onMouseLeave={onClose}
    >
      {items.map(({ t, d, i: I }) => (
        <div
          key={t}
          className="flex gap-3 rounded-xl p-3 transition hover:bg-accent"
        >
          <span className="glass-3 grid h-8 w-8 shrink-0 place-items-center rounded-lg">
            <I className="h-4 w-4" />
          </span>

          <div>
            <p className="text-sm font-medium">{t}</p>
            <p className="text-xs text-muted-foreground">{d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AiOrb({ size = 28 }: { size?: number }) {
  return (
    <span
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <span className="bg-gold animate-liquid absolute inset-0 opacity-90" />
      <span className="animate-breathe absolute inset-[25%] rounded-full bg-background/60 blur-[1px]" />
    </span>
  );
}

const ROLE_HINT: Record<
  Role,
  { greet: string; chips: string[] }
> = {
  student: {
    greet:
      "Hi Ratnesh — I can help with campus issues, your reports and sustainability.",
    chips: [
      "Status of my reports",
      "How do I report an issue?",
      "Campus energy today",
    ],
  },

  worker: {
    greet:
      "Namaste Suresh. You have 3 tasks today. Ask me for instructions or translations.",
    chips: [
      "Read my next task",
      "Translate to Kannada",
      "Mark task complete",
    ],
  },

  admin: {
    greet:
      "Good evening. 2 rooms show energy wastage and 1 task is waiting for material.",
    chips: [
      "Summarise energy wastage",
      "Low-stock items",
      "Pending procurement",
    ],
  },
};

function reply(role: Role, q: string) {
  const s = q.toLowerCase();

  if (
    role === "student" &&
    /(inventory|procure|worker data|analytics|admin)/.test(s)
  ) {
    return "That information is limited to campus administrators, so I can't share it. I can help with your reports or campus sustainability.";
  }

  if (s.includes("report")) {
    return role === "student"
      ? "You have 3 active reports. The ceiling fan in Room 204 is assigned to an electrician and scheduled for tomorrow 10:00."
      : "Room 204 · Ceiling fan · Medium priority.";
  }

  if (s.includes("energy")) {
    return "Block A used 8% less energy than expected today. Room 204 is running 25% above expected.";
  }

  if (s.includes("stock") || s.includes("procure")) {
    return "Capacitors (2.5µF) are out of stock. A procurement request for 20 units awaits your approval.";
  }

  return "Got it. In this preview I answer with sample campus data — the live assistant will connect once the backend is enabled.";
}

function AiPanel({
  open,
  onClose,
  role,
}: {
  open: boolean;
  onClose: () => void;
  role: Role;
}) {
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([]);
  const [input, setInput] = useState("");

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([
      {
        me: false,
        t: ROLE_HINT[role].greet,
      },
    ]);
  }, [role]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [msgs]);

  const send = (t: string) => {
    if (!t.trim()) return;

    setMsgs((m) => [
      ...m,
      {
        me: true,
        t,
      },
    ]);

    setInput("");

    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          me: false,
          t: reply(role, t),
        },
      ]);
    }, 700);
  };

  return (
    <aside
      className={`glass-1 fixed inset-2 z-50 flex flex-col rounded-3xl transition-all duration-500 ease-[cubic-bezier(.2,.9,.25,1)] sm:inset-auto sm:bottom-3 sm:right-3 sm:top-[5.25rem] sm:w-[24rem] ${
        open
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-[110%] opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <AiOrb />

        <div className="flex-1">
          <p className="text-sm font-semibold">VYRA AI</p>

          <p className="text-[11px] capitalize text-muted-foreground">
            {role} assistant · role-aware
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 hover:bg-accent"
          aria-label="Close assistant"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`animate-rise max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.me
                ? "bg-gold ml-auto text-primary-foreground"
                : "glass-2"
            }`}
          >
            {m.t}
          </div>
        ))}

        {msgs.length <= 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {ROLE_HINT[role].chips.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="glass-3 rounded-full px-3 py-1.5 text-xs transition hover:bg-accent"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="glass-2 m-3 flex items-center gap-1 rounded-2xl p-1.5"
      >
        <button
          type="button"
          className="rounded-xl p-2 text-muted-foreground hover:bg-accent"
          aria-label="Voice input"
        >
          <Mic className="h-4 w-4" />
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask VYRA…"
          className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
        />

        <button
          className="bg-gold rounded-xl p-2 text-primary-foreground"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </aside>
  );
}

export function PageHeader({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-8 mt-4 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>

        {sub && (
          <p className="mt-1 text-sm text-muted-foreground">
            {sub}
          </p>
        )}
      </div>

      {right}
    </div>
  );
}

export { Box };