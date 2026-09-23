"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DOOR_FEE, menuForDate, routes, todayISO, type Dish } from "./data";
import { DEMO_SEED_VERSION, buildDemoOrders, isDemoId } from "./demo-orders";
import { copy, type Locale } from "./i18n";

export type CartItem = {
  key: string;
  date: string;
  dish: Dish;
  qty: number;
};

export type Delivery =
  | { type: "stop"; routeId: string; address?: string }
  | { type: "door"; routeId: string; address: string };

export type PayMethod = "cash" | "keks" | "invoice";

export type OrderStatus = "new" | "packed" | "out" | "done";

export type KitchenOrder = {
  id: string;
  createdAt: string;
  serveDate: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  company?: string;
  items: CartItem[];
  delivery: Delivery;
  pay: PayMethod;
  paid: boolean;
  status: OrderStatus;
  source: "web" | "phone";
};

type Store = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (typeof copy)[Locale];
  items: CartItem[];
  add: (date: string, dish: Dish) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  subtotal: number;
  delivery: Delivery | null;
  setDelivery: (d: Delivery | null) => void;
  deliveryFee: number;
  total: number;
  orders: KitchenOrder[];
  placeOrder: (input: Omit<KitchenOrder, "id" | "createdAt" | "status" | "items" | "serveDate"> & { items?: CartItem[]; serveDate?: string }) => KitchenOrder;
  updateOrder: (id: string, patch: Partial<KitchenOrder>) => void;
  resetDemo: () => void;
  simulateIncoming: () => KitchenOrder;
};

const Ctx = createContext<Store | null>(null);

const CART_KEY = "stina-cart";
const LANG_KEY = "stina-lang";
const ORDERS_KEY = "stina-orders";
const SEED_KEY = "stina-seed";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("hr");
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const lang = localStorage.getItem(LANG_KEY) as Locale | null;
      if (lang === "en" || lang === "hr") setLocaleState(lang);
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
      const o = localStorage.getItem(ORDERS_KEY);
      const parsed = o ? (JSON.parse(o) as KitchenOrder[]) : [];
      const live = parsed
        .filter((ord) => !isDemoId(ord.id))
        .map((ord) => ({
          ...ord,
          serveDate: ord.serveDate || ord.items[0]?.date || ord.createdAt.slice(0, 10),
        }));
      const seeded = localStorage.getItem(SEED_KEY);
      if (seeded !== DEMO_SEED_VERSION) {
        localStorage.setItem(SEED_KEY, DEMO_SEED_VERSION);
        setOrders([...buildDemoOrders(), ...live]);
      } else {
        const demo = parsed.some((ord) => isDemoId(ord.id)) ? parsed.filter((ord) => isDemoId(ord.id)) : buildDemoOrders();
        setOrders([...demo, ...live]);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (!ready) return;
    if (orders.length === 0) {
      try {
        const prev = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]") as KitchenOrder[];
        if (prev.length > 0) return;
      } catch {
        /* ignore */
      }
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, ready]);

  useEffect(() => {
    if (!ready) return;
    const pull = () => {
      try {
        const raw = localStorage.getItem(ORDERS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as KitchenOrder[];
        setOrders((prev) => {
          const a = prev.map((o) => `${o.id}:${o.status}`).join("|");
          const b = parsed.map((o) => `${o.id}:${o.status}`).join("|");
          return a === b ? prev : parsed;
        });
      } catch {
        /* ignore */
      }
    };
    const id = window.setInterval(pull, 1500);
    window.addEventListener("storage", pull);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("storage", pull);
    };
  }, [ready]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LANG_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const add = useCallback((date: string, dish: Dish) => {
    const key = `${date}:${dish.id}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { key, date, dish, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDelivery(null);
  }, []);

  const subtotal = items.reduce((s, i) => s + i.dish.price * i.qty, 0);
  const deliveryFee = delivery?.type === "door" ? DOOR_FEE : 0;
  const total = subtotal + deliveryFee;

  const placeOrder: Store["placeOrder"] = useCallback(
    (input) => {
      const lineItems = input.items ?? items;
      const order: KitchenOrder = {
        id: `ST-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        serveDate: input.serveDate || lineItems[0]?.date || new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Zagreb" }),
        status: "new",
        items: lineItems,
        name: input.name,
        phone: input.phone,
        email: input.email,
        note: input.note,
        company: input.company,
        delivery: input.delivery,
        pay: input.pay,
        paid: input.paid,
        source: input.source,
      };
      setOrders((prev) => [order, ...prev]);
      if (input.source === "web" && !input.items) clearCart();
      return order;
    },
    [items, clearCart],
  );

  const updateOrder = useCallback((id: string, patch: Partial<KitchenOrder>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);

  const resetDemo = useCallback(() => {
    const live = orders.filter((o) => !isDemoId(o.id));
    localStorage.setItem(SEED_KEY, DEMO_SEED_VERSION);
    setOrders([...buildDemoOrders(), ...live]);
  }, [orders]);

  const simulateIncoming = useCallback(() => {
    const day = todayISO();
    const menu = menuForDate(day);
    const dish = menu.dishes.find((d) => d.category === "mains") ?? menu.dishes[0];
    const route = routes[Math.floor(Math.random() * routes.length)] ?? routes[0];
    return placeOrder({
      name: "Ana Kovač",
      phone: "091 555 2291",
      email: "ana.kovac@demo.hr",
      note: "",
      serveDate: day,
      delivery: { type: "stop", routeId: route.id, address: "Korzo — točka" },
      pay: "cash",
      paid: false,
      source: "web",
      items: dish ? [{ key: `${day}:${dish.id}:${Date.now()}`, date: day, dish, qty: 1 }] : [],
    });
  }, [placeOrder]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: copy[locale],
      items,
      add,
      setQty,
      clearCart,
      cartOpen,
      setCartOpen,
      subtotal,
      delivery,
      setDelivery,
      deliveryFee,
      total,
      orders,
      placeOrder,
      updateOrder,
      resetDemo,
      simulateIncoming,
    }),
    [
      locale,
      setLocale,
      items,
      add,
      setQty,
      clearCart,
      cartOpen,
      subtotal,
      delivery,
      deliveryFee,
      total,
      orders,
      placeOrder,
      updateOrder,
      resetDemo,
      simulateIncoming,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Store missing");
  return ctx;
}

export function routeLabel(id: string, locale: Locale) {
  const r = routes.find((x) => x.id === id);
  if (!r) return id;
  return locale === "hr" ? r.hr : r.en;
}
