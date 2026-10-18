export const STAGES = ["Report", "AI analyzed", "Assigned", "Material check", "Scheduled", "In progress", "Completed", "Verified", "Closed"];

export function Pipeline({ stage, waiting }: { stage: number; waiting?: boolean }) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-1">
        {STAGES.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition ${i <= stage ? (waiting && i === stage ? "bg-warning animate-breathe" : "bg-gold") : "bg-muted"}`} title={s} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>Report</span>
        <span className="font-medium text-foreground">{waiting ? "Waiting for material" : STAGES[stage]}</span>
        <span>Closed</span>
      </div>
    </div>
  );
}
