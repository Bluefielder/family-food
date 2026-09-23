"use client";

import { useMemo, useState } from "react";
import { DayChips, DayTitle, StatusBadge } from "@/components/staff-ui";
import { DEMO_DAYS } from "@/lib/demo-orders";
import { formatPrice, menuForDate, routes, todayISO } from "@/lib/data";
import { isAfternoon, orderTotal, packBy, serveDateOf, vanLeaves } from "@/lib/ops";
import { useStore, type OrderStatus } from "@/lib/store";

const statuses: OrderStatus[] = ["new", "packed", "out", "done"];

export function KitchenDesk() {
  const { t, locale, orders, updateOrder, placeOrder } = useStore();
  const [day, setDay] = useState<string>(() => {
    const today = todayISO();
    return (DEMO_DAYS as readonly string[]).includes(today) ? today : DEMO_DAYS[1];
  });
  const [tab, setTab] = useState<"prep" | "routes" | "phone">("prep");
  const days = useMemo(() => {
    const extra = orders.map(serveDateOf).filter((d) => !(DEMO_DAYS as readonly string[]).includes(d));
    return [...DEMO_DAYS, ...Array.from(new Set(extra))].sort();
  }, [orders]);

  const dayOrders = orders.filter((o) => serveDateOf(o) === day);

  return (
    <div className="px-4 pb-8 pt-5 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c94a]">{t.staffKitchen}</p>
      <h1 className="mt-2 font-serif text-4xl">{t.kitchenTitle}</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/60">{t.kitchenLead}</p>
      <div className="mt-6">
        <DayChips days={days} value={day} onChange={setDay} />
      </div>
      <p className="mt-3 text-white/70">
        <DayTitle date={day} /> · {dayOrders.length} {t.dayOrders.toLowerCase()}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2 print:hidden">
        {(
          [
            ["prep", t.prepTitle],
            ["routes", t.byRoute],
            ["phone", t.addPhoneOrder],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`min-h-12 rounded-xl text-sm font-semibold ${tab === id ? "bg-[#f0c94a] text-[#1a1816]" : "bg-white/10"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "prep" && <PrepList orders={dayOrders} />}
      {tab === "phone" && <PhoneForm key={day} day={day} placeOrder={placeOrder} />}
      {tab === "routes" && <RouteColumns dayOrders={dayOrders} updateOrder={updateOrder} />}
    </div>
  );
}

function PrepList({ orders }: { orders: ReturnType<typeof useStore>["orders"] }) {
  const { t } = useStore();
  const morning = orders.filter((o) => {
    const r = routes.find((x) => x.id === o.delivery.routeId);
    return r && !isAfternoon(r);
  });
  const afternoon = orders.filter((o) => {
    const r = routes.find((x) => x.id === o.delivery.routeId);
    return r && isAfternoon(r);
  });

  if (!orders.length) return <p className="mt-8 text-white/60">{t.prepEmpty}</p>;

  return (
    <div className="mt-8 space-y-10">
      <p className="text-sm text-white/60">{t.prepLead}</p>
      <ShiftBlock title={t.morningVan} list={morning} />
      <ShiftBlock title={t.afternoonVan} list={afternoon} />
      <NotesBlock orders={orders} />
    </div>
  );
}

function ShiftBlock({ title, list }: { title: string; list: ReturnType<typeof useStore>["orders"] }) {
  const { t, locale } = useStore();
  const counts = new Map<string, { name: string; qty: number }>();
  for (const o of list) {
    for (const i of o.items) {
      const name = locale === "hr" ? i.dish.hr : i.dish.en;
      const cur = counts.get(i.dish.id) ?? { name, qty: 0 };
      cur.qty += i.qty;
      counts.set(i.dish.id, cur);
    }
  }
  const rows = [...counts.values()].sort((a, b) => b.qty - a.qty);
  const sample = list[0] && routes.find((r) => r.id === list[0].delivery.routeId);

  return (
    <section>
      <h2 className="font-serif text-3xl">{title}</h2>
      {sample && (
        <p className="mt-1 text-sm text-white/55">
          {t.packBy} {packBy(sample)} · {t.vanGo} {vanLeaves(sample)}
        </p>
      )}
      {rows.length === 0 ? (
        <p className="mt-3 text-white/50">—</p>
      ) : (
        <ol className="mt-4 divide-y divide-white/10 rounded-2xl bg-white/8">
          {rows.map((row) => (
            <li key={row.name} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <span>{row.name}</span>
              <span className="font-serif text-2xl">
                {row.qty} <span className="text-sm text-white/50">{t.qtyShort}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function NotesBlock({ orders }: { orders: ReturnType<typeof useStore>["orders"] }) {
  const { t } = useStore();
  const notes = orders.filter((o) => o.note.trim());
  if (!notes.length) return null;
  return (
    <section>
      <h2 className="font-serif text-3xl">{t.notes}</h2>
      <ul className="mt-3 space-y-2">
        {notes.map((o) => (
          <li key={o.id} className="rounded-xl bg-black/35 px-4 py-3 text-sm">
            <strong>{o.name}</strong>
            <span className="text-white/50"> · {o.id}</span>
            <p className="mt-1 text-white/80">{o.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RouteColumns({
  dayOrders,
  updateOrder,
}: {
  dayOrders: ReturnType<typeof useStore>["orders"];
  updateOrder: ReturnType<typeof useStore>["updateOrder"];
}) {
  const { t, locale } = useStore();
  return (
    <div className="mt-8 space-y-5">
      {routes.map((r) => {
        const list = dayOrders.filter((o) => o.delivery.routeId === r.id);
        if (!list.length) return null;
        return (
          <section key={r.id} className="rounded-2xl bg-white/8 p-4">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-2xl">{locale === "hr" ? r.hr : r.en}</h3>
              <span className="text-sm text-[#f0c94a]">{r.window}</span>
            </header>
            <p className="mt-1 text-xs text-white/50">
              {t.packBy} {packBy(r)} · {t.vanGo} {vanLeaves(r)}
            </p>
            <ul className="mt-4 space-y-3">
              {list.map((o) => {
                const age = Date.now() - Date.parse(o.createdAt);
                const justIn = age >= -5000 && age < 3 * 60 * 1000;
                return (
                <li key={o.id} className={`rounded-xl p-3 ${justIn ? "bg-[#f0c94a]/20 ring-2 ring-[#f0c94a]" : "bg-black/35"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">
                      {justIn ? `${t.justIn} · ` : ""}
                      {o.name} · {o.phone}
                    </p>
                    <StatusBadge status={o.status} />
                  </div>
                  <ul className="mt-2 text-sm text-white/80">
                    {o.items.map((i) => (
                      <li key={i.key}>
                        {i.qty}× {locale === "hr" ? i.dish.hr : i.dish.en}
                      </li>
                    ))}
                  </ul>
                  {o.delivery.address && (
                    <p className="mt-1 text-sm text-white/55">
                      {o.delivery.type === "door" ? t.door : t.stop} · {o.delivery.address}
                    </p>
                  )}
                  {o.note && <p className="mt-1 text-sm text-white/70">{o.note}</p>}
                  <p className="mt-2 text-sm">
                    {o.pay === "keks" ? t.payKeks : o.pay === "cash" ? t.payCash : t.payInvoice} · {formatPrice(orderTotal(o))}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateOrder(o.id, { status: s, paid: s === "done" && o.pay === "cash" ? true : o.paid })}
                        className={`min-h-10 rounded-full px-3 text-xs font-semibold ${
                          o.status === s ? "bg-[#f0c94a] text-[#1a1816]" : "bg-white/10"
                        }`}
                      >
                        {s === "new" ? `○ ${t.statusNew}` : s === "packed" ? `▣ ${t.packed}` : s === "out" ? `△ ${t.out}` : `✓ ${t.done}`}
                      </button>
                    ))}
                  </div>
                </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function PhoneForm({ day, placeOrder }: { day: string; placeOrder: ReturnType<typeof useStore>["placeOrder"] }) {
  const { t, locale } = useStore();
  const menu = menuForDate(day);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [routeId, setRouteId] = useState(routes[0].id);
  const [dishId, setDishId] = useState(menu.dishes.find((d) => d.category === "mains")?.id ?? "");
  const [address, setAddress] = useState("");

  function addPhone(e: React.FormEvent) {
    e.preventDefault();
    const dish = menu.dishes.find((d) => d.id === dishId);
    if (!dish || !name) return;
    placeOrder({
      name,
      phone,
      email: "",
      note: t.phoneNote,
      serveDate: day,
      delivery: address.trim() ? { type: "door", routeId, address } : { type: "stop", routeId, address },
      pay: "cash",
      paid: false,
      source: "phone",
      items: [{ key: `${day}:${dish.id}:${Date.now()}`, date: day, dish, qty: 1 }],
    });
    setName("");
    setPhone("");
    setAddress("");
  }

  return (
    <form onSubmit={addPhone} className="mt-8 space-y-3 rounded-2xl bg-white/8 p-4 print:hidden">
      <h2 className="font-serif text-2xl">{t.addPhoneOrder}</h2>
      <input className="field" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
      <input className="field" placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
      <select className="field" value={routeId} onChange={(e) => setRouteId(e.target.value)}>
        {routes.map((r) => (
          <option key={r.id} value={r.id}>
            {(locale === "hr" ? r.hr : r.en) + " · " + r.window}
          </option>
        ))}
      </select>
      <select className="field" value={dishId} onChange={(e) => setDishId(e.target.value)}>
        {menu.dishes
          .filter((d) => d.category === "mains")
          .map((d) => (
            <option key={d.id} value={d.id}>
              {locale === "hr" ? d.hr : d.en}
            </option>
          ))}
      </select>
      <input className="field" placeholder={t.siteAddressPh} value={address} onChange={(e) => setAddress(e.target.value)} />
      <button type="submit" className="min-h-12 w-full rounded-md bg-[#d85a38] font-semibold">
        {t.add}
      </button>
    </form>
  );
}
