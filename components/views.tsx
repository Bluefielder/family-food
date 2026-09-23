"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { SignedIn } from "@/components/signed-in";
import { DriverRun } from "@/components/driver-run";
import { OfficeDesk } from "@/components/office-desk";
import { KitchenDesk } from "@/components/kitchen-desk";
import { MenuApp } from "@/components/menu-app";
import { DOOR_FEE, KEKS_FEE, formatPrice, routeAreas, routes } from "@/lib/data";
import { routeLabel, useStore } from "@/lib/store";

export function HomeView() {
  const { t } = useStore();
  return (
    <div className="px-4 pb-8 pt-6 text-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f0c94a]">{t.heroKicker}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight">{t.heroTitle}</h1>
      <p className="mt-4 text-base leading-7 text-white/70">{t.heroLead}</p>
      <div className="mt-5">
        <SignedIn />
      </div>
      <Link
        href="/jelovnik"
        className="mt-6 grid min-h-12 place-items-center rounded-md bg-[#d85a38] text-[17px] font-semibold"
      >
        {t.ctaOrder}
      </Link>
      <p className="mt-6 text-sm text-white/55">{t.cutoffBar}</p>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <Stat n="7–8 €" l={t.plate} />
        <Stat n="10" l={t.navRoutes} />
        <Stat n="2008" l={t.since} />
      </div>
      <Link href="/rute" className="mt-6 block rounded-2xl bg-black/40 p-4">
        <h2 className="font-serif text-2xl">{t.navRoutes}</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">{t.routesLead}</p>
      </Link>
      <Link href="/kuca" className="mt-3 block rounded-2xl bg-black/40 p-4">
        <h2 className="font-serif text-2xl">{t.navFamily}</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">{t.familyLead}</p>
      </Link>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl bg-black/40 py-3">
      <p className="font-serif text-lg">{n}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-white/50">{l}</p>
    </div>
  );
}

export function MenuPage() {
  return <MenuApp />;
}

export function RoutesPage() {
  const { t, locale } = useStore();
  return (
    <div className="px-4 pb-8 pt-6 text-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f0c94a]">{t.navRoutes}</p>
      <h1 className="mt-2 font-serif text-3xl leading-tight">{t.routesTitle}</h1>
      <p className="mt-3 text-sm leading-6 text-white/65">{t.routesLead}</p>
      <div className="mt-5 rounded-2xl bg-black/40 p-4">
        <p className="text-[11px] uppercase tracking-widest text-[#f0c94a]">{t.woltNo}</p>
        <p className="mt-2 text-sm leading-6 text-white/75">{t.woltBody}</p>
      </div>
      <div className="mt-8 space-y-7">
        {routeAreas.map((area) => (
          <section key={area.id}>
            <h2 className="font-serif text-2xl">{locale === "hr" ? area.hr : area.en}</h2>
            <ul className="mt-3 space-y-2">
              {routes
                .filter((r) => r.area === area.id)
                .map((r) => (
                  <li key={r.id} className="rounded-2xl bg-black/35 p-4">
                    <p className="font-medium">{locale === "hr" ? r.hr : r.en}</p>
                    {(r.infoHr || r.infoEn) && (
                      <p className="mt-1 text-sm text-white/50">{locale === "hr" ? r.infoHr : r.infoEn}</p>
                    )}
                    <p className="mt-2 font-serif text-xl text-[#f0c94a]">{r.window}</p>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function FamilyPage() {
  const { t } = useStore();
  return (
    <div className="px-4 pb-8 pt-6 text-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f0c94a]">{t.navFamily}</p>
      <h1 className="mt-3 font-serif text-3xl leading-tight">{t.familyTitle}</h1>
      <p className="mt-4 text-base leading-7 text-white/70">{t.familyLead}</p>
      <div className="mt-8 space-y-4 text-sm leading-7 text-white/80">
        <p>{t.familyP1}</p>
        <p>{t.familyP2}</p>
        <p>{t.familyP3}</p>
      </div>
      <p className="mt-8 text-sm text-white/50">
        {t.footerPhone}
        <span className="mt-1 block">{t.footerMail}</span>
        <span className="mt-1 block">{t.footerAddr}</span>
      </p>
    </div>
  );
}

export function CheckoutPage() {
  const { t } = useStore();
  return (
    <div className="px-4 pb-8 pt-6 text-white">
      <h1 className="font-serif text-4xl">{t.checkout}</h1>
      <p className="mt-2 text-sm text-white/60">{t.demoPay}</p>
      <div className="mt-6">
        <CheckoutForm />
      </div>
    </div>
  );
}

export function ThanksPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const { t, locale, orders } = useStore();
  const order = orders.find((o) => o.id === id);

  return (
    <div className="px-4 py-10 text-center text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c94a]">{t.orderNo}</p>
      <h1 className="mt-3 font-serif text-4xl">{t.thanks}</h1>
      <p className="mt-4 text-lg text-white/75">{t.thanksLead}</p>
      <p className="mt-4 rounded-2xl bg-[#f0c94a] px-4 py-3 text-sm font-semibold text-[#1a1816]">
        {t.emailKitchen}
        <span className="mt-1 block text-xs font-normal opacity-80">{t.emailKitchenHint}</span>
      </p>
      {order && (
        <div className="mt-10 rounded-3xl bg-black/40 p-6 text-left">
          <p className="font-mono text-sm">{order.id}</p>
          <p className="mt-2">{order.name}</p>
          <p className="text-sm text-white/60">
            {routeLabel(order.delivery.routeId, locale)}
            {order.delivery.address ? ` · ${order.delivery.address}` : ""}
          </p>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((i) => (
              <li key={i.key}>
                {i.qty}× {locale === "hr" ? i.dish.hr : i.dish.en}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-serif text-2xl">
            {formatPrice(
              order.items.reduce((s, i) => s + i.dish.price * i.qty, 0) +
                (order.delivery.type === "door" ? DOOR_FEE : 0) +
                (order.pay === "keks" ? KEKS_FEE : 0),
            )}
          </p>
        </div>
      )}
      <Link href="/jelovnik" className="mt-10 inline-block rounded-md bg-[#d85a38] px-6 py-3 font-semibold text-white">
        {t.navMenu}
      </Link>
    </div>
  );
}

export function KitchenPage() {
  return <KitchenDesk />;
}

export function OfficePage() {
  return <OfficeDesk />;
}

export function DriverPage() {
  return <DriverRun />;
}
