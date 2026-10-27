import { cn } from "@/lib/utils";

/** Original Vellum mark: a folded page with a written line and a seal dot. */
export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("shrink-0", className)} aria-hidden="true">
      <rect width="40" height="40" rx="11" className="fill-primary" />
      <path d="M11.5 9.5h11.2L28 14.8v15.7H11.5V9.5Z" fill="white" fillOpacity=".97" />
      <path d="M22.7 9.5v5.3H28" className="fill-primary/20" />
      <path d="M15.5 18.6h8.6M15.5 22.4h8.6M15.5 26.2h5.6" className="stroke-primary" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="27" cy="26.5" r="3.1" fill="#F6B34B" stroke="white" strokeWidth="1.3" />
      <path d="m25.8 26.5 0.9 0.9 1.7-1.9" stroke="#3B2B0A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, size = 34, compact = false }: { className?: string; size?: number; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {!compact && (
        <span className="text-[19px] font-extrabold tracking-[-.045em] text-foreground">
          vellum<span className="text-primary">.</span>
        </span>
      )}
    </span>
  );
}
