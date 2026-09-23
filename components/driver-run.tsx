"use client";

import { useMemo, useState } from "react";
import { DayChips, StatusBadge } from "@/components/staff-ui";
import { DEMO_DAYS } from "@/lib/demo-orders";
import { formatPrice, routes, todayISO } from "@/lib/data";
import { orderTotal, packBy, serveDateOf, vanLeaves } from "@/lib/ops";
import { useStore } from "@/lib/store";

export function DriverRun() {
  const { t, locale, orders, updateOrder } = useStore();
  const [day, setDay] = useState<string>(() => {
    const today = todayISO();
    return (DEMO_DAYS as readonly string[]).includes(today) ? today : DEMO_DAYS[1];
  });
  const [routeId, setRouteId] = useState("centar-1");

  const days = useMemo(() => {
    const extra = orders.map(serveDateOf).filter((d) => !(DEMO_DAYS as readonly string[]).includes(d));
    return [...DEMO_DAYS, ...Array.from(new Set(extra))].sort();
  }, [orders]);

  const route = routes.find((r) => r.id === routeId);
  const list = orders
    .filter((o) => serveDateOf(o) === day && o.delivery.routeId === routeId)
    .slice()
    .sort((a, b) => {
      if (a.status === "done" && b.status !== "done") return 1;
      if (b.status === "done" && a.status !== "done") return -1;
      if (a.delivery.type !== b.delivery.type) return a.delivery.type === "stop" ? -1 : 1;
      return a.name.localeCompare(b.name, "hr");
    });

  const cashLeft = list.filter((o) => o.pay === "cash" && !o.paid).reduce((s, o) => s + orderTotal(o), 0);
  const left = list.filter((o) => o.status !== "done").length;

  return (
    <div className="px-4 pb-8 pt-5 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c94a]">{t.staffDriver}</p>
      <h1 className="mt-2 font-serif text-4xl">{t.driverTitle}</h1>
      <p className="mt-2 text-sm text-white/60">{t.driverLead}</p>
      <div className="mt-5">
        <DayChips days={days} value={day} onChange={setDay} />
      </div>
      <label className="mt-4 block text-sm text-white/70">
        {t.pickRoute}
        <select className="field mt-1" value={routeId} onChange={(e) => setRouteId(e.target.value)}>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {(locale === "hr" ? r.hr : r.en) + " · " + r.window}
            </option>
          ))}
        </select>
      </label>

      {route && (
        <div className="mt-4 rounded-2xl bg-white/8 p-4">
          <p className="font-serif text-2xl">{locale === "hr" ? route.hr : route.en}</p>
          <p className="mt-1 text-[#f0c94a]">{route.window}</p>
          <p className="mt-1 text-sm text-white/55">
            {t.vanGo} {vanLeaves(route)} · {t.packBy} {packBy(route)}
          </p>
          <p className="mt-3 text-sm">
            {left} {t.dayOrders.toLowerCase()} · {t.cashDue} {formatPrice(cashLeft)}
          </p>
        </div>
      )}

      <ol className="mt-6 space-y-3">
        {list.map((o, idx) => (
          <li key={o.id} className={`rounded-2xl p-4 ${o.status === "done" ? "bg-white/5 text-white/50" : "bg-white/10"}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="font-serif text-2xl">{idx + 1}</p>
              <StatusBadge status={o.status} />
            </div>
            <p className="mt-2 text-lg font-semibold text-white">{o.name}</p>
            <p className="text-sm text-white/70">{o.phone}</p>
            <p className="mt-2 text-sm">
              {o.delivery.type === "door" ? t.door : t.stop}
              {o.delivery.address ? ` · ${o.delivery.address}` : ""}
            </p>
            <ul className="mt-2 text-sm text-white/80">
              {o.items.map((i) => (
                <li key={i.key}>
                  {i.qty}× {locale === "hr" ? i.dish.hr : i.dish.en}
                </li>
              ))}
            </ul>
            {o.note && <p className="mt-2 text-sm text-[#f0c94a]">{o.note}</p>}
            <p className="mt-3 font-serif text-2xl">
              {formatPrice(orderTotal(o))}
              {o.pay === "cash" && !o.paid ? ` · ${t.cashDue}` : o.pay === "keks" ? ` · ${t.keksShort}` : o.pay === "invoice" ? ` · ${t.invoice}` : ""}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="grid min-h-12 place-items-center rounded-md bg-white/15 text-sm font-semibold">
                {t.callNow}
              </a>
              {o.status !== "done" ? (
                <button
                  type="button"
                  onClick={() =>
                    updateOrder(o.id, {
                      status: o.status === "new" || o.status === "packed" ? "out" : "done",
                      paid: o.status === "out" && o.pay === "cash" ? true : o.paid,
                    })
                  }
                  className="min-h-12 rounded-md bg-[#f0c94a] text-sm font-semibold text-[#1a1816]"
                >
                  {o.status === "out" ? t.handed : t.markOut}
                </button>
              ) : (
                <span className="grid min-h-12 place-items-center text-sm">✓ {t.handed}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      {!list.length && <p className="mt-8 text-white/60">{t.prepEmpty}</p>}
    </div>
  );
}
