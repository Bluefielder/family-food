"use client";

import { useEffect, useRef, useState } from "react";
import { routeLabel, useStore } from "@/lib/store";

function ding() {
  try {
    const ctx = new AudioContext();
    const beep = (freq: number, at: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.09, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
      o.start(at);
      o.stop(at + 0.24);
    };
    beep(880, ctx.currentTime);
    beep(1174, ctx.currentTime + 0.18);
  } catch {
    /* ignore */
  }
}

export function KitchenAlert() {
  const { t, locale, orders } = useStore();
  const seen = useRef<Set<string> | null>(null);
  const [toast, setToast] = useState<{ id: string; name: string; route: string } | null>(null);

  useEffect(() => {
    if (seen.current === null) {
      seen.current = new Set(orders.map((o) => o.id));
      return;
    }
    const fresh = orders.filter((o) => !seen.current?.has(o.id) && o.status === "new");
    for (const o of fresh) seen.current.add(o.id);
    const latest = fresh[0];
    if (!latest) return;
    ding();
    setToast({
      id: latest.id,
      name: latest.name,
      route: routeLabel(latest.delivery.routeId, locale),
    });
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(`${t.newOrder} · ${latest.name}`, { body: `${routeLabel(latest.delivery.routeId, locale)} · ${latest.id}` });
    }
  }, [orders, locale, t.newOrder]);

  if (!toast) return null;
  return (
    <div className="fixed inset-x-0 top-16 z-[70] mx-auto w-full max-w-[430px] px-3" role="status">
      <div className="rounded-2xl bg-[#f0c94a] px-4 py-3 text-[#1a1816] shadow-xl">
        <p className="text-[11px] font-bold uppercase tracking-widest">{t.newOrder}</p>
        <p className="mt-1 font-serif text-xl">{toast.name}</p>
        <p className="text-sm">
          {toast.route} · {toast.id}
        </p>
        <button type="button" onClick={() => setToast(null)} className="mt-2 min-h-10 w-full rounded-md bg-[#1a1816] text-sm font-semibold text-white">
          {t.dismiss}
        </button>
      </div>
    </div>
  );
}

export function newOrderCount(orders: { status: string; createdAt: string }[]) {
  const now = Date.now();
  return orders.filter((o) => {
    if (o.status !== "new") return false;
    const t = Date.parse(o.createdAt);
    return t <= now + 5000 && t > now - 15 * 60 * 1000;
  }).length;
}
