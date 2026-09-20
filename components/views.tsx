"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { KitchenBoard } from "@/components/kitchen-board";
import { MenuBoard, TodayPreview } from "@/components/menu-board";
import { formatPrice, routes } from "@/lib/data";
import { routeLabel, useStore } from "@/lib/store";

export function HomeView() {
  const { t } = useStore();
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="hero-wash" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-end gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">{t.heroKicker}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-7xl">{t.heroTitle}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">{t.heroLead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/jelovnik" className="rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white">
                {t.ctaOrder}
              </Link>
              <Link href="/rute" className="rounded-full bg-white/80 px-6 py-3 font-semibold ring-1 ring-[var(--line)]">
                {t.navRoutes}
              </Link>
            </div>
          </div>
          <div className="steam-card rounded-[2rem] p-6">
            <p className="font-serif text-2xl">{t.tagline}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{t.cutoff}</p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Stat n="7–8 €" l={t.plate} />
              <Stat n="10" l={t.navRoutes} />
              <Stat n="2008" l={t.since} />
            </div>
          </div>
        </div>
      </section>
      <TodayPreview />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 lg:grid-cols-3">
        <IdeaCard title={t.weekPlan} body={t.weekPlanLead} href="/jelovnik" />
        <IdeaCard title={t.office} body={t.officeLead} href="/blagajna" />
        <IdeaCard title={t.door} body={t.doorHint} href="/rute" />
      </section>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl bg-[var(--paper)]/80 py-4">
      <p className="font-serif text-xl">{n}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-[var(--ink-soft)]">{l}</p>
    </div>
  );
}

function IdeaCard({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="rounded-[1.75rem] bg-white/70 p-6 ring-1 ring-[var(--line)]">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{body}</p>
    </Link>
  );
}

export function MenuPage() {
  const { t } = useStore();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.navMenu}</p>
      <h1 className="mt-2 font-serif text-5xl">{t.ctaWeek}</h1>
      <div className="mt-10">
        <MenuBoard highlightToday />
      </div>
    </div>
  );
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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.navRoutes}</p>
      <h1 className="mt-2 max-w-3xl font-serif text-4xl sm:text-5xl">{t.routesTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">{t.routesLead}</p>
      <div className="mt-8 rounded-[2rem] bg-[var(--ink)] p-6 text-[var(--paper)] sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">{t.woltNo}</p>
        <p className="mt-3 max-w-2xl leading-7">{t.woltBody}</p>
      </div>
      <div className="mt-12 space-y-10">
        {areas.map((area) => (
          <section key={area.id}>
            <h2 className="font-serif text-3xl">{locale === "hr" ? area.hr : area.en}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {routes
                .filter((r) => r.area === area.id)
                .map((r) => (
                  <li key={r.id} className="rounded-2xl bg-white/70 p-5 ring-1 ring-[var(--line)]">
                    <p className="font-medium">{locale === "hr" ? r.hr : r.en}</p>
                    {(r.infoHr || r.infoEn) && (
                      <p className="mt-1 text-sm text-[var(--ink-soft)]">{locale === "hr" ? r.infoHr : r.infoEn}</p>
                    )}
                    <p className="mt-3 font-serif text-xl">{r.window}</p>
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
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.navFamily}</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight">{t.familyTitle}</h1>
      <p className="mt-6 text-lg leading-8 text-[var(--ink-soft)]">{t.familyLead}</p>
      <div className="mt-10 space-y-4 text-base leading-8">
        {paras.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { t } = useStore();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-5xl">{t.checkout}</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{t.demoPay}</p>
      <div className="mt-10">
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
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.orderNo}</p>
      <h1 className="mt-3 font-serif text-5xl">{t.thanks}</h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)]">{t.thanksLead}</p>
      {order && (
        <div className="mt-10 rounded-3xl bg-white/80 p-6 text-left ring-1 ring-[var(--line)]">
          <p className="font-mono text-sm">{order.id}</p>
          <p className="mt-2">{order.name}</p>
          <p className="text-sm text-[var(--ink-soft)]">
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-5xl">{t.kitchenTitle}</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">{t.kitchenLead}</p>
      <div className="mt-10">
        <KitchenBoard />
      </div>
    </div>
  );
}
