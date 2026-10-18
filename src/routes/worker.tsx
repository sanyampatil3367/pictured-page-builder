import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MapPin, Mic, Package, Play, QrCode, Volume2 } from "lucide-react";

export const Route = createFileRoute("/worker")({
  head: () => ({
    meta: [
      { title: "Your Tasks — VYRA Worker" },
      { name: "description", content: "Large, voice-friendly task cards for campus maintenance staff." },
      { property: "og:title", content: "Your Tasks — VYRA Worker" },
      { property: "og:description", content: "Voice-first maintenance tasks in English, Hindi and Kannada." },
    ],
  }),
  component: Worker,
});

type Lang = "en" | "hi" | "kn";
const T = {
  en: { title: "Your Tasks", start: "Start", done: "Done", listen: "Listen", speak: "Speak", mat: "Material", wait: "Waiting for material" },
  hi: { title: "आपके काम", start: "शुरू करें", done: "पूरा", listen: "सुनें", speak: "बोलें", mat: "सामान", wait: "सामान का इंतज़ार" },
  kn: { title: "ನಿಮ್ಮ ಕೆಲಸಗಳು", start: "ಪ್ರಾರಂಭಿಸಿ", done: "ಮುಗಿದಿದೆ", listen: "ಕೇಳಿ", speak: "ಮಾತನಾಡಿ", mat: "ಸಾಮಗ್ರಿ", wait: "ಸಾಮಗ್ರಿಗಾಗಿ ಕಾಯುತ್ತಿದೆ" },
};
const VOICE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", kn: "kn-IN" };

const INIT = [
  { id: 1, issue: { en: "Ceiling fan not working", hi: "छत का पंखा खराब है", kn: "ಸೀಲಿಂಗ್ ಫ್ಯಾನ್ ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ" }, loc: "Aurora · Room 204", pri: "Medium", mat: "Capacitor 2.5µF", status: "waiting" },
  { id: 2, issue: { en: "Light left on in empty room", hi: "खाली कमरे में लाइट जल रही है", kn: "ಖಾಲಿ ಕೋಣೆಯಲ್ಲಿ ದೀಪ ಉರಿಯುತ್ತಿದೆ" }, loc: "Delta Hostel · 306", pri: "High", mat: "—", status: "todo" },
  { id: 3, issue: { en: "Loose socket board", hi: "ढीला सॉकेट बोर्ड", kn: "ಸಡಿಲವಾದ ಸಾಕೆಟ್ ಬೋರ್ಡ್" }, loc: "Banyan · Lab 105", pri: "Low", mat: "Screws ×4", status: "todo" },
];

function Worker() {
  const [lang, setLang] = useState<Lang>("en");
  const [tasks, setTasks] = useState(INIT);
  const t = T[lang];
  const speak = (txt: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(txt); u.lang = VOICE[lang];
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  };
  const set = (id: number, status: string) => setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, status } : x)));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t.title}</h1>
        <div className="flex items-center gap-2">
          <div className="glass-2 flex rounded-2xl p-1">
            {(["en", "hi", "kn"] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`rounded-xl px-4 py-2.5 text-base font-medium ${lang === l ? "bg-gold text-primary-foreground" : ""}`}>
                {l === "en" ? "EN" : l === "hi" ? "हि" : "ಕ"}
              </button>
            ))}
          </div>
          <span className="glass-3 grid h-12 w-12 place-items-center rounded-2xl" title="Your VYRA QR ID: W-0193"><QrCode className="h-6 w-6" /></span>
        </div>
      </div>
      <div className="space-y-5">
        {tasks.map((k) => (
          <div key={k.id} className={`glass-1 rounded-[2rem] p-6 transition ${k.status === "done" ? "opacity-50" : ""}`}>
            <div className="flex items-start gap-4">
              <span className={`mt-1.5 h-4 w-4 shrink-0 rounded-full ${k.pri === "High" ? "bg-destructive" : k.pri === "Medium" ? "bg-warning" : "bg-success"}`} />
              <div className="flex-1">
                <p className="text-2xl font-semibold leading-tight">{k.issue[lang]}</p>
                <p className="mt-2 flex items-center gap-2 text-lg text-muted-foreground"><MapPin className="h-5 w-5" /> {k.loc}</p>
                <p className="mt-1 flex items-center gap-2 text-lg text-muted-foreground"><Package className="h-5 w-5" /> {t.mat}: {k.mat}</p>
                {k.status === "waiting" && <p className="mt-3 inline-block rounded-full bg-warning/20 px-3 py-1 text-sm font-medium">{t.wait}</p>}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button onClick={() => speak(`${k.issue[lang]}. ${k.loc}`)} className="glass-2 flex flex-col items-center gap-1 rounded-2xl py-4 text-base font-medium active:scale-95"><Volume2 className="h-7 w-7" />{t.listen}</button>
              <button className="glass-2 flex flex-col items-center gap-1 rounded-2xl py-4 text-base font-medium active:scale-95"><Mic className="h-7 w-7" />{t.speak}</button>
              {k.status === "progress" ? (
                <button onClick={() => set(k.id, "done")} className="flex flex-col items-center gap-1 rounded-2xl bg-success py-4 text-base font-semibold text-primary-foreground active:scale-95"><Check className="h-7 w-7" />{t.done}</button>
              ) : (
                <button disabled={k.status !== "todo"} onClick={() => set(k.id, "progress")} className="bg-gold flex flex-col items-center gap-1 rounded-2xl py-4 text-base font-semibold text-primary-foreground shadow-gold active:scale-95 disabled:opacity-40 disabled:shadow-none"><Play className="h-7 w-7" />{t.start}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
