"use client";

import { routes, type RouteStop } from "@/lib/data";
import { useStore } from "@/lib/store";

type Props = {
  selectedId?: string;
  onPick: (id: string) => void;
  onClose: () => void;
};

export function RouteMapSheet({ selectedId, onPick, onClose }: Props) {
  const { t, locale } = useStore();

  function choose(id: string) {
    onPick(id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 p-3 sm:items-center" role="dialog" aria-modal aria-labelledby="route-map-title">
      <div className="max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-2xl bg-[#2b2826] p-4 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="route-map-title" className="font-serif text-2xl">
              {t.mapTitle}
            </h2>
            <p className="mt-1 text-sm text-white/60">{t.mapLead}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-lg" aria-label={t.hideMap}>
            ✕
          </button>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-xl bg-[#1a1816]">
          <iframe
            title={t.mapTitle}
            className="pointer-events-none h-44 w-full opacity-70 grayscale"
            src="https://www.openstreetmap.org/export/embed.html?bbox=14.36%2C45.275%2C14.56%2C45.36&layer=mapnik"
          />
          <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" role="img" aria-label={t.mapTitle}>
            {routes.map((r) => {
              const on = r.id === selectedId;
              return (
                <g key={r.id}>
                  <circle cx={r.mapX} cy={r.mapY} r={on ? 13 : 11} fill={on ? "#f0c94a" : "#d85a38"} stroke="#fff" strokeWidth={on ? 2.5 : 1.5} />
                  <text x={r.mapX} y={r.mapY + 4} textAnchor="middle" fontSize="8" fontWeight="700" fill={on ? "#1a1816" : "#fff"}>
                    {r.code}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0 grid grid-cols-1">
            {routes.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-label={`${locale === "hr" ? r.hr : r.en} ${r.window}`}
                className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${(r.mapX / 320) * 100}%`, top: `${(r.mapY / 200) * 100}%` }}
                onClick={() => choose(r.id)}
              />
            ))}
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {routes.map((r) => (
            <RouteRow key={r.id} route={r} selected={r.id === selectedId} onPick={() => choose(r.id)} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function RouteRow({ route, selected, onPick }: { route: RouteStop; selected: boolean; onPick: () => void }) {
  const { locale } = useStore();
  return (
    <li>
      <button
        type="button"
        onClick={onPick}
        aria-pressed={selected}
        className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${
          selected ? "bg-[#f0c94a] text-[#1a1816]" : "bg-black/40 text-white"
        }`}
      >
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${selected ? "bg-[#1a1816] text-[#f0c94a]" : "bg-[#d85a38] text-white"}`}>
          {route.code}
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-sm">{locale === "hr" ? route.hr : route.en}</strong>
          {(route.infoHr || route.infoEn) && (
            <span className={`block truncate text-xs ${selected ? "text-[#1a1816]/70" : "text-white/55"}`}>
              {locale === "hr" ? route.infoHr : route.infoEn}
            </span>
          )}
        </span>
        <span className="shrink-0 font-serif text-sm">{route.window}</span>
      </button>
    </li>
  );
}
