"use client";

import { formatDay, shortDay } from "@/lib/data";
import { statusMark } from "@/lib/ops";
import { useStore, type OrderStatus } from "@/lib/store";

export function DayChips({ days, value, onChange }: { days: string[]; value: string; onChange: (d: string) => void }) {
  const { locale, t } = useStore();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t.pickDay}>
      {days.map((d) => {
        const on = d === value;
        return (
          <button
            key={d}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(d)}
            className={`min-h-12 shrink-0 rounded-xl px-3 text-sm font-semibold ${
              on ? "bg-[#f0c94a] text-[#1a1816]" : "bg-white/10 text-white"
            }`}
          >
            {shortDay(d, locale)}
          </button>
        );
      })}
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useStore();
  const label = status === "new" ? t.statusNew : status === "packed" ? t.packed : status === "out" ? t.out : t.done;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
      <span aria-hidden>{statusMark(status)}</span>
      {label}
    </span>
  );
}

export function DayTitle({ date }: { date: string }) {
  const { locale } = useStore();
  return <span className="capitalize">{formatDay(date, locale)}</span>;
}
