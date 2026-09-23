"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RouteMapSheet } from "@/components/route-map";
import { KEKS_FEE, demoAccount, formatPrice, routeAreas, routes } from "@/lib/data";
import { routeLabel, useStore, type PayMethod } from "@/lib/store";

export function CheckoutForm() {
  const router = useRouter();
  const { t, locale, items, subtotal, delivery, setDelivery, deliveryFee, placeOrder } = useStore();
  const [name, setName] = useState(demoAccount.name);
  const [phone, setPhone] = useState(demoAccount.phone);
  const [email, setEmail] = useState(demoAccount.email);
  const [note, setNote] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState(demoAccount.address);
  const [pay, setPay] = useState<PayMethod>("cash");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    if (!delivery) {
      setDelivery({ type: "stop", routeId: demoAccount.routeId });
    }
  }, [delivery, setDelivery]);

  const payFee = pay === "keks" ? KEKS_FEE : 0;
  const grand = subtotal + deliveryFee + payFee;
  const chosen = routes.find((r) => r.id === delivery?.routeId);
  const usual = routes.find((r) => r.id === demoAccount.routeId);

  if (items.length === 0) {
    return <p className="text-white/70">{t.emptyCart}</p>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError(t.needNamePhone);
      return;
    }
    if (!delivery) {
      setError(t.needRoute);
      return;
    }
    if (delivery.type === "door" && !address.trim()) {
      setError(t.needAddress);
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    const order = placeOrder({
      name,
      phone,
      email,
      note,
      company,
      delivery: { ...delivery, address },
      pay,
      paid: pay === "keks",
      source: "web",
    });
    router.push(`/hvala?id=${order.id}`);
  }

  function setRoute(id: string) {
    if (delivery?.type === "door") setDelivery({ type: "door", routeId: id, address });
    else setDelivery({ type: "stop", routeId: id, address });
  }

  return (
    <form onSubmit={submit} className="space-y-6 pb-4">
      <fieldset className="space-y-2">
        <legend className="font-serif text-2xl text-white">{t.account}</legend>
        <p className="text-xs text-white/50">{t.demoPay}</p>
        <label className="block text-sm text-white/70">
          {t.name}
          <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-sm text-white/70">
          {t.phone}
          <input className="field mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
        </label>
        <label className="block text-sm text-white/70">
          {t.email}
          <input className="field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
        </label>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-serif text-2xl text-white">{t.todayDrop}</legend>
        <p className="text-sm text-white/60">{t.jobSiteHint}</p>

        <div className="rounded-2xl bg-black/40 p-4">
          <p className="text-[11px] uppercase tracking-widest text-[#f0c94a]">{t.usualStop}</p>
          <p className="mt-1 text-white">
            {demoAccount.address}
            <span className="mt-0.5 block text-sm text-white/55">
              {usual ? `${locale === "hr" ? usual.hr : usual.en} · ${usual.window}` : ""}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#f0c94a] text-[16px] font-semibold text-[#1a1816]"
        >
          <MapGlyph />
          {t.showMap}
        </button>

        {chosen && (
          <p className="rounded-xl bg-black/40 px-3 py-3 text-sm text-white/85">
            <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full bg-[#d85a38] text-[11px] font-bold text-white">
              {chosen.code}
            </span>
            {locale === "hr" ? chosen.hr : chosen.en}
            {(chosen.infoHr || chosen.infoEn) && (
              <span className="mt-1 block text-white/55">{locale === "hr" ? chosen.infoHr : chosen.infoEn}</span>
            )}
            <span className="mt-1 block font-serif text-xl text-[#f0c94a]">{chosen.window}</span>
          </p>
        )}

        <p className="text-sm text-white/70">{t.pickRoute}</p>
        {routeAreas.map((area) => (
          <div key={area.id}>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/45">
              {locale === "hr" ? area.hr : area.en}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {routes
                .filter((r) => r.area === area.id)
                .map((r) => {
                  const on = delivery?.routeId === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoute(r.id)}
                      aria-pressed={on}
                      className={`min-h-14 rounded-xl px-2.5 py-2 text-left ${
                        on ? "bg-[#f0c94a] text-[#1a1816]" : "bg-black/35 text-white ring-1 ring-white/15"
                      }`}
                    >
                      <span className="block text-[13px] font-semibold leading-tight">{locale === "hr" ? r.hr : r.en}</span>
                      <span className={`mt-1 block font-serif text-sm ${on ? "text-[#1a1816]" : "text-[#f0c94a]"}`}>{r.window}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}

        <label className="block text-sm text-white/70">
          {t.siteAddress}
          <input
            className="field mt-1"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (delivery?.type === "door") {
                setDelivery({ type: "door", routeId: delivery.routeId, address: e.target.value });
              }
            }}
            placeholder={t.siteAddressPh}
          />
        </label>

        <label className="flex cursor-pointer gap-3 rounded-2xl bg-black/35 p-4 ring-1 ring-white/15">
          <input
            type="radio"
            name="del"
            checked={delivery?.type !== "door"}
            onChange={() => setDelivery({ type: "stop", routeId: delivery?.routeId ?? demoAccount.routeId, address })}
          />
          <span>
            <strong className="block text-white">{t.stop}</strong>
          </span>
        </label>
        <label className="flex cursor-pointer gap-3 rounded-2xl bg-black/35 p-4 ring-1 ring-white/15">
          <input
            type="radio"
            name="del"
            checked={delivery?.type === "door"}
            onChange={() =>
              setDelivery({
                type: "door",
                routeId: delivery?.routeId ?? demoAccount.routeId,
                address,
              })
            }
          />
          <span>
            <strong className="block text-white">{t.door}</strong>
            <span className="text-sm text-white/55">{t.doorHint}</span>
          </span>
        </label>
        <textarea className="field min-h-20" placeholder={t.notePh} value={note} onChange={(e) => setNote(e.target.value)} />
      </fieldset>

      {mapOpen && (
        <RouteMapSheet selectedId={delivery?.routeId} onPick={setRoute} onClose={() => setMapOpen(false)} />
      )}

      <fieldset className="space-y-2">
        <legend className="font-serif text-2xl text-white">{t.pay}</legend>
        <label className="flex cursor-pointer gap-3 rounded-2xl bg-black/35 p-4 ring-1 ring-white/15">
          <input type="radio" name="pay" checked={pay === "cash"} onChange={() => setPay("cash")} />
          <span className="text-white">{t.payCash}</span>
        </label>
        <label className="flex cursor-pointer gap-3 rounded-2xl bg-black/35 p-4 ring-1 ring-white/15">
          <input type="radio" name="pay" checked={pay === "keks"} onChange={() => setPay("keks")} />
          <span>
            <strong className="block text-white">{t.payKeks}</strong>
            <span className="text-sm text-white/55">{t.payKeksHint}</span>
          </span>
        </label>
        {pay === "keks" && (
          <div className="rounded-2xl bg-black/50 p-4 text-sm text-white">
            <p className="text-[11px] uppercase tracking-widest text-[#f0c94a]">{t.savedPay}</p>
            <p className="mt-2">{demoAccount.keks}</p>
          </div>
        )}
        <label className="flex cursor-pointer gap-3 rounded-2xl bg-black/35 p-4 ring-1 ring-white/15">
          <input type="radio" name="pay" checked={pay === "invoice"} onChange={() => setPay("invoice")} />
          <span className="text-white">{t.payInvoice}</span>
        </label>
        {pay === "invoice" && (
          <input className="field" placeholder={t.company} value={company} onChange={(e) => setCompany(e.target.value)} />
        )}
      </fieldset>

      <aside className="rounded-2xl bg-black/40 p-5">
        <h2 className="font-serif text-2xl text-white">{t.cart}</h2>
        <ul className="mt-4 space-y-3 text-sm text-white">
          {items.map((i) => (
            <li key={i.key} className="flex justify-between gap-3">
              <span>
                {i.qty}× {locale === "hr" ? i.dish.hr : i.dish.en}
              </span>
              <span>{formatPrice(i.dish.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        {delivery && (
          <p className="mt-4 text-sm text-white/60">
            {routeLabel(delivery.routeId, locale)}
            {chosen ? ` · ${chosen.window}` : ""}
            {delivery.type === "door" ? ` · ${t.door}` : ` · ${t.stop}`}
          </p>
        )}
        {deliveryFee > 0 && (
          <p className="mt-2 flex justify-between text-sm text-white/70">
            <span>{t.door}</span>
            <span>{formatPrice(deliveryFee)}</span>
          </p>
        )}
        {payFee > 0 && (
          <p className="mt-2 flex justify-between text-sm text-white/70">
            <span>{t.payFee}</span>
            <span>{formatPrice(payFee)}</span>
          </p>
        )}
        <p className="mt-4 flex justify-between text-white">
          <span>{t.total}</span>
          <span className="font-serif text-3xl">{formatPrice(grand)}</span>
        </p>
        {error && <p className="mt-3 text-sm text-[#e07a5f]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 mb-8 min-h-12 w-full rounded-md bg-[#d85a38] text-[17px] font-semibold text-white disabled:opacity-60"
        >
          {busy ? t.processing : t.payNow}
        </button>
      </aside>
    </form>
  );
}

function MapGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 21s7-6.2 7-11.2A7 7 0 1 0 5 9.8C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="9.5" r="2.2" fill="currentColor" />
    </svg>
  );
}
