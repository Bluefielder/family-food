"use client";

import { useMemo, useState } from "react";
import { formatPrice, routes, todayMenu } from "@/lib/data";
import { useStore, type OrderStatus } from "@/lib/store";

const statuses: OrderStatus[] = ["new", "packed", "out", "done"];

export function KitchenBoard() {
  const { t, locale, orders, updateOrder, placeOrder } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [routeId, setRouteId] = useState(routes[0].id);
  const [dishId, setDishId] = useState(todayMenu().dishes[0]?.id ?? "");
  const day = todayMenu();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof orders>();
    for (const r of routes) map.set(r.id, []);
    map.set("none", []);
    for (const o of orders) {
      const id = o.delivery.routeId;
      if (!map.has(id)) map.set(id, []);
      map.get(id)?.push(o);
    }
    return map;
  }, [orders]);

  function addPhone(e: React.FormEvent) {
    e.preventDefault();
    const dish = day.dishes.find((d) => d.id === dishId);
    if (!dish || !name) return;
    placeOrder({
      name,
      phone,
      email: "",
      note: locale === "hr" ? "Unos s telefona" : "Entered from phone",
      delivery: { type: "stop", routeId },
      pay: "cash",
      paid: false,
      source: "phone",
      items: [{ key: `${day.date}:${dish.id}:${Date.now()}`, date: day.date, dish, qty: 1 }],
    });
    setName("");
    setPhone("");
  }

  return (
    <div className="space-y-10">
      <form onSubmit={addPhone} className="panel rounded-3xl p-5 print:hidden">
        <h2 className="font-serif text-2xl">{t.addPhoneOrder}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input className="field" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="field" placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <select className="field" value={routeId} onChange={(e) => setRouteId(e.target.value)}>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {locale === "hr" ? r.hr : r.en}
              </option>
            ))}
          </select>
          <select className="field" value={dishId} onChange={(e) => setDishId(e.target.value)}>
            {day.dishes
              .filter((d) => d.category === "mains")
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {locale === "hr" ? d.hr : d.en}
                </option>
              ))}
          </select>
        </div>
        <button type="submit" className="mt-4 min-h-12 rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-[var(--paper)]">
          {t.add}
        </button>
      </form>

      <div className="flex items-center justify-between print:hidden">
        <h2 className="font-serif text-3xl">{t.byRoute}</h2>
        <button type="button" onClick={() => window.print()} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
          {t.print}
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-white/70">{t.noOrders}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {routes.map((r) => {
            const list = grouped.get(r.id) ?? [];
            if (!list.length) return null;
            return (
              <section key={r.id} className="panel rounded-3xl p-5">
                <header className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-2xl">{locale === "hr" ? r.hr : r.en}</h3>
                  <span className="text-sm text-white/65">{r.window}</span>
                </header>
                <ul className="mt-4 space-y-4">
                  {list.map((o) => (
                    <li key={o.id} className="rounded-2xl bg-black/35 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">
                          {o.name} · {o.phone}
                        </p>
                        <span className="text-xs uppercase tracking-wide text-[var(--gold)]">{o.id}</span>
                      </div>
                      <ul className="mt-2 text-sm">
                        {o.items.map((i) => (
                          <li key={i.key}>
                            {i.qty}× {locale === "hr" ? i.dish.hr : i.dish.en}
                          </li>
                        ))}
                      </ul>
                      {o.delivery.type === "door" && (
                        <p className="mt-1 text-sm text-[var(--terracotta)]">{o.delivery.address}</p>
                      )}
                      {o.note && <p className="mt-1 text-sm text-white/65">{o.note}</p>}
                      <p className="mt-2 text-sm">
                        {o.pay === "card" ? t.paid : o.pay === "cash" ? t.cash : t.invoice} ·{" "}
                        {formatPrice(o.items.reduce((s, i) => s + i.dish.price * i.qty, 0) + (o.delivery.type === "door" ? 1.5 : 0))}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                        {statuses.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updateOrder(o.id, { status: s })}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              o.status === s ? "bg-[var(--olive)] text-white" : "bg-white/10 text-white"
                            }`}
                          >
                            {s === "new" ? t.statusNew : s === "packed" ? t.packed : s === "out" ? t.out : t.done}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
