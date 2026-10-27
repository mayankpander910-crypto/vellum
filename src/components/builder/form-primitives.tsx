"use client";

import { useState, type ReactNode } from "react";
import { useController, useFieldArray, useFormContext, type FieldArrayPath, type Path } from "react-hook-form";
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import type { ResumeFormValues } from "@/lib/resume-validation";
import { uid } from "@/lib/resume-utils";
import { Button } from "@/components/ui/button";
import { Checkbox, Input, Label, Textarea } from "@/components/ui/form-controls";
import { cn } from "@/lib/utils";

/* ----------------------------- Fields ----------------------------- */
export function FieldShell({ label, htmlFor, hint, error, children, className }: {
  label: string; htmlFor?: string; hint?: string; error?: string; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>}
      {error && <p className="text-[11px] font-medium text-destructive" role="alert">{error}</p>}
    </div>
  );
}

export function TextField({ name, label, placeholder, type = "text", hint, autoComplete }: {
  name: Path<ResumeFormValues>; label: string; placeholder?: string; type?: string; hint?: string; autoComplete?: string;
}) {
  const { control } = useFormContext<ResumeFormValues>();
  const { field, fieldState } = useController({ control, name });
  const id = String(name).replace(/\./g, "-");
  return (
    <FieldShell label={label} htmlFor={id} hint={hint} error={fieldState.error?.message}>
      <Input id={id} type={type} placeholder={placeholder} autoComplete={autoComplete}
        value={(field.value as string) ?? ""} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} />
    </FieldShell>
  );
}

export function TextAreaField({ name, label, placeholder, hint, rows = 3, className }: {
  name: Path<ResumeFormValues>; label: string; placeholder?: string; hint?: string; rows?: number; className?: string;
}) {
  const { control } = useFormContext<ResumeFormValues>();
  const { field, fieldState } = useController({ control, name });
  const id = String(name).replace(/\./g, "-");
  return (
    <FieldShell label={label} htmlFor={id} hint={hint} error={fieldState.error?.message} className={className}>
      <Textarea id={id} rows={rows} placeholder={placeholder} value={(field.value as string) ?? ""}
        onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} className="resize-y leading-relaxed" />
    </FieldShell>
  );
}

export function CheckboxField({ name, label, hint }: { name: Path<ResumeFormValues>; label: string; hint?: string }) {
  const { control } = useFormContext<ResumeFormValues>();
  const { field } = useController({ control, name });
  const id = String(name).replace(/\./g, "-");
  return (
    <div className="flex items-start gap-2.5">
      <Checkbox id={id} checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(Boolean(v))} className="mt-0.5" />
      <div><Label htmlFor={id} className="cursor-pointer text-xs font-medium">{label}</Label>{hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}</div>
    </div>
  );
}

/** Stores a string[] as one item per line — simple and keyboard friendly. */
export function StringArrayField({ name, label, placeholder, hint, rows = 3 }: {
  name: Path<ResumeFormValues>; label: string; placeholder?: string; hint?: string; rows?: number;
}) {
  const { control } = useFormContext<ResumeFormValues>();
  const { field } = useController({ control, name });
  const value = Array.isArray(field.value) ? (field.value as string[]) : [];
  const id = String(name).replace(/\./g, "-");
  return (
    <FieldShell label={label} htmlFor={id} hint={hint}>
      <Textarea id={id} rows={rows} placeholder={placeholder} value={value.join("\n")}
        onChange={(e) => field.onChange(e.target.value.split("\n"))} onBlur={field.onBlur} ref={field.ref}
        className="resize-y leading-relaxed" />
    </FieldShell>
  );
}

/* ----------------------------- Repeatable ----------------------------- */
export function RepeatableSection<T extends Record<string, unknown>>({
  name, addLabel, makeItem, render, summary, emptyText, hint,
}: {
  name: FieldArrayPath<ResumeFormValues>;
  addLabel: string;
  makeItem: () => T;
  render: (index: number) => ReactNode;
  summary: (item: T, index: number) => string;
  emptyText?: string;
  hint?: string;
}) {
  const { control, getValues } = useFormContext<ResumeFormValues>();
  const { fields, append, remove, move, insert } = useFieldArray({ control, name, keyName: "fieldId" });
  const [openIds, setOpenIds] = useState<string[]>(() => fields.length ? [String(fields[0]!.id)] : []);
  const [pendingOpen, setPendingOpen] = useState<string | null>(null);

  const toggle = (id: string) => {
    setPendingOpen(null);
    setOpenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const add = () => {
    const item = makeItem();
    append(item as never);
    setPendingOpen(String(item.id ?? ""));
  };

  return (
    <div className="space-y-2.5">
      {hint && <p className="text-[11px] leading-relaxed text-muted-foreground">{hint}</p>}
      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">{emptyText ?? "Nothing here yet. Add your first entry below."}</p>
        </div>
      )}
      {fields.map((field, index) => {
        const item = field as unknown as T;
        const ownId = String(field.id ?? index);
        const expanded = openIds.includes(ownId) || (pendingOpen !== null && pendingOpen === ownId);
        return (
          <div key={field.fieldId} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-1 px-2 py-1.5">
              <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-hidden="true" />
              <button type="button" onClick={() => toggle(ownId)} aria-expanded={expanded}
                className="min-w-0 flex-1 truncate text-left text-xs font-semibold hover:text-primary">
                {summary(item, index) || `Entry ${index + 1}`}
              </button>
              <div className="flex shrink-0 items-center gap-0.5">
                <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}><ChevronUp className="h-3.5 w-3.5" /></IconButton>
                <IconButton label="Move down" disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}><ChevronDown className="h-3.5 w-3.5" /></IconButton>
                <IconButton label="Duplicate entry" onClick={() => {
                  const original = getValues(`${name}.${index}` as Path<ResumeFormValues>) as unknown as Record<string, unknown>;
                  const copy = { ...original, id: uid() };
                  insert(index + 1, copy as never);
                  setPendingOpen(String(copy.id));
                }}><Copy className="h-3.5 w-3.5" /></IconButton>
                <IconButton label="Delete entry" danger onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></IconButton>
                <IconButton label={expanded ? "Collapse" : "Expand"} onClick={() => toggle(ownId)}>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
                </IconButton>
              </div>
            </div>
            {expanded && <div className="space-y-3 border-t border-border bg-background/40 p-3">{render(index)}</div>}
          </div>
        );
      })}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full border-dashed"><Plus className="h-3.5 w-3.5" /> {addLabel}</Button>
    </div>
  );
}

export function IconButton({ label, onClick, disabled, danger, children }: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={label} aria-label={label}
      className={cn("grid h-6 w-6 place-items-center rounded text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-30",
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:text-foreground")}>
      {children}
    </button>
  );
}
