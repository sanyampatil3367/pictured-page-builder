import {
  Camera,
  Check,
  ChevronRight,
  ImageUp,
  MapPin,
  Pencil,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AiOrb } from "./shell";

type Step =
  | "capture"
  | "analyzing"
  | "edit"
  | "review"
  | "done";

type ReportData = {
  issue: string;
  category: string;
  priority: string;
  worker: string;
  confidence: number;
  action: string;
  location: string;
  description: string;
};

const INITIAL_RESULT: ReportData = {
  issue: "Broken ceiling fan",
  category: "Electrical",
  priority: "Medium",
  worker: "Electrician",
  confidence: 94,
  action: "Replace capacitor and test motor.",
  location: "Aurora Block · Floor 2 · Room 204",
  description:
    "The ceiling fan appears to be malfunctioning and may require inspection of the capacitor and motor.",
};

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Cleaning",
  "Furniture",
  "Garden",
  "IT / Network",
  "Civil / Structural",
  "Other",
];

const PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const WORKERS = [
  "Electrician",
  "Plumber",
  "Cleaner",
  "Carpenter",
  "Gardener",
  "IT Technician",
  "Civil Maintenance",
  "General Maintenance",
];

const LOCATIONS = [
  "Aurora Block · Floor 2 · Room 204",
  "Banyan Block · Floor 1 · Lab 105",
  "Cedar Library · Ground · Reading Hall",
  "Delta Hostel · Floor 3 · Room 310",
];

