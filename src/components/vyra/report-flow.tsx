import { Camera, Check, ImageUp, Pencil, RotateCcw, X } from "lucide-react";
import { useRef, useState } from "react";
import { AiOrb } from "./shell";

type Step = "capture" | "analyzing" | "result" | "manual" | "done";

const RESULTS = [
  { issue: "Broken ceiling fan", category: "Electrical", priority: "Medium", worker: "Electrician", confidence: 94, action: "Replace capacitor and test motor." },
  { issue: "Unclear", category: "—", priority: "—", worker: "—", confidence: 41, action: "" },
];

export function ReportFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("capture");
  const [img, setImg] = useState<string | null>(null);
  const [res, setRes] = useState(RESULTS[0]);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    setImg(URL.createObjectURL(f));
    setStep("analyzing");
    const r = Math.random() < 0.8 ? RESULTS[0] : RESULTS[1];
    setTimeout(() => { setRes(r); setStep(r.confidence < 60 ? "manual" : "result"); }, 2600);
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background/50 p-3 backdrop-blur-md animate-in fade-in">
      <div className="glass-1 animate-in zoom-in-95 slide-in-from-bottom-4 relative flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] duration-500">
        <div className="flex items-center justify-between px-6 pt-5">
          <p className="text-sm font-medium">Report an Issue</p>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto p-6 pt-4">
          {step === "capture" && (
            <>
              <div className="glass-3 relative grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl">
                <div className="absolute inset-6 rounded-2xl border border-dashed border-foreground/15" />
                <div className="text-center">
                  <Camera className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
                  <p className="mt-3 text-sm text-muted-foreground">Point at the problem and capture it</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button onClick={() => camRef.current?.click()} className="bg-gold sweep flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition active:scale-[.97]">
                  <Camera className="h-4 w-4" /> Take photo
                </button>
                <button onClick={() => fileRef.current?.click()} className="glass-2 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium transition hover:bg-accent active:scale-[.97]">
                  <ImageUp className="h-4 w-4" /> Upload image
                </button>
              </div>
              <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onFile(e.target.files?.[0])} />
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
            </>
          )}

          {step === "analyzing" && (
            <div className="py-2 text-center">
              <div className="relative mx-auto aspect-[4/3] overflow-hidden rounded-3xl">
                {img && <img src={img} alt="Captured issue" className="h-full w-full object-cover opacity-80" />}
                <div className="bg-gold animate-scan absolute inset-x-0 h-0.5 shadow-gold" />
                <div className="absolute inset-0 grid place-items-center"><AiOrb size={72} /></div>
              </div>
              <p className="mt-6 font-medium">VYRA is analyzing the issue…</p>
              <p className="mt-1 text-sm text-muted-foreground">Identifying object, category and urgency</p>
            </div>
          )}

          {step === "result" && (
            <div className="animate-rise">
              <div className="flex items-center gap-4">
                {img && <img src={img} alt="" className="h-16 w-16 rounded-2xl object-cover" />}
                <div>
                  <p className="text-xs text-muted-foreground">Detected</p>
                  <p className="text-xl font-semibold">{res.issue}</p>
                </div>
                <span className="glass-3 ml-auto rounded-full px-3 py-1 font-mono text-xs"><span className="text-gold-gradient font-semibold">{res.confidence}%</span> confident</span>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-3">
                {[["Category", res.category], ["Priority", res.priority], ["Assign to", res.worker]].map(([k, v]) => (
                  <div key={k} className="glass-3 rounded-2xl p-3"><dt className="text-[11px] text-muted-foreground">{k}</dt><dd className="mt-0.5 text-sm font-medium">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-muted-foreground">Suggested: {res.action}</p>
              <LocationSelect />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => setStep("manual")} className="glass-2 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm transition hover:bg-accent"><Pencil className="h-4 w-4" /> Correct it</button>
                <button onClick={() => setStep("done")} className="bg-gold sweep flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-primary-foreground shadow-gold active:scale-[.97]"><Check className="h-4 w-4" /> Confirm & submit</button>
              </div>
            </div>
          )}

          {step === "manual" && (
            <form className="animate-rise space-y-4" onSubmit={(e) => { e.preventDefault(); setStep("done"); }}>
              {res.confidence < 60 && (
                <div className="glass-3 rounded-2xl p-4 text-sm">VYRA couldn't confidently identify the issue. Tell us a little more.</div>
              )}
              <label className="block text-sm">
                <span className="text-xs text-muted-foreground">Category</span>
                <select className="glass-3 mt-1 w-full rounded-xl px-3 py-2.5 outline-none" defaultValue={res.category !== "—" ? res.category : ""} required>
                  <option value="" disabled>Choose</option>
                  {["Electrical", "Plumbing", "Carpentry", "Cleaning", "IT / Network", "Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-xs text-muted-foreground">Describe the issue</span>
                <textarea rows={3} className="glass-3 mt-1 w-full rounded-xl px-3 py-2.5 outline-none" placeholder="e.g. Fan makes noise and won't spin" />
              </label>
              <LocationSelect />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => setStep("capture")} className="glass-2 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm"><RotateCcw className="h-4 w-4" /> Retake</button>
                <button className="bg-gold flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-primary-foreground shadow-gold">Submit report</button>
              </div>
            </form>
          )}

          {step === "done" && (
            <div className="animate-rise py-8 text-center">
              <div className="bg-gold animate-in zoom-in-50 mx-auto grid h-20 w-20 place-items-center rounded-full shadow-gold duration-700">
                <Check className="h-9 w-9 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <p className="mt-6 text-lg font-semibold">Report received</p>
              <p className="mt-1 text-sm text-muted-foreground">Ticket VY-2048 · You'll be notified as it progresses.</p>
              <button onClick={onClose} className="glass-2 mt-8 rounded-full px-6 py-2.5 text-sm">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LocationSelect() {
  return (
    <label className="mt-4 block text-sm">
      <span className="text-xs text-muted-foreground">Location</span>
      <select className="glass-3 mt-1 w-full rounded-xl px-3 py-2.5 outline-none" defaultValue="A-2-204">
        <option value="A-2-204">Aurora Block · Floor 2 · Room 204</option>
        <option value="B-1-105">Banyan Block · Floor 1 · Lab 105</option>
        <option value="C-0-LIB">Cedar Library · Ground · Reading Hall</option>
        <option value="D-3-310">Delta Hostel · Floor 3 · Room 310</option>
      </select>
    </label>
  );
}
