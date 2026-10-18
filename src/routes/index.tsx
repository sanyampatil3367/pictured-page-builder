import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, ArrowRight, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { ReportFlow } from "@/components/vyra/report-flow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VYRA — Report a campus issue" },
      { name: "description", content: "Spot something wrong on campus? Capture it and let VYRA analyze and route it." },
      { property: "og:title", content: "VYRA — Report a campus issue" },
      { property: "og:description", content: "Capture a campus problem and let VYRA analyze it." },
    ],
  }),
  component: StudentHome,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function StudentHome() {
  const [open, setOpen] = useState(false);
  const [hello, setHello] = useState("Hello");
  useEffect(() => { setHello(greeting()); }, []);
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl flex-col items-center justify-center text-center">
      <p className="text-sm text-muted-foreground">{hello}, Ratnesh.</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">How can VYRA help you today?</h1>

      <button onClick={() => setOpen(true)} className="group relative mt-12 w-full max-w-md rounded-[2.5rem] p-2 transition duration-500 hover:-translate-y-1 active:scale-[.98] active:duration-150">
        <span className="bg-gold animate-breathe absolute inset-6 -z-10 rounded-full opacity-60 blur-3xl transition group-hover:opacity-100" />
        <span className="glass-1 absolute inset-0 rounded-[2.5rem]" />
        <span className="bg-gold sweep relative flex flex-col items-center gap-3 rounded-[2rem] px-8 py-10 text-primary-foreground shadow-gold">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-background/25 backdrop-blur transition group-hover:scale-105">
            <Camera className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <span className="text-2xl font-semibold tracking-tight">Report an Issue</span>
          <span className="text-sm opacity-75">Capture a problem and let VYRA analyze it.</span>
        </span>
      </button>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        <Link to="/reports" className="glass-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:text-foreground">
          <span className="bg-gold h-1.5 w-1.5 rounded-full" /> 3 active reports <ArrowRight className="h-3 w-3" />
        </Link>
        <Link to="/sustainability" className="glass-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:text-foreground">
          <Leaf className="h-3 w-3" /> Campus score 82 · Your impact 240 pts
        </Link>
      </div>
      {open && <ReportFlow onClose={() => setOpen(false)} />}
    </div>
  );
}
