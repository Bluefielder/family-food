"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FoodCollage } from "@/components/food-collage";
import { formatPrice, week } from "@/lib/data";
import { useStore } from "@/lib/store";

export function Shell({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale, items, setCartOpen, cartOpen } = useStore();
  const count = items.reduce((s, i) => s + i.qty, 0);
  const path = usePathname();

  const links = [
    { href: "/jelovnik", label: t.navMenu },
    { href: "/rute", label: t.navRoutes },
    { href: "/kuca", label: t.navFamily },
  ];

  return (
    <div className="relative z-10 min-h-full flex flex-col">
      <FoodCollage />
      <header className="sticky top-0 z-40 border-b border-white/15 bg-black/45 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3 shrink-0 rounded-xl bg-[#f4ead8] px-2 py-1">
            <Image src="/logo.png" alt="MP Stina" width={160} height={50} className="h-10 w-auto" priority />
          </Link>
          <nav className="ml-auto hidden items-center gap-6 text-sm font-medium sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={path === l.href ? "text-[var(--gold)]" : "text-white/80 hover:text-white"}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:ml-4">
            <button
              type="button"
              onClick={() => setLocale(locale === "hr" ? "en" : "hr")}
              className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold tracking-wide text-white"
              aria-label={locale === "hr" ? "Switch to English" : "Prebaci na hrvatski"}
            >
              {locale === "hr" ? "HR · EN" : "EN · HR"}
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-full bg-[var(--terracotta)] px-4 py-2 text-sm font-semibold text-white"
            >
              {t.cart}
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--ink)] px-1 text-[11px] text-[var(--paper)]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-white/15 px-4 py-2 text-sm sm:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap text-white/80">
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="relative z-10 flex-1">{children}</main>
      <footer className="relative z-10 mt-16 border-t border-white/15 bg-black/50 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          <div>
            <p className="font-serif text-2xl text-white">{t.brand}</p>
            <p className="mt-1 text-sm text-white/75">{t.tagline}</p>
          </div>
          <div className="text-sm leading-7 text-white/85">
            <p>{t.footerPhone}</p>
            <p>{t.footerMail}</p>
            <p>{t.footerAddr}</p>
          </div>
          <div className="text-sm text-white/75">
            <Link href="/kuhinja" className="underline decoration-[var(--gold)] underline-offset-4">
              {t.navKitchen}
            </Link>
            <p className="mt-3">{t.cutoff}</p>
          </div>
        </div>
      </footer>
      {cartOpen && <CartDrawer />}
    </div>
  );
}

function CartDrawer() {
  const { t, items, setQty, locale, subtotal, setCartOpen } = useStore();
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setCartOpen(false)}>
      <aside
        className="h-full w-full max-w-md overflow-y-auto bg-[#1a1410] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl">{t.cart}</h2>
          <button type="button" onClick={() => setCartOpen(false)} className="text-sm">
            ✕
          </button>
        </div>
        {items.length === 0 ? (
          <p className="mt-8 text-white/70">{t.emptyCart}</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {items.map((i) => (
                <li key={i.key} className="flex gap-3 border-b border-white/15 pb-4">
                <div className="flex-1">
                  <p className="font-medium">{locale === "hr" ? i.dish.hr : i.dish.en}</p>
                  <p className="text-xs text-white/60">
                    {week.find((d) => d.date === i.date)
                      ? new Date(`${i.date}T12:00:00`).toLocaleDateString(locale === "hr" ? "hr-HR" : "en-GB")
                      : i.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="qty" onClick={() => setQty(i.key, i.qty - 1)}>
                    −
                  </button>
                  <span className="w-6 text-center">{i.qty}</span>
                  <button type="button" className="qty" onClick={() => setQty(i.key, i.qty + 1)}>
                    +
                  </button>
                </div>
                <p className="w-16 text-right font-medium">{formatPrice(i.dish.price * i.qty)}</p>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="mt-6">
            <p className="flex justify-between text-lg">
              <span>{t.total}</span>
              <span>{formatPrice(subtotal)}</span>
            </p>
            <Link
              href="/blagajna"
              onClick={() => setCartOpen(false)}
              className="mt-4 block rounded-full bg-[var(--terracotta)] py-3 text-center font-semibold text-white"
            >
              {t.checkout}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
