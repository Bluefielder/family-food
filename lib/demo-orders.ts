import { menuForDate, routes, type Dish } from "./data";
import type { KitchenOrder, OrderStatus, PayMethod } from "./store";

export const DEMO_SEED_VERSION = "office-v1";
export const DEMO_DAYS = ["2026-09-22", "2026-09-23", "2026-09-24", "2026-09-25"] as const;

const PEOPLE = [
  { name: "Luka Modrić", phone: "091 310 2218", email: "luka.modric@email.hr" },
  { name: "Ana Kovač", phone: "091 502 1183", email: "ana.kovac@email.hr" },
  { name: "Marko Horvat", phone: "095 611 4402", email: "marko.horvat@email.hr" },
  { name: "Petra Babić", phone: "098 220 7741", email: "petra.babic@email.hr" },
  { name: "Ivan Jurić", phone: "099 334 8901", email: "ivan.juric@email.hr" },
  { name: "Maja Perić", phone: "091 778 2210", email: "maja.peric@email.hr" },
  { name: "Tomislav Rukavina", phone: "095 441 6678", email: "tomo.rukavina@email.hr" },
  { name: "Ivana Šimić", phone: "098 112 3345", email: "ivana.simic@email.hr" },
  { name: "Goran Barišić", phone: "099 887 6501", email: "goran.barisic@email.hr" },
  { name: "Sanja Tomljanović", phone: "091 256 7780", email: "sanja.t@email.hr" },
  { name: "Nikola Vuković", phone: "095 903 2214", email: "nikola.v@email.hr" },
  { name: "Elena Marić", phone: "098 445 1109", email: "elena.maric@email.hr" },
  { name: "Davor Knežević", phone: "099 210 6672", email: "davor.k@email.hr" },
  { name: "Tea Blažević", phone: "091 634 8890", email: "tea.blazevic@email.hr" },
  { name: "Robert Ferenčić", phone: "095 178 4403", email: "robert.f@email.hr" },
  { name: "Martina Grgić", phone: "098 556 2291", email: "martina.grgic@email.hr" },
  { name: "Filip Kralj", phone: "099 701 3348", email: "filip.kralj@email.hr" },
  { name: "Lucija Novak", phone: "091 419 8802", email: "lucija.novak@email.hr" },
  { name: "Josip Pavlović", phone: "095 322 1107", email: "josip.pavlovic@email.hr" },
  { name: "Andrea Žužić", phone: "098 667 4410", email: "andrea.zuzic@email.hr" },
  { name: "Stjepan Crnković", phone: "099 154 7783", email: "stjepan.c@email.hr" },
  { name: "Iva Radić", phone: "091 880 2265", email: "iva.radic@email.hr" },
  { name: "Darko Matić", phone: "095 247 9901", email: "darko.matic@email.hr" },
  { name: "Kristina Božić", phone: "098 313 5508", email: "kristina.b@email.hr" },
  { name: "Jadran Promet d.o.o.", phone: "051 333 210", email: "narudzbe@jadranpromet.hr", company: "Jadran Promet d.o.o. · OIB 81234567890" },
  { name: "Građevina Zapad", phone: "099 512 8800", email: "poslovođa@gradevina-zapad.hr", company: "Građevina Zapad j.d.o.o." },
  { name: "Škola Pećine — zbornica", phone: "051 452 110", email: "tajnistvo@os-pecine.hr", company: "OŠ Pećine" },
  { name: "INA servis Urinj", phone: "099 700 2211", email: "kantina.urinj@ina.hr", company: "INA d.d." },
];

const SITES = [
  "Korzo 12, Rijeka",
  "Riva 8, Rijeka",
  "Gradilište Zamet, ulaz B",
  "Turnić 14",
  "Kantrida — garaža 2",
  "Škurinje, kod crkve",
  "Martinkovac 9",
  "Pećine, škola",
  "Sušak, Strossmayerova 4",
  "Vežica, parking Konzum",
  "Kukuljanovo, hala 3",
  "Kostrena, Sv. Lucija 2",
  "Urinj, porta INA",
  "Krnjevo, skele",
  "Srdoči 21",
];