export function ReportFlow({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("capture");
  const [img, setImg] = useState<string | null>(null);
  const [report, setReport] =
    useState<ReportData>(INITIAL_RESULT);

  const [mounted, setMounted] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  /*
   * Mount into document.body so the report modal is positioned
   * relative to the actual browser viewport rather than the
   * VYRA application layout.
   */
  useEffect(() => {
    setMounted(true);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const analyzeImage = (file?: File) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    setImg(objectUrl);
    setStep("analyzing");

    setTimeout(() => {
      setReport(INITIAL_RESULT);
      setStep("edit");
    }, 2200);
  };

  const updateReport = (
    field: keyof ReportData,
    value: string,
  ) => {
    setReport((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetReport = () => {
    setStep("capture");
    setImg(null);
    setReport(INITIAL_RESULT);
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close report"
        onClick={onClose}
        className="absolute inset-0 bg-background/40 backdrop-blur-sm animate-in fade-in"
      />

      {/* CENTERED VIEWPORT MODAL */}

      <section className="glass-1 animate-in zoom-in-95 relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border shadow-2xl duration-300 sm:max-h-[calc(100vh-3rem)]">
        {/* HEADER */}

        <div className="flex shrink-0 items-center gap-3 border-b px-5 py-4">
          <div className="glass-3 grid h-9 w-9 shrink-0 place-items-center rounded-xl">
            <Sparkles className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              Report an Issue
            </p>

            <p className="text-[11px] text-muted-foreground">
              {step === "capture" &&
                "Capture a campus problem"}

              {step === "analyzing" &&
                "VYRA is analyzing the image"}

              {step === "edit" &&
                "Review and correct the AI analysis"}

              {step === "review" &&
                "Final review before submission"}

              {step === "done" &&
                "Your report has been submitted"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* SCROLLABLE MODAL CONTENT */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5 md:p-6">
            {step === "capture" && (
              <CaptureStep
                camRef={camRef}
                fileRef={fileRef}
                onFile={analyzeImage}
              />
            )}

            {step === "analyzing" && (
              <AnalyzingStep img={img} />
            )}

            {step === "edit" && (
              <EditStep
                img={img}
                report={report}
                onChange={updateReport}
                onReview={() => setStep("review")}
                onRetake={resetReport}
              />
            )}

            {step === "review" && (
              <ReviewStep
                img={img}
                report={report}
                onBack={() => setStep("edit")}
                onConfirm={() => setStep("done")}
              />
            )}

            {step === "done" && (
              <DoneStep
                onClose={onClose}
                ticket="VY-2048"
              />
            )}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}

/* -------------------------------------------------------------------------- */
/* CAPTURE                                                                    */
/* -------------------------------------------------------------------------- */

function CaptureStep({
  camRef,
  fileRef,
  onFile,
}: {
  camRef: React.RefObject<HTMLInputElement | null>;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFile: (file?: File) => void;
}) {
  return (
    <div className="animate-rise">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Step 1
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Show VYRA the problem
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Take a clear photo of the issue. VYRA will identify what
          is wrong and suggest how it should be handled.
        </p>
      </div>

      <div className="glass-3 relative grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl">
        <div className="absolute inset-6 rounded-2xl border border-dashed border-foreground/15" />

        <div className="relative z-10 text-center">
          <span className="glass-2 mx-auto grid h-16 w-16 place-items-center rounded-2xl">
            <Camera
              className="h-7 w-7 text-muted-foreground"
              strokeWidth={1.25}
            />
          </span>

          <p className="mt-4 text-sm font-medium">
            Capture the problem
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            One clear image is usually enough.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => camRef.current?.click()}
          className="bg-gold sweep flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition active:scale-[.97]"
        >
          <Camera className="h-4 w-4" />
          Take photo
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="glass-2 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium transition hover:bg-accent active:scale-[.97]"
        >
          <ImageUp className="h-4 w-4" />
          Upload image
        </button>
      </div>

      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) =>
          onFile(e.target.files?.[0])
        }
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) =>
          onFile(e.target.files?.[0])
        }
      />

      <div className="glass-3 mt-5 rounded-2xl p-4">
        <div className="flex gap-3">
          <AiOrb size={24} />

          <div>
            <p className="text-xs font-medium">
              VYRA AI assistance
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              AI recommendations are reviewed by you before the
              report is submitted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ANALYZING                                                                  */
/* -------------------------------------------------------------------------- */

function AnalyzingStep({
  img,
}: {
  img: string | null;
}) {
  return (
    <div className="animate-rise">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Step 2
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          VYRA is analyzing
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Identifying the issue, urgency and appropriate maintenance
          team.
        </p>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
        {img && (
          <img
            src={img}
            alt="Uploaded campus issue"
            className="h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />

        <div className="bg-gold animate-scan absolute inset-x-0 h-0.5 shadow-gold" />

        <div className="absolute inset-0 grid place-items-center">
          <div className="glass-1 rounded-3xl p-7 text-center">
            <AiOrb size={64} />

            <p className="mt-5 text-sm font-medium">
              Understanding the issue…
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              This may take a moment.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {[
          "Inspecting image",
          "Identifying issue",
          "Estimating urgency",
          "Selecting maintenance team",
        ].map((text) => (
          <div
            key={text}
            className="glass-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-muted-foreground"
          >
            <span className="bg-gold h-1.5 w-1.5 rounded-full" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* EDIT                                                                       */
/* -------------------------------------------------------------------------- */

function EditStep({
  img,
  report,
  onChange,
  onReview,
  onRetake,
}: {
  img: string | null;
  report: ReportData;
  onChange: (
    field: keyof ReportData,
    value: string,
  ) => void;
  onReview: () => void;
  onRetake: () => void;
}) {
  return (
    <div className="animate-rise">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Step 3
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Review VYRA&apos;s detection
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          VYRA has made a recommendation. Check everything and
          change anything that isn&apos;t correct.
        </p>
      </div>

      <div className="glass-3 rounded-3xl p-3">
        <div className="flex gap-3">
          {img && (
            <img
              src={img}
              alt="Detected issue"
              className="h-20 w-20 shrink-0 rounded-2xl object-cover"
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-muted-foreground">
                AI detected
              </p>

              <span className="rounded-full border px-2.5 py-1 text-[10px] font-medium">
                <span className="text-gold-gradient font-semibold">
                  {report.confidence}%
                </span>{" "}
                confidence
              </span>
            </div>

            <p className="mt-1 text-lg font-semibold">
              {report.issue}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              AI suggestion — you remain in control.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Field
          label="What is the issue?"
          value={report.issue}
          onChange={(value) =>
            onChange("issue", value)
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Category"
            value={report.category}
            options={CATEGORIES}
            onChange={(value) =>
              onChange("category", value)
            }
          />

          <SelectField
            label="Urgency"
            value={report.priority}
            options={PRIORITIES}
            onChange={(value) =>
              onChange("priority", value)
            }
          />
        </div>

        <SelectField
          label="Assign to"
          value={report.worker}
          options={WORKERS}
          onChange={(value) =>
            onChange("worker", value)
          }
        />

        <SelectField
          label="Location"
          value={report.location}
          options={LOCATIONS}
          onChange={(value) =>
            onChange("location", value)
          }
          icon={<MapPin className="h-3.5 w-3.5" />}
        />

        <Field
          label="Additional details"
          value={report.description}
          multiline
          onChange={(value) =>
            onChange("description", value)
          }
          placeholder="Add anything VYRA may have missed..."
        />

        <div className="glass-3 rounded-2xl p-4">
          <p className="text-[11px] font-medium text-muted-foreground">
            AI recommendation
          </p>

          <p className="mt-1 text-sm">
            {report.action}
          </p>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-1 mt-6 bg-background/70 pt-3 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRetake}
            className="glass-2 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium transition hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Retake
          </button>

          <button
            onClick={onReview}
            className="bg-gold sweep flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition active:scale-[.97]"
          >
            Review report
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* REVIEW                                                                     */
/* -------------------------------------------------------------------------- */

function ReviewStep({
  img,
  report,
  onBack,
  onConfirm,
}: {
  img: string | null;
  report: ReportData;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="animate-rise">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Step 4
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Confirm your report
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Everything below will be submitted to the campus
          maintenance system.
        </p>
      </div>

      <div className="glass-3 overflow-hidden rounded-3xl">
        {img && (
          <img
            src={img}
            alt="Reported campus issue"
            className="aspect-[16/9] w-full object-cover"
          />
        )}

        <div className="space-y-4 p-5">
          <div>
            <p className="text-[11px] text-muted-foreground">
              Issue
            </p>

            <p className="mt-1 text-base font-semibold">
              {report.issue}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Summary
              label="Category"
              value={report.category}
            />

            <Summary
              label="Urgency"
              value={report.priority}
            />

            <Summary
              label="Assigned team"
              value={report.worker}
            />

            <Summary
              label="Location"
              value={report.location}
            />
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground">
              Details
            </p>

            <p className="mt-1 text-sm leading-relaxed">
              {report.description}
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-[11px] text-muted-foreground">
              VYRA recommendation
            </p>

            <p className="mt-1 text-sm">
              {report.action}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-3 mt-5 flex gap-3 rounded-2xl p-4">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />

        <p className="text-xs leading-relaxed text-muted-foreground">
          You have reviewed the AI-generated information. VYRA
          will submit this report only after your confirmation.
        </p>
      </div>

      <div className="sticky bottom-0 -mx-1 mt-6 bg-background/70 pt-3 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onBack}
            className="glass-2 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium transition hover:bg-accent"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={onConfirm}
            className="bg-gold sweep flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition active:scale-[.97]"
          >
            <Check className="h-4 w-4" />
            Confirm & submit
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DONE                                                                       */
/* -------------------------------------------------------------------------- */

function DoneStep({
  onClose,
  ticket,
}: {
  onClose: () => void;
  ticket: string;
}) {
  return (
    <div className="animate-rise flex min-h-[60vh] flex-col items-center justify-center py-10 text-center">
      <div className="bg-gold animate-in zoom-in-50 grid h-20 w-20 place-items-center rounded-full shadow-gold duration-700">
        <Check
          className="h-9 w-9 text-primary-foreground"
          strokeWidth={2.5}
        />
      </div>

      <p className="mt-7 text-xl font-semibold">
        Report submitted
      </p>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Your report has been received by the campus maintenance
        system. You&apos;ll be notified as it progresses.
      </p>

      <div className="glass-3 mt-5 rounded-full px-4 py-2 text-xs">
        Ticket{" "}
        <span className="font-mono font-medium">
          {ticket}
        </span>
      </div>

      <button
        onClick={onClose}
        className="glass-2 mt-8 rounded-full px-7 py-2.5 text-sm font-medium transition hover:bg-accent"
      >
        Done
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* REUSABLE FIELDS                                                            */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>

      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="glass-3 w-full resize-none rounded-xl px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="glass-3 w-full rounded-xl px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className={`glass-3 w-full appearance-none rounded-xl px-3.5 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${
            icon ? "pl-9" : ""
          }`}
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background/30 p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium">
        {value}
      </p>
    </div>
  );
}