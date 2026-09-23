"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { KitchenBoard } from "@/components/kitchen-board";
import { MenuApp } from "@/components/menu-app";
import { MenuBoard, TodayPreview } from "@/components/menu-board";
import { formatPrice, routes } from "@/lib/data";
import { routeLabel, useStore } from "@/lib/store";

export function HomeView() {
  const { t } = useStore();
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="hero-wash" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-end gap-6 px-4 py-8 sm:gap-10 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gold)] sm:text-xs sm:tracking-[0.25em]">{t.heroKicker}</p>
            <h1 className="mt-3 font-serif text-[2.15rem] leading-[1.08] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.65)] sm:mt-4 sm:text-5xl lg:text-7xl">{t.heroTitle}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] sm:mt-6 sm:text-lg sm:leading-8">{t.heroLead}</p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link href="/jelovnik" className="min-h-12 rounded-full bg-[var(--terracotta)] px-6 py-3 text-center font-semibold text-white">
                {t.ctaOrder}
              </Link>
              <Link href="/rute" className="min-h-12 rounded-full bg-black/50 px-6 py-3 text-center font-semibold text-white ring-1 ring-white/30 backdrop-blur">
                {t.navRoutes}
              </Link>
            </div>
          </div>
          <div className="steam-card rounded-[2rem] p-6">
            <p className="font-serif text-2xl text-white">{t.tagline}</p>
            <p className="mt-3 text-sm leading-6 text-white/75">{t.cutoff}</p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Stat n="7–8 €" l={t.plate} />
              <Stat n="10" l={t.navRoutes} />
              <Stat n="2008" l={t.since} />
            </div>
          </div>
        </div>
      </section>
      <TodayPreview />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-8 sm:gap-6 sm:pb-20 lg:grid-cols-3">
        <IdeaCard title={t.weekPlan} body={t.weekPlanLead} href="/jelovnik" />
        <IdeaCard title={t.office} body={t.officeLead} href="/blagajna" />
        <IdeaCard title={t.door} body={t.doorHint} href="/rute" />
      </section>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl bg-black/35 py-4">
      <p className="font-serif text-xl text-white">{n}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-white/65">{l}</p>
    </div>
  );
}

function IdeaCard({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="panel rounded-[1.75rem] p-6">
      <h3 className="font-serif text-2xl text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/75">{body}</p>
    </Link>
  );
}

export function MenuPage() {
  return <MenuApp />;
}

export function RoutesPage() {
  const { t, locale } = useStore();
  const areas = [
    { id: "centar", hr: "Centar", en: "Centre" },
    { id: "zapad", hr: "Zapad", en: "West" },
    { id: "istok", hr: "Istok", en: "East" },
    { id: "okolica", hr: "Okolica", en: "Around Rijeka" },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.navRoutes}</p>
      <h1 className="mt-2 max-w-3xl font-serif text-[1.85rem] leading-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-4xl lg:text-5xl">{t.routesTitle}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">{t.routesLead}</p>
      <div className="panel mt-6 rounded-[1.5rem] p-4 sm:mt-8 sm:rounded-[2rem] sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">{t.woltNo}</p>
        <p className="mt-3 max-w-2xl leading-7 text-white/90">{t.woltBody}</p>
      </div>
      <div className="mt-12 space-y-10">
        {areas.map((area) => (
          <section key={area.id}>
            <h2 className="font-serif text-3xl text-white">{locale === "hr" ? area.hr : area.en}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {routes
                .filter((r) => r.area === area.id)
                .map((r) => (
                  <li key={r.id} className="panel rounded-2xl p-5">
                    <p className="font-medium text-white">{locale === "hr" ? r.hr : r.en}</p>
                    {(r.infoHr || r.infoEn) && (
                      <p className="mt-1 text-sm text-white/70">{locale === "hr" ? r.infoHr : r.infoEn}</p>
                    )}
                    <p className="mt-3 font-serif text-xl text-[var(--gold)]">{r.window}</p>
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
  const { t, locale } = useStore();
  const paras =
    locale === "hr"
      ? [
          "Fažol u srijedu. Maneštra u četvrtak. Srdele u petak. To nije marketinški ritam — to je kako se ovdje jede kad netko kuha za svoje.",
          "Kuhinja je u Šmrici. Rijeka dobiva ručak u točno vrijeme jer kombiji voze rute, ne nasumične adrese. Zato tanjur stoji 7 eura, a ne 14.",
          "Ako želiš vrata, reci. Vozač ionako prolazi tvoj kvart. Samo ne damo četvrtinu ručka aplikaciji koja nije kuhala juhu.",
        ]
      : [
          "Bean stew on Wednesday. Maneštra on Thursday. Sardines on Friday. That is not a marketing cadence — that is how people eat here when someone cooks for their own.",
          "The kitchen is in Šmrika. Rijeka gets lunch on time because the vans run routes, not random pins. That is why a plate is €7, not €14.",
          "If you want the door, say so. The driver already passes your street. We just will not give a quarter of the lunch to an app that never stirred the soup.",
        ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.navFamily}</p>
      <h1 className="mt-3 font-serif text-[1.85rem] leading-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-5xl">{t.familyTitle}</h1>
      <div className="panel mt-6 rounded-[1.5rem] p-5 sm:mt-8 sm:rounded-[2rem] sm:p-8">
        <p className="text-lg leading-8 text-white/90">{t.familyLead}</p>
        <div className="mt-8 space-y-4 text-base leading-8 text-white/85">
          {paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { t } = useStore();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <h1 className="font-serif text-4xl text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-5xl">{t.checkout}</h1>
      <p className="mt-2 text-sm text-white/75">{t.demoPay}</p>
      <div className="panel mt-6 rounded-[1.5rem] p-4 sm:mt-10 sm:rounded-[2rem] sm:p-8">
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
    <div className="mx-auto max-w-xl px-4 py-10 text-center sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.orderNo}</p>
      <h1 className="mt-3 font-serif text-4xl text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-5xl">{t.thanks}</h1>
      <p className="mt-4 text-lg text-white/85">{t.thanksLead}</p>
      {order && (
        <div className="panel mt-10 rounded-3xl p-6 text-left">
          <p className="font-mono text-sm">{order.id}</p>
          <p className="mt-2">{order.name}</p>
          <p className="text-sm text-white/70">
            {routeLabel(order.delivery.routeId, locale)}
            {order.delivery.type === "door" ? ` · ${order.delivery.address}` : ""}
          </p>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((i) => (
              <li key={i.key}>
                {i.qty}× {locale === "hr" ? i.dish.hr : i.dish.en}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-serif text-2xl">
            {formatPrice(order.items.reduce((s, i) => s + i.dish.price * i.qty, 0) + (order.delivery.type === "door" ? 1.5 : 0))}
          </p>
        </div>
      )}
      <Link href="/jelovnik" className="mt-10 inline-block rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white">
        {t.navMenu}
      </Link>
    </div>
  );
}

export function KitchenPage() {
  const { t } = useStore();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="font-serif text-4xl text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-5xl">{t.kitchenTitle}</h1>
      <p className="mt-3 max-w-2xl text-white/85">{t.kitchenLead}</p>
      <div className="mt-10">
        <KitchenBoard />
      </div>
    </div>
  );
}
