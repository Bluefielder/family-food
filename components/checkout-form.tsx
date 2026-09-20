"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice, routes } from "@/lib/data";
import { routeLabel, useStore, type PayMethod } from "@/lib/store";

export function CheckoutForm() {
  const router = useRouter();
  const { t, locale, items, subtotal, delivery, setDelivery, deliveryFee, total, placeOrder } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [pay, setPay] = useState<PayMethod>("card");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return <p className="text-[var(--ink-soft)]">{t.emptyCart}</p>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError(locale === "hr" ? "Ime i mobitel su obavezni." : "Name and mobile are required.");
      return;
    }
    if (!delivery) {
      setError(locale === "hr" ? "Odaberi rutu dostave." : "Choose a delivery route.");
      return;
    }
    if (delivery.type === "door" && !address.trim()) {
      setError(locale === "hr" ? "Upiši adresu za vrata." : "Enter the door address.");
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1100));
    const order = placeOrder({
      name,
      phone,
      email,
      note,
      company,
      delivery: delivery.type === "door" ? { ...delivery, address } : delivery,
      pay,
      paid: pay === "card",
      source: "web",
    });
    router.push(`/hvala?id=${order.id}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <fieldset className="space-y-3">
          <legend className="font-serif text-3xl">{t.delivery}</legend>
          <label className="flex cursor-pointer gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-[var(--line)]">
            <input
              type="radio"
              name="del"
              checked={delivery?.type !== "door"}
              onChange={() => setDelivery({ type: "stop", routeId: delivery?.routeId ?? routes[0].id })}
            />
            <span>
              <strong className="block">{t.stop}</strong>
            </span>
          </label>
          <label className="flex cursor-pointer gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-[var(--line)]">
            <input
              type="radio"
              name="del"
              checked={delivery?.type === "door"}
              onChange={() =>
                setDelivery({
                  type: "door",
                  routeId: delivery?.routeId ?? routes[0].id,
                  address,
                })
              }
            />
            <span>
              <strong className="block">{t.door}</strong>
              <span className="text-sm text-[var(--ink-soft)]">{t.doorHint}</span>
            </span>
          </label>
          <label className="block text-sm font-medium">
            {t.pickRoute}
            <select
              className="field mt-1"
              value={delivery?.routeId ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                if (delivery?.type === "door") setDelivery({ type: "door", routeId: id, address });
                else setDelivery({ type: "stop", routeId: id });
              }}
            >
              <option value="">{locale === "hr" ? "—" : "—"}</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {(locale === "hr" ? r.hr : r.en) + " · " + r.window}
                </option>
              ))}
            </select>
          </label>
          {delivery?.type === "door" && (
            <label className="block text-sm font-medium">
              {t.address}
              <input className="field mt-1" value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-serif text-3xl">{t.name}</legend>
          <input className="field" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="field" placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="field" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea className="field min-h-24" placeholder={t.notePh} value={note} onChange={(e) => setNote(e.target.value)} />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-serif text-3xl">{t.pay}</legend>
          {(["card", "cash", "invoice"] as PayMethod[]).map((m) => (
            <label key={m} className="flex cursor-pointer gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-[var(--line)]">
              <input type="radio" name="pay" checked={pay === m} onChange={() => setPay(m)} />
              <span>{m === "card" ? t.payCard : m === "cash" ? t.payCash : t.payInvoice}</span>
            </label>
          ))}
          {pay === "card" && (
            <div className="rounded-2xl bg-[var(--ink)] p-5 text-[var(--paper)]">
              <p className="text-xs uppercase tracking-widest text-[var(--gold)]">{t.demoPay}</p>
              <label className="mt-3 block text-sm">
                {t.cardNumber}
                <input
                  className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 tracking-widest"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                />
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input className="rounded-lg bg-white/10 px-3 py-2" placeholder={t.expiry} defaultValue="12/28" />
                <input className="rounded-lg bg-white/10 px-3 py-2" placeholder={t.cvc} defaultValue="123" />
              </div>
            </div>
          )}
          {pay === "invoice" && (
            <input className="field" placeholder={t.company} value={company} onChange={(e) => setCompany(e.target.value)} />
          )}
        </fieldset>
      </div>

      <aside className="h-fit rounded-3xl bg-white/80 p-6 ring-1 ring-[var(--line)]">
        <h2 className="font-serif text-2xl">{t.cart}</h2>
        <ul className="mt-4 space-y-3 text-sm">
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
          <p className="mt-4 text-sm text-[var(--ink-soft)]">
            {routeLabel(delivery.routeId, locale)}
            {delivery.type === "door" ? ` · ${t.door}` : ` · ${t.stop}`}
          </p>
        )}
        <p className="mt-4 flex justify-between">
          <span>{t.total}</span>
          <span>
            {formatPrice(subtotal)}
            {deliveryFee ? ` + ${formatPrice(deliveryFee)}` : ""}
          </span>
        </p>
        <p className="mt-1 text-right font-serif text-3xl">{formatPrice(total)}</p>
        {error && <p className="mt-3 text-sm text-[var(--terracotta)]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-[var(--terracotta)] py-3 font-semibold text-white disabled:opacity-60"
        >
          {busy ? t.processing : t.payNow}
        </button>
      </aside>
    </form>
  );
}
