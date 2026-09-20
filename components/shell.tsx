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
      <header className="sticky top-0 z-40 border-b border-white/15 bg-black/55 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3">
          <Link href="/" className="flex shrink-0 items-center rounded-lg bg-[#f4ead8] px-1.5 py-0.5 sm:rounded-xl sm:px-2 sm:py-1">
            <Image src="/logo.png" alt="MP Stina" width={160} height={50} className="h-8 w-auto sm:h-10" priority />
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
              className="min-h-10 rounded-full border border-white/30 px-3 py-2 text-xs font-semibold tracking-wide text-white"
              aria-label={locale === "hr" ? "Switch to English" : "Prebaci na hrvatski"}
            >
              {locale === "hr" ? "HR · EN" : "EN · HR"}
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative hidden min-h-10 rounded-full bg-[var(--terracotta)] px-4 py-2 text-sm font-semibold text-white sm:inline-flex sm:items-center"
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
      </header>
      <main className="relative z-10 flex-1 pb-28 sm:pb-0">{children}</main>
      <div className="relative z-10 px-4 pb-6 text-center text-xs leading-6 text-white/70 sm:hidden">
        <p>{t.footerPhone}</p>
        <p>{t.footerMail}</p>
        <p>{t.footerAddr}</p>
        <Link href="/kuhinja" className="mt-2 inline-block underline decoration-[var(--gold)] underline-offset-4">
          {t.navKitchen}
        </Link>
      </div>
      <footer className="relative z-10 mt-10 hidden border-t border-white/15 bg-black/50 backdrop-blur-md sm:mt-16 sm:block">
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
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/15 bg-black/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
        <Tab href="/" label={t.brand} active={path === "/"} icon="home" />
        <Tab href="/jelovnik" label={t.navMenu} active={path.startsWith("/jelovnik")} icon="menu" />
        <Tab href="/rute" label={t.navRoutes} active={path.startsWith("/rute")} icon="routes" />
        <Tab href="/kuca" label={t.navFamily} active={path.startsWith("/kuca")} icon="house" />
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold text-white/80"
        >
          <TabIcon name="cart" />
          {t.cart}
          {count > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--terracotta)] px-1 text-[10px] text-white">
              {count}
            </span>
          )}
        </button>
      </nav>
      {cartOpen && <CartDrawer />}
    </div>
  );
}

function Tab({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: "home" | "menu" | "routes" | "house";
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-center text-[10px] font-semibold leading-tight ${
        active ? "text-[var(--gold)]" : "text-white/80"
      }`}
    >
      <TabIcon name={icon} />
      <span className="line-clamp-1 w-full">{label}</span>
    </Link>
  );
}

function TabIcon({ name }: { name: "home" | "menu" | "routes" | "house" | "cart" }) {
  const common = "h-5 w-5 shrink-0";
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
      </svg>
    );
  }
  if (name === "menu") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    );
  }
  if (name === "routes") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <path d="M4 16h11l3-5H8L4 16z" />
        <circle cx="8" cy="17.5" r="1.5" />
        <circle cx="16" cy="17.5" r="1.5" />
      </svg>
    );
  }
  if (name === "house") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <path d="M5 20V9l7-5 7 5v11" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
      <path d="M6 7h15l-1.5 9H8L6 7z" />
      <path d="M6 7 5 4H2" />
      <circle cx="10" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}

function CartDrawer() {
  const { t, items, setQty, locale, subtotal, setCartOpen } = useStore();
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setCartOpen(false)}>
      <aside
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-[#1a1410] p-5 text-white shadow-2xl sm:p-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl">{t.cart}</h2>
          <button type="button" onClick={() => setCartOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-lg">
            ✕
          </button>
        </div>
        {items.length === 0 ? (
          <p className="mt-8 text-white/70">{t.emptyCart}</p>
        ) : (
          <ul className="mt-6 flex-1 space-y-4">
            {items.map((i) => (
              <li key={i.key} className="flex flex-col gap-3 border-b border-white/15 pb-4 sm:flex-row sm:gap-3">
                <div className="flex-1">
                  <p className="font-medium">{locale === "hr" ? i.dish.hr : i.dish.en}</p>
                  <p className="text-xs text-white/60">
                    {week.find((d) => d.date === i.date)
                      ? new Date(`${i.date}T12:00:00`).toLocaleDateString(locale === "hr" ? "hr-HR" : "en-GB")
                      : i.date}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button type="button" className="qty" onClick={() => setQty(i.key, i.qty - 1)}>
                      −
                    </button>
                    <span className="w-6 text-center">{i.qty}</span>
                    <button type="button" className="qty" onClick={() => setQty(i.key, i.qty + 1)}>
                      +
                    </button>
                  </div>
                  <p className="font-medium">{formatPrice(i.dish.price * i.qty)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="mt-auto border-t border-white/15 pt-4">
            <p className="flex justify-between text-lg">
              <span>{t.total}</span>
              <span>{formatPrice(subtotal)}</span>
            </p>
            <Link
              href="/blagajna"
              onClick={() => setCartOpen(false)}
              className="mt-4 block min-h-12 rounded-full bg-[var(--terracotta)] py-3 text-center font-semibold text-white"
            >
              {t.checkout}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
