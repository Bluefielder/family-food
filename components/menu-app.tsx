"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SignedIn } from "@/components/signed-in";
import { bannerSrc, menuForDate, nextWeekdays, todayISO, todayMenu, type Category, type Dish } from "@/lib/data";
import { type Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";

const ICONS: { id: Category; src: string; labelHr: string; labelEn: string }[] = [
  { id: "mains", src: "/icons/main.png", labelHr: "Glavna", labelEn: "Mains" },
  { id: "salads", src: "/icons/salads.png", labelHr: "Salate", labelEn: "Salads" },
  { id: "sandwiches", src: "/icons/sandwiches.png", labelHr: "Sendviči", labelEn: "Sandwiches" },
  { id: "sides", src: "/icons/sides.png", labelHr: "Prilozi", labelEn: "Sides" },
  { id: "desserts", src: "/icons/deserts.png", labelHr: "Deserti", labelEn: "Desserts" },
];

const WD_HR = ["ned", "pon", "uto", "sri", "čet", "pet", "sub"];
const WD_EN = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

function weekdayLabel(date: string, locale: Locale) {
  const d = new Date(`${date}T12:00:00`);
  return locale === "hr" ? WD_HR[d.getDay()] : WD_EN[d.getDay()];
}

function chipPrice(n: number) {
  return `€${n.toFixed(2)}`;
}

export function MenuApp() {
  const { locale, t, setLocale, add, items } = useStore();
  const today = todayISO();
  const days = nextWeekdays(today, 6);
  const [date, setDate] = useState(todayMenu().date);
  const [category, setCategory] = useState<Category>("mains");
  const day = menuForDate(days.includes(date) ? date : days[0]);

  const dishes = useMemo(
    () => day.dishes.filter((d) => d.category === category),
    [day, category],
  );

  return (
    <div className="flex w-full flex-col bg-[#3E3A37] pb-4 text-white">
      <header className="relative bg-black">
        <div className="relative aspect-[1024/218] w-full overflow-hidden">
          <Image
            src={bannerSrc(date, category)}
            alt=""
            fill
            sizes="430px"
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/55 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between px-3 pt-2">
            <Image src="/logo.png" alt="MP Stina" width={400} height={114} className="h-[52px] w-auto" priority />
            <button
              type="button"
              onClick={() => setLocale(locale === "hr" ? "en" : "hr")}
              className="min-h-8 rounded-full border border-white/70 px-3 text-[11px] font-semibold tracking-wide"
              aria-label={locale === "hr" ? t.switchToEn : t.switchToHr}
            >
              {locale === "hr" ? "HR" : "ENG"}
            </button>
          </div>
        </div>
        <div className="bg-black px-3 pb-2">
          <SignedIn />
        </div>
        <div className="grid grid-cols-6 gap-1.5 bg-black px-2 py-2">
          {days.map((d) => {
            const selected = d === date;
            const isToday = d === today;
            const dayNum = new Date(`${d}T12:00:00`).getDate();
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDate(d)}
                className={`flex h-[56px] w-full flex-col items-center justify-center rounded-xl text-center leading-none ${
                  selected ? "text-white ring-2 ring-white" : "text-white/50 ring-1 ring-white/40"
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  {isToday ? t.todayChip : weekdayLabel(d, locale)}
                </span>
                <span className="mt-0.5 text-[22px] font-medium leading-none">{dayNum}</span>
              </button>
            );
          })}
        </div>
        <p className="flex h-8 items-center justify-center bg-[#f0c94a] px-3 text-center text-[13px] font-medium leading-tight text-black">
          {t.cutoffBar}
        </p>
        <nav className="grid grid-cols-5 bg-black px-1 py-2" aria-label={t.navMenu}>
          {ICONS.map((icon) => {
            const active = category === icon.id;
            return (
              <button
                key={icon.id}
                type="button"
                onClick={() => setCategory(icon.id)}
                className={`flex min-h-16 flex-col items-center justify-center ${
                  active ? "opacity-100" : "opacity-45"
                }`}
                aria-pressed={active}
                aria-label={locale === "hr" ? icon.labelHr : icon.labelEn}
              >
                <Image src={icon.src} alt="" width={56} height={48} className="h-12 w-auto object-contain" unoptimized />
              </button>
            );
          })}
        </nav>
      </header>

      <ul className="flex-1 divide-y divide-white/10 bg-[#3E3A37] px-4">
        {dishes.length === 0 && (
          <li className="py-10 text-center text-sm text-white/55">
            {t.emptyGroup}
          </li>
        )}
        {dishes.map((dish) => (
          <DishRow key={dish.id} dish={dish} date={date} />
        ))}
      </ul>
    </div>
  );
}

function DishRow({ dish, date }: { dish: Dish; date: string }) {
  const { locale, items, add, setQty } = useStore();
  const key = `${date}:${dish.id}`;
  const qty = items.find((i) => i.key === key)?.qty ?? 0;
  const name = locale === "hr" ? dish.hr : dish.en;
  const note = locale === "hr" ? dish.noteHr : dish.noteEn;

  return (
    <li className="flex items-center gap-3 py-4">
      <div className="min-w-0 flex-1">
        <p className="dish-name text-[20px] text-white">{name}</p>
        {note && <p className="mt-0.5 truncate text-xs text-white/50">{note}</p>}
      </div>
      {qty > 0 ? (
        <div className="flex shrink-0 overflow-hidden rounded-md bg-[#f0c94a] text-black">
          <button
            type="button"
            onClick={() => setQty(key, qty - 1)}
            className="grid min-h-11 min-w-11 place-items-center text-[22px] font-semibold"
            aria-label={locale === "hr" ? "Ukloni jedno" : "Remove one"}
          >
            −
          </button>
          <button
            type="button"
            onClick={() => add(date, dish)}
            className="min-h-11 min-w-[5.25rem] px-3 text-[20px] font-semibold tabular-nums"
            aria-label={`${qty}× ${chipPrice(dish.price)}`}
          >
            {qty}× {chipPrice(dish.price)}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => add(date, dish)}
          className="min-h-11 min-w-[5.25rem] shrink-0 rounded-md bg-[#3dcc4a] px-3.5 text-[20px] font-semibold tabular-nums text-white"
          aria-label={chipPrice(dish.price)}
        >
          {chipPrice(dish.price)}
        </button>
      )}
    </li>
  );
}
