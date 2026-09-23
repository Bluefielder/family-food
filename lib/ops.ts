import { DOOR_FEE, KEKS_FEE, routes, type RouteStop } from "./data";
import type { KitchenOrder } from "./store";

export function orderFoodTotal(order: KitchenOrder) {
  return order.items.reduce((s, i) => s + i.dish.price * i.qty, 0);
}

export function orderTotal(order: KitchenOrder) {
  return orderFoodTotal(order) + (order.delivery.type === "door" ? DOOR_FEE : 0) + (order.pay === "keks" ? KEKS_FEE : 0);
}

export function orderPlates(order: KitchenOrder) {
  return order.items.filter((i) => i.dish.category === "mains" || i.dish.category === "sandwiches").reduce((s, i) => s + i.qty, 0);
}

export function serveDateOf(order: KitchenOrder) {
  return order.serveDate || order.items[0]?.date || order.createdAt.slice(0, 10);
}

export function routeOf(order: KitchenOrder): RouteStop | undefined {
  return routes.find((r) => r.id === order.delivery.routeId);
}

export function parseWindowStart(window: string) {
  const part = window.split("–")[0]?.trim() ?? "10:00";
  const [h, m] = part.split(":").map((n) => Number(n));
  return { h: h || 10, m: m || 0 };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function addMinutes(h: number, m: number, delta: number) {
  const total = h * 60 + m + delta;
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${pad(Math.floor(wrapped / 60))}:${pad(wrapped % 60)}`;
}

export function isAfternoon(route: RouteStop) {
  return parseWindowStart(route.window).h >= 12;
}

/** When the kitchen should have the box packed. Morning 08:30, afternoon 10:30 — same rule as the public cutoff. */
export function packBy(route: RouteStop) {
  return isAfternoon(route) ? "10:30" : "08:30";
}

/** Van leaves Šmrika — about 45 minutes before the window opens. */
export function vanLeaves(route: RouteStop) {
  const { h, m } = parseWindowStart(route.window);
  return addMinutes(h, m, -45);
}

export function statusMark(status: KitchenOrder["status"]) {
  if (status === "new") return "○";
  if (status === "packed") return "▣";
  if (status === "out") return "△";
  return "✓";
}
