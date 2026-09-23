"use client";

import { useMemo, useState } from "react";
import { categories, formatPrice, todayMenu, week, type Category, type Dish } from "@/lib/data";
import { useStore } from "@/lib/store";

const tagLabel = (tag: string, t: ReturnType<typeof useStore>["t"]) => {
  if (tag === "popular" || tag === "home") return t.popular;
  if (tag === "veg") return t.veg;
  if (tag === "sea") return t.sea;
  if (tag === "grill") return t.grill;
  return tag;
};

export function MenuBoard({ highlightToday = false }: { highlightToday?: boolean }) {
  const { locale, t, add } = useStore();
  const start = todayMenu().date;
  const [date, setDate] = useState(highlightToday ? start : week[0].date);
  const day = week.find((d) => d.date === date) ?? week[0];

  const grouped = useMemo(() => {
    const map = new Map<Category, Dish[]>();
    for (const c of categories) map.set(c.id, []);
    for (const dish of day.dishes) map.get(dish.category)?.push(dish);
    return map;
  }, [day]);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {week.map((d) => {
          const active = d.date === date;
          const label = new Date(`${d.date}T12:00:00`).toLocaleDateString(locale === "hr" ? "hr-HR" : "en-GB", {
            weekday: "short",
            day: "numeric",
            month: "numeric",
          });
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => setDate(d.date)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                active ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-white/70 text-[var(--ink)] ring-1 ring-[var(--line)]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-[var(--ink-soft)]">{t.cutoff}</p>
      <div className="mt-8 space-y-10">
        {categories.map((c) => {
          const dishes = grouped.get(c.id) ?? [];
          if (!dishes.length) return null;
          return (
            <section key={c.id}>
              <h3 className="font-serif text-3xl">{locale === "hr" ? c.hr : c.en}</h3>
              <ul className="mt-4 divide-y divide-[var(--line)]">
                {dishes.map((dish) => (
                  <DishRow key={dish.id} dish={dish} date={date} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function DishRow({ dish, date }: { dish: Dish; date: string }) {
  const { locale, t, add } = useStore();
  const [flash, setFlash] = useState(false);
  const tags = dish.tags?.filter((x) => x !== "home") ?? [];
  const house = dish.tags?.includes("home") || dish.tags?.includes("popular");

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{locale === "hr" ? dish.hr : dish.en}</p>
          {house && (
            <span className="rounded-full bg-[var(--gold-soft)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--gold)]">
              {t.popular}
            </span>
          )}
          {tags
            .filter((tag) => tag !== "popular")
            .map((tag) => (
              <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[11px] text-[var(--ink-soft)] ring-1 ring-[var(--line)]">
                {tagLabel(tag, t)}
              </span>
            ))}
        </div>
        {(dish.noteHr || dish.noteEn) && (
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{locale === "hr" ? dish.noteHr : dish.noteEn}</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className="font-serif text-xl">{formatPrice(dish.price)}</p>
        <button
          type="button"
          onClick={() => {
            add(date, dish);
            setFlash(true);
            setTimeout(() => setFlash(false), 900);
          }}
          className="rounded-full bg-[var(--olive)] px-4 py-2 text-sm font-semibold text-white"
        >
          {flash ? t.added : t.add}
        </button>
      </div>
    </li>
  );
}

export function TodayPreview() {
  const { locale, t, add } = useStore();
  const day = todayMenu();
  const stars = day.dishes.filter((d) => d.tags?.includes("home") || d.tags?.includes("popular")).slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{t.today}</p>
      <h2 className="mt-2 font-serif text-4xl sm:text-5xl">{t.plate}</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stars.map((dish) => (
          <article key={dish.id} className="rounded-3xl bg-white/70 p-5 ring-1 ring-[var(--line)]">
            <p className="font-serif text-2xl">{locale === "hr" ? dish.hr : dish.en}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg">{formatPrice(dish.price)}</span>
              <button
                type="button"
                className="rounded-full bg-[var(--terracotta)] px-4 py-2 text-sm font-semibold text-white"
                onClick={() => add(day.date, dish)}
              >
                {t.add}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
