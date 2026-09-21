"use client";

import { useMemo, useState } from "react";
import { categories, formatPrice, todayISO, todayMenu, week, type Category, type Dish } from "@/lib/data";
import { useStore } from "@/lib/store";

const enWeekday: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tues",
  3: "Wed",
  4: "Thur",
  5: "Fri",
  6: "Sat",
};

function dayChipParts(date: string, locale: "hr" | "en") {
  const d = new Date(`${date}T12:00:00`);
  const dayNum = d.getDate();
  if (locale === "hr") {
    const wd = new Intl.DateTimeFormat("hr-HR", { weekday: "short", timeZone: "Europe/Zagreb" }).format(d);
    return { weekday: wd.charAt(0).toUpperCase() + wd.slice(1), dayNum };
  }
  return { weekday: enWeekday[d.getDay()], dayNum };
}

function cartQty(items: ReturnType<typeof useStore>["items"], date: string, dishId: string) {
  return items.find((i) => i.key === `${date}:${dishId}`)?.qty ?? 0;
}

function HouseHeart({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0" aria-label={label} title={label}>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[var(--gold)]" fill="currentColor" aria-hidden>
        <path d="M8 13.5S1.5 9.2 1.5 5.4a2.6 2.6 0 0 1 4.6-1.6L8 5.3l1.9-1.5a2.6 2.6 0 0 1 4.6 1.6C15.5 9.2 8 13.5 8 13.5z" />
      </svg>
    </span>
  );
}

function AddButton({ date, dish, disabled }: { date: string; dish: Dish; disabled?: boolean }) {
  const { t, add, items } = useStore();
  const qty = cartQty(items, date, dish.id);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => add(date, dish)}
      className={`relative inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white sm:min-h-11 sm:px-4 sm:text-sm ${
        disabled ? "cursor-not-allowed bg-white/15 text-white/40" : "bg-[var(--olive)]"
      }`}
    >
      {qty > 0 ? t.addMore : t.add}
      {qty > 0 && (
        <span
          className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--gold)] px-1 text-[11px] font-bold text-[var(--ink)]"
          aria-label={`${qty}`}
        >
          {qty}
        </span>
      )}
    </button>
  );
}

export function MenuBoard({ highlightToday = false }: { highlightToday?: boolean }) {
  const { locale, t } = useStore();
  const today = todayISO();
  const start = todayMenu().date;
  const [date, setDate] = useState(highlightToday ? start : week[0].date);
  const day = week.find((d) => d.date === date) ?? week[0];
  const isPastDay = date < today;

  const grouped = useMemo(() => {
    const map = new Map<Category, Dish[]>();
    for (const c of categories) map.set(c.id, []);
    for (const dish of day.dishes) map.get(dish.category)?.push(dish);
    return map;
  }, [day]);

  return (
    <div>
      <div className="-mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {week.map((d) => {
          const selected = d.date === date;
          const isToday = d.date === today;
          const isPast = d.date < today;
          const { weekday, dayNum } = dayChipParts(d.date, locale);

          let chipClass =
            "flex min-h-[3.25rem] min-w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-2xl px-2 py-1.5 transition-colors";
          if (selected) {
            chipClass += " bg-white text-black";
          } else if (isToday) {
            chipClass += " bg-white text-black ring-2 ring-[var(--gold)]";
          } else if (isPast) {
            chipClass += " bg-black/25 text-white/35 ring-1 ring-white/10";
          } else {
            chipClass += " bg-black/40 text-white ring-1 ring-white/25 backdrop-blur-sm";
          }

          return (
            <button key={d.date} type="button" onClick={() => setDate(d.date)} className={chipClass}>
              <span className="text-[10px] font-medium leading-none tracking-tight">{weekday}</span>
              <span className="mt-0.5 text-base font-semibold leading-none tabular-nums">{dayNum}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-white/60">{t.cutoff}</p>
      <div className="mt-4 space-y-6 sm:space-y-8">
        {categories.map((c) => {
          const dishes = grouped.get(c.id) ?? [];
          if (!dishes.length) return null;
          return (
            <section key={c.id}>
              <h3 className="font-serif text-2xl sm:text-3xl">{locale === "hr" ? c.hr : c.en}</h3>
              <ul className="mt-2 divide-y divide-white/12">
                {dishes.map((dish) => (
                  <DishRow key={dish.id} dish={dish} date={date} canAdd={!isPastDay} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function DishRow({ dish, date, canAdd }: { dish: Dish; date: string; canAdd: boolean }) {
  const { locale, t } = useStore();
  const house = dish.tags?.includes("home") || dish.tags?.includes("popular");
  const mutedTags = dish.tags?.filter((x) => x !== "home" && x !== "popular") ?? [];

  const tagLabel = (tag: string) => {
    if (tag === "veg") return t.veg;
    if (tag === "sea") return t.sea;
    if (tag === "grill") return t.grill;
    return tag;
  };

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-0.5 py-2.5 sm:gap-x-3">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="dish-name truncate text-[1.05rem] font-semibold leading-tight sm:text-lg">{locale === "hr" ? dish.hr : dish.en}</p>
          {house && <HouseHeart label={t.popular} />}
        </div>
        {(dish.noteHr || dish.noteEn) && (
          <p className="mt-0.5 truncate text-xs text-white/55">{locale === "hr" ? dish.noteHr : dish.noteEn}</p>
        )}
        {mutedTags.length > 0 && (
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/40">
            {mutedTags.map((tag) => tagLabel(tag)).join(" · ")}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-2.5">
        <p className="font-serif text-base tabular-nums sm:text-lg">{formatPrice(dish.price)}</p>
        <AddButton date={date} dish={dish} disabled={!canAdd} />
      </div>
    </li>
  );
}

export function TodayPreview() {
  const { locale, t } = useStore();
  const day = todayMenu();
  const stars = day.dishes.filter((d) => d.tags?.includes("home") || d.tags?.includes("popular")).slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.today}</p>
      <h2 className="mt-2 font-serif text-3xl text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-5xl">{t.plate}</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stars.map((dish) => (
          <article key={dish.id} className="panel rounded-3xl p-5">
            <p className="dish-name truncate font-serif text-2xl">{locale === "hr" ? dish.hr : dish.en}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg">{formatPrice(dish.price)}</span>
              <AddButton date={day.date} dish={dish} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
