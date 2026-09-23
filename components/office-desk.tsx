"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DayChips, DayTitle } from "@/components/staff-ui";
import { DEMO_DAYS } from "@/lib/demo-orders";
import { formatPrice, routes, todayISO } from "@/lib/data";
import { isAfternoon, orderPlates, orderTotal, serveDateOf } from "@/lib/ops";
import { useStore } from "@/lib/store";

export function OfficeDesk() {
  const { t, locale, orders, resetDemo } = useStore();
  const [day, setDay] = useState<string>(() => {
    const today = todayISO();
    return (DEMO_DAYS as readonly string[]).includes(today) ? today : DEMO_DAYS[1];
  });
  const days = useMemo(() => {
    const extra = orders.map(serveDateOf).filter((d) => !(DEMO_DAYS as readonly string[]).includes(d));
    return [...DEMO_DAYS, ...Array.from(new Set(extra))].sort();
  }, [orders]);

  const dayOrders = orders.filter((o) => serveDateOf(o) === day);

  const plates = dayOrders.reduce((s, o) => s + orderPlates(o), 0);
  const cash = dayOrders.filter((o) => o.pay === "cash" && !o.paid).reduce((s, o) => s + orderTotal(o), 0);
  const keks = dayOrders.filter((o) => o.pay === "keks").reduce((s, o) => s + orderTotal(o), 0);
  const invoice = dayOrders.filter((o) => o.pay === "invoice").reduce((s, o) => s + orderTotal(o), 0);
  const doors = dayOrders.filter((o) => o.delivery.type === "door").length;
  const phone = dayOrders.filter((o) => o.source === "phone").length;

  const load = routes
    .map((r) => {
      const list = dayOrders.filter((o) => o.delivery.routeId === r.id);
      return { r, n: list.length, plates: list.reduce((s, o) => s + orderPlates(o), 0) };
    })
    .filter((x) => x.n > 0);

  return (
    <div className="px-4 pb-8 pt-5 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c94a]">{t.staffOffice}</p>
      <h1 className="mt-2 font-serif text-4xl">{t.staffLead}</h1>
      <p className="mt-2 text-sm text-white/60">{t.officeHint}</p>
      <div className="mt-6">
        <DayChips days={days} value={day} onChange={setDay} />
      </div>
      <p className="mt-4 text-white/70">
        <DayTitle date={day} />
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label={t.dayOrders} value={String(dayOrders.length)} />
        <Stat label={t.plates} value={String(plates)} />
        <Stat label={t.cashCollect} value={formatPrice(cash)} />
        <Stat label={t.keksIn} value={formatPrice(keks)} />
        <Stat label={t.invoices} value={formatPrice(invoice)} />
        <Stat label={`${t.doorStops} · ${t.phoneIn}`} value={`${doors} · ${phone}`} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/kuhinja" className="grid min-h-12 min-w-40 place-items-center rounded-md bg-[#d85a38] px-4 font-semibold">
          {t.staffKitchen}
        </Link>
        <Link href="/vozac" className="grid min-h-12 min-w-40 place-items-center rounded-md bg-[#f0c94a] px-4 font-semibold text-[#1a1816]">
          {t.staffDriver}
        </Link>
        <button type="button" onClick={resetDemo} className="min-h-12 rounded-md bg-white/10 px-4 text-sm font-semibold">
          {t.resetDemo}
        </button>
      </div>

      <h2 className="mt-10 font-serif text-3xl">{t.load}</h2>
      <ul className="mt-4 space-y-2">
        {load.map(({ r, n, plates: p }) => (
          <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/8 px-4 py-3">
            <span>
              <strong className="block">{locale === "hr" ? r.hr : r.en}</strong>
              <span className="text-sm text-white/55">
                {r.window} · {isAfternoon(r) ? t.afternoonVan : t.morningVan}
              </span>
            </span>
            <span className="text-right text-sm">
              {n} {t.dayOrders.toLowerCase()}
              <span className="block font-serif text-xl">{p}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/8 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
