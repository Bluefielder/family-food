"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatPrice, week } from "@/lib/data";
import { useStore } from "@/lib/store";

export function Shell({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale, items, setCartOpen, cartOpen } = useStore();
  const count = items.reduce((s, i) => s + i.qty, 0);
  const path = usePathname();
  const staffApp = path.startsWith("/kuhinja") || path.startsWith("/vozac") || path.startsWith("/ured");
  const menuScreen = path.startsWith("/jelovnik");

  if (staffApp) {
    return (
      <div className="min-h-dvh bg-black text-white">
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#1c1a18]">
          <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/10 bg-[#1c1a18] px-4 py-3">
            <Link href="/ured" className="font-serif text-xl">
              {t.brand}
            </Link>
            <span className="text-[11px] uppercase tracking-widest text-white/40">{t.staffHome}</span>
            <button
              type="button"
              onClick={() => setLocale(locale === "hr" ? "en" : "hr")}
              className="ml-auto min-h-11 rounded-full border border-white/25 px-3 text-xs font-semibold"
              aria-label={locale === "hr" ? t.switchToEn : t.switchToHr}
            >
              {locale === "hr" ? "HR" : "EN"}
            </button>
          </header>
          <main className="flex-1">{children}</main>
          <nav className="sticky bottom-0 z-40 grid grid-cols-3 border-t border-white/15 bg-[#141210] pb-[env(safe-area-inset-bottom)]">
            <StaffTab href="/ured" label={t.staffOffice} active={path.startsWith("/ured")} />
            <StaffTab href="/kuhinja" label={t.staffKitchen} active={path.startsWith("/kuhinja")} />
            <StaffTab href="/vozac" label={t.staffDriver} active={path.startsWith("/vozac")} />
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#3E3A37]">
        {!menuScreen && (
          <header className="sticky top-0 z-40 flex items-center justify-between bg-black px-3 py-2">
            <Link href="/">
              <Image src="/logo.png" alt={t.brand} width={400} height={114} className="h-11 w-auto" priority />
            </Link>
            <button
              type="button"
              onClick={() => setLocale(locale === "hr" ? "en" : "hr")}
              className="min-h-11 rounded-full border border-white/70 px-3 text-[11px] font-semibold"
              aria-label={locale === "hr" ? t.switchToEn : t.switchToHr}
            >
              {locale === "hr" ? "HR" : "EN"}
            </button>
          </header>
        )}
        <main className="flex-1">{children}</main>
        <nav className="sticky bottom-0 z-40 grid grid-cols-5 border-t border-white/15 bg-black pb-[env(safe-area-inset-bottom)]">
          <Tab href="/" label={t.brand} active={path === "/"} icon="home" />
          <Tab href="/jelovnik" label={t.navMenu} active={path.startsWith("/jelovnik")} icon="menu" />
          <Tab href="/rute" label={t.navRoutes} active={path.startsWith("/rute")} icon="routes" />
          <Tab href="/kuca" label={t.navFamily} active={path.startsWith("/kuca")} icon="house" />
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold ${
              path.startsWith("/blagajna") ? "text-[#f0c94a]" : "text-white/80"
            }`}
          >
            <TabIcon name="cart" />
            {t.cart}
            {count > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#f0c94a] px-1 text-[10px] text-black">
                {count}
              </span>
            )}
          </button>
        </nav>
        {cartOpen && <CartDrawer />}
      </div>
    </div>
  );
}

function StaffTab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex min-h-14 items-center justify-center px-1 text-center text-[12px] font-semibold ${
        active ? "text-[#f0c94a]" : "text-white/75"
      }`}
    >
      {label}
    </Link>
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
        active ? "text-[#f0c94a]" : "text-white/80"
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
    <div className="fixed inset-0 z-50 flex justify-center bg-black/50" onClick={() => setCartOpen(false)}>
      <aside
        className="h-full w-full max-w-[430px] overflow-y-auto bg-[#14110e] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl">{t.cart}</h2>
          <button type="button" onClick={() => setCartOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10">
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
                  <p className="text-xs text-white/55">
                    {week.find((d) => d.date === i.date)
                      ? new Date(`${i.date}T12:00:00`).toLocaleDateString(locale === "hr" ? "hr-HR" : "en-GB")
                      : i.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="qty text-white" onClick={() => setQty(i.key, i.qty - 1)}>
                    −
                  </button>
                  <span className="w-6 text-center">{i.qty}</span>
                  <button type="button" className="qty text-white" onClick={() => setQty(i.key, i.qty + 1)}>
                    +
                  </button>
                </div>
                <p className="w-16 text-right font-medium">{formatPrice(i.dish.price * i.qty)}</p>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="mt-6 pb-[env(safe-area-inset-bottom)]">
            <p className="flex justify-between text-lg">
              <span>{t.total}</span>
              <span>{formatPrice(subtotal)}</span>
            </p>
            <Link
              href="/blagajna"
              onClick={() => setCartOpen(false)}
              className="mt-4 block min-h-12 rounded-md bg-[#d85a38] py-3 text-center font-semibold text-white"
            >
              {t.checkout}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