const NOTES = [
  "",
  "Bez luka.",
  "Ostavi kod portira.",
  "Alergija na orahe — bez štrudle.",
  "Pozvati 5 min prije.",
  "Gradilište, 2. kat, žuta kaciga.",
  "Ured, treći kat, kuhinja.",
  "Dvoje vilica, jedna juha.",
];

const ROUTE_LOAD = ["centar-1", "centar-1", "centar-1", "centar-2", "centar-2", "centar-2", "zapad-1", "zapad-1", "zapad-1", "zapad-2", "zapad-2", "istok-1", "istok-1", "istok-1", "istok-2", "istok-2", "kukuljanovo-1", "kukuljanovo-1", "kukuljanovo-2", "kukuljanovo-2", "kostrena", "kostrena", "ina", "ina"] as const;

function pick<T>(list: T[], n: number) {
  return list[n % list.length];
}

function statusFor(day: string, i: number): OrderStatus {
  if (day === "2026-09-22") return "done";
  if (day === "2026-09-23") {
    const lane = i % 4;
    if (lane === 0) return "new";
    if (lane === 1) return "packed";
    if (lane === 2) return "out";
    return "done";
  }
  return "new";
}

function payFor(i: number): PayMethod {
  const lane = i % 10;
  if (lane < 5) return "cash";
  if (lane < 8) return "keks";
  return "invoice";
}

function dishesFor(date: string, i: number): { dish: Dish; qty: number }[] {
  const menu = menuForDate(date);
  const mains = menu.dishes.filter((d) => d.category === "mains");
  const extras = menu.dishes.filter((d) => d.category !== "mains");
  const main = pick(mains, i + date.length);
  const out: { dish: Dish; qty: number }[] = [{ dish: main, qty: 1 + (i % 5 === 0 ? 1 : 0) }];
  if (i % 3 === 0 && extras.length) out.push({ dish: pick(extras, i + 3), qty: 1 });
  if (i % 7 === 0 && extras.length > 1) out.push({ dish: pick(extras, i + 8), qty: 1 });
  return out;
}

export function buildDemoOrders(): KitchenOrder[] {
  const orders: KitchenOrder[] = [];
  DEMO_DAYS.forEach((day, di) => {
    ROUTE_LOAD.forEach((routeId, i) => {
      const person = pick(PEOPLE, di * 11 + i);
      const pay = person.company ? (i % 2 === 0 ? "invoice" : payFor(i)) : payFor(i);
      const door = i % 4 === 2;
      const site = pick(SITES, i + di * 5);
      const items = dishesFor(day, i + di).map(({ dish, qty }) => ({
        key: `DM:${day}:${routeId}:${i}:${dish.id}`,
        date: day,
        dish,
        qty,
      }));
      const status = statusFor(day, i);
      const paid = pay === "keks" || (pay === "cash" && status === "done") || (pay === "invoice" && day === "2026-09-22");
      orders.push({
        id: `DM-${day.slice(5).replace("-", "")}-${String(i + 1).padStart(2, "0")}`,
        createdAt: `${day}T07:${String(10 + (i % 40)).padStart(2, "0")}:00.000+02:00`,
        serveDate: day,
        name: person.name,
        phone: person.phone,
        email: person.email,
        note: pick(NOTES, i + di),
        company: person.company,
        items,
        delivery: door ? { type: "door", routeId, address: site } : { type: "stop", routeId, address: site },
        pay,
        paid,
        status,
        source: i % 3 === 0 ? "phone" : "web",
      });
    });
  });
  return orders;
}

export function isDemoId(id: string) {
  return id.startsWith("DM-");
}
