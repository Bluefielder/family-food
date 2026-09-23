export type Category = "mains" | "sandwiches" | "salads" | "desserts" | "sides";

export type Dish = {
  id: string;
  hr: string;
  en: string;
  noteHr?: string;
  noteEn?: string;
  price: number;
  category: Category;
  tags?: ("home" | "grill" | "veg" | "sea" | "popular")[];
};

export type DayMenu = {
  date: string;
  dishes: Dish[];
};

export type RouteStop = {
  id: string;
  hr: string;
  en: string;
  infoHr?: string;
  infoEn?: string;
  window: string;
  area: "centar" | "zapad" | "istok" | "okolica";
};

export const DOOR_FEE = 1.5;

export const routes: RouteStop[] = [
  {
    id: "centar-1",
    hr: "Rijeka – centar 1",
    en: "Rijeka – centre 1",
    window: "10:00 – 11:00",
    area: "centar",
  },
  {
    id: "centar-2",
    hr: "Rijeka – centar 2",
    en: "Rijeka – centre 2",
    window: "12:30 – 13:30",
    area: "centar",
  },
  {
    id: "zapad-1",
    hr: "Rijeka – zapad 1",
    en: "Rijeka – west 1",
    infoHr: "Turnić, Krnjevo, Zamet, Kantrida",
    infoEn: "Turnić, Krnjevo, Zamet, Kantrida",
    window: "10:45 – 11:45",
    area: "zapad",
  },
  {
    id: "zapad-2",
    hr: "Rijeka – zapad 2",
    en: "Rijeka – west 2",
    infoHr: "Škurinje, Martinkovac, Srdoči",
    infoEn: "Škurinje, Martinkovac, Srdoči",
    window: "11:00 – 12:00",
    area: "zapad",
  },
  {
    id: "istok-1",
    hr: "Rijeka – istok 1",
    en: "Rijeka – east 1",
    infoHr: "Pećine, Vežica, Sušak",
    infoEn: "Pećine, Vežica, Sušak",
    window: "10:30 – 11:30",
    area: "istok",
  },
  {
    id: "istok-2",
    hr: "Rijeka – istok 2",
    en: "Rijeka – east 2",
    infoHr: "Pećine, Vežica, Sušak",
    infoEn: "Pećine, Vežica, Sušak",
    window: "13:00 – 14:00",
    area: "istok",
  },
  {
    id: "kukuljanovo-1",
    hr: "Kukuljanovo 1",
    en: "Kukuljanovo 1",
    window: "09:30 – 10:30",
    area: "okolica",
  },
  {
    id: "kukuljanovo-2",
    hr: "Kukuljanovo 2",
    en: "Kukuljanovo 2",
    window: "11:30 – 12:30",
    area: "okolica",
  },
  {
    id: "kostrena",
    hr: "Kostrena",
    en: "Kostrena",
    window: "11:15 – 11:45",
    area: "okolica",
  },
  {
    id: "ina",
    hr: "INA",
    en: "INA",
    window: "12:00 – 12:30",
    area: "okolica",
  },
];

const sandwich: Dish[] = [
  {
    id: "aurora",
    hr: "Aurora sendvič",
    en: "Aurora sandwich",
    noteHr: "piletina pohana",
    noteEn: "breaded chicken",
    price: 5,
    category: "sandwiches",
  },
  {
    id: "hamburger",
    hr: "Hamburger",
    en: "Hamburger",
    price: 5,
    category: "sandwiches",
  },
];

const salads = (extra?: Dish[]): Dish[] => [
  { id: "sal-fazol", hr: "Fažol", en: "Bean salad", price: 2, category: "salads", tags: ["veg"] },
  { id: "sal-krastavci", hr: "Krastavci", en: "Cucumber salad", price: 2, category: "salads", tags: ["veg"] },
  { id: "sal-kupus", hr: "Kupus svježi", en: "Fresh cabbage", price: 2, category: "salads", tags: ["veg"] },
  {
    id: "sal-mix",
    hr: "Miješana sezonska",
    en: "Mixed seasonal salad",
    price: 2,
    category: "salads",
    tags: ["veg"],
  },
  { id: "sal-pomidor", hr: "Pomidor", en: "Tomato salad", price: 2, category: "salads", tags: ["veg"] },
  ...(extra ?? []),
];

const desserts: Dish[] = [
  {
    id: "strudla-jabuka",
    hr: "Štrudla od jabuka",
    en: "Apple strudel",
    price: 2,
    category: "desserts",
    tags: ["home", "popular"],
  },
  {
    id: "strudla-sir",
    hr: "Štrudla od sira",
    en: "Cheese strudel",
    price: 2,
    category: "desserts",
    tags: ["home"],
  },
];

export const week: DayMenu[] = [
  {
    date: "2026-09-21",
    dishes: [
      { id: "m-fazol-panceta", hr: "Fažol s hamburger pancetom", en: "Bean stew with bacon", price: 7, category: "mains", tags: ["home", "popular"] },
      { id: "m-fazol-hrenovka", hr: "Fažol s hrenovkom", en: "Bean stew with frankfurter", price: 7, category: "mains", tags: ["home"] },
      { id: "m-fazol-kobasica", hr: "Fažol s kobasicom", en: "Bean stew with sausage", price: 7, category: "mains", tags: ["home"] },
      { id: "m-bolonjez", hr: "Pašta bologneze", en: "Pasta Bolognese", price: 7, category: "mains" },
      { id: "m-pasta-tuna", hr: "Pašta hladna s tunom i mozzarellom", en: "Cold pasta with tuna and mozzarella", price: 7, category: "mains" },
      { id: "m-pecena-piletina", hr: "Pečena piletina (batak-zabatak) + prilog", en: "Roast chicken (thigh) + side", price: 7, category: "mains", tags: ["home", "popular"] },
      { id: "m-prsa-zar", hr: "Pileća prsa žar + prilog", en: "Grilled chicken breast + side", price: 8, category: "mains", tags: ["grill"] },
      { id: "m-kineski", hr: "Piletina na kineski s rižom ili paštom", en: "Chinese-style chicken with rice or pasta", price: 8, category: "mains" },
      { id: "m-pohana-prsa", hr: "Pohana pileća prsa + prilog", en: "Breaded chicken breast + side", price: 8, category: "mains", tags: ["popular"] },
      { id: "m-pohana-svinja", hr: "Pohana svinjetina + prilog", en: "Breaded pork + side", price: 8, category: "mains" },
      ...sandwich,
      ...salads([
        { id: "sal-feta", hr: "Obročna salata s feta sirom", en: "Meal salad with feta", price: 7, category: "salads", tags: ["veg"] },
        { id: "sal-piletina", hr: "Obročna salata s piletinom", en: "Meal salad with chicken", price: 7, category: "salads" },
        { id: "sal-oba", hr: "Obročna salata s piletinom i feta sirom", en: "Meal salad with chicken and feta", price: 7, category: "salads" },
      ]),
      ...desserts,
      { id: "s-leso", hr: "Lešo krumpir", en: "Boiled potatoes", price: 3, category: "sides", tags: ["veg"] },
      { id: "s-pomfri", hr: "Pomfri", en: "French fries", price: 3, category: "sides" },
      { id: "s-povrce", hr: "Povrće mix", en: "Mixed vegetables", noteHr: "kelj, kupus, mrkva, krumpir", noteEn: "kale, cabbage, carrot, potato", price: 5, category: "sides", tags: ["veg"] },
      { id: "s-restani", hr: "Restani krumpir", en: "Pan-fried potatoes", price: 3, category: "sides" },
      { id: "s-rizi", hr: "Rizi bizi", en: "Risi e bisi (rice and peas)", price: 3, category: "sides", tags: ["home"] },
    ],
  },
  {
    date: "2026-09-22",
    dishes: [
      { id: "t-pasta-fazol-hren", hr: "Pašta fažol s hrenovkom", en: "Pasta e fagioli with frankfurter", price: 7, category: "mains", tags: ["home"] },
      { id: "t-pasta-fazol-kob", hr: "Pašta fažol s kobasicom", en: "Pasta e fagioli with sausage", price: 7, category: "mains", tags: ["home"] },
      { id: "t-fussili", hr: "Pašta hladna: fussili s francuskom salatom i piletinom", en: "Cold fusilli with potato salad and chicken", price: 7, category: "mains" },
      { id: "t-pljeskavice", hr: "Pljeskavice žar + prilog", en: "Grilled patties + side", price: 8, category: "mains", tags: ["grill", "popular"] },
      { id: "t-pohana-prsa", hr: "Pohana pileća prsa + prilog", en: "Breaded chicken breast + side", price: 8, category: "mains" },
      { id: "t-pohana-svinja", hr: "Pohana svinjetina + prilog", en: "Breaded pork + side", price: 8, category: "mains" },
      { id: "t-polpete", hr: "Polpete + prilog", en: "Meatballs + side", price: 7, category: "mains", tags: ["home"] },
      { id: "t-rizoto", hr: "Rižoto juneći", en: "Beef risotto", price: 8, category: "mains", tags: ["home"] },
      { id: "t-rezanci", hr: "Zeleni rezanci u umaku od pršuta i šumskih gljiva", en: "Green noodles with prosciutto and wild mushroom sauce", price: 8, category: "mains" },
      ...sandwich,
      { id: "t-prsut", hr: "Sendvič pršut", en: "Prosciutto sandwich", noteHr: "lepinja, pršut, sir, namaz, salata, rajčica, kiseli krastavci", noteEn: "bun, prosciutto, cheese, spread, salad, tomato, pickles", price: 6, category: "sandwiches" },
      ...salads([
        { id: "t-sal-feta", hr: "Obročna salata s feta sirom", en: "Meal salad with feta", price: 7, category: "salads", tags: ["veg"] },
        { id: "t-sal-piletina", hr: "Obročna salata s piletinom", en: "Meal salad with chicken", price: 7, category: "salads" },
        { id: "t-sal-oba", hr: "Obročna salata s piletinom i feta sirom", en: "Meal salad with chicken and feta", price: 7, category: "salads" },
      ]),
      ...desserts,
      { id: "t-leso", hr: "Lešo krumpir", en: "Boiled potatoes", price: 3, category: "sides" },
      { id: "t-mahune", hr: "Mahune s krumpirom", en: "Green beans with potatoes", price: 5, category: "sides", tags: ["home", "veg"] },
      { id: "t-carbonara", hr: "Pašta carbonara", en: "Pasta carbonara", price: 5, category: "sides" },
      { id: "t-pomfri", hr: "Pomfri", en: "French fries", price: 3, category: "sides" },
      { id: "t-restani", hr: "Restani krumpir", en: "Pan-fried potatoes", price: 3, category: "sides" },
      { id: "t-riza", hr: "Riža", en: "Rice", price: 3, category: "sides" },
    ],
  },
  {
    date: "2026-09-23",
    dishes: [
      { id: "w-cevapi", hr: "Ćevapi žar + prilog", en: "Grilled ćevapi + side", price: 8, category: "mains", tags: ["grill", "popular"] },
      { id: "w-cordon", hr: "Cordon bleu + prilog", en: "Cordon bleu + side", price: 8, category: "mains" },
      { id: "w-manestra", hr: "Maneštra (fažol) s narezanim kranjskim kobasicama", en: "Maneštra bean stew with sliced sausage", price: 7, category: "mains", tags: ["home"] },
      { id: "w-meksicka", hr: "Meksička salata s paštom i piletinom", en: "Mexican pasta salad with chicken", price: 7, category: "mains" },
      { id: "w-salsa", hr: "Pileći odresci u umaku od salse i povrća + prilog", en: "Chicken steaks in salsa and vegetables + side", price: 8, category: "mains" },
      { id: "w-pohana-prsa", hr: "Pohana pileća prsa + prilog", en: "Breaded chicken breast + side", price: 8, category: "mains" },
      { id: "w-pohana-svinja", hr: "Pohana svinjetina + prilog", en: "Breaded pork + side", price: 8, category: "mains" },
      { id: "w-sampinjoni", hr: "Pohani šampinjoni + prilog", en: "Breaded mushrooms + side", price: 8, category: "mains", tags: ["veg"] },
      ...sandwich,
      ...salads([
        { id: "w-stina", hr: "Obročna salata Stina", en: "Stina meal salad", noteHr: "jaja, sezonska salata, rajčica, piletina ili feta sir", noteEn: "eggs, seasonal salad, tomato, chicken or feta", price: 8, category: "salads", tags: ["popular"] },
      ]),
      ...desserts,
      { id: "w-varivo", hr: "Fino varivo", en: "Fine vegetable stew", price: 5, category: "sides", tags: ["home", "veg"] },
      { id: "w-pasta-salsa", hr: "Pašta salsa s povrćem", en: "Pasta with vegetable salsa", price: 5, category: "sides" },
      { id: "w-pire", hr: "Pire krumpir", en: "Mashed potatoes", price: 3, category: "sides", tags: ["home"] },
      { id: "w-pomfri", hr: "Pomfri", en: "French fries", price: 3, category: "sides" },
      { id: "w-restani", hr: "Restani krumpir", en: "Pan-fried potatoes", price: 3, category: "sides" },
      { id: "w-riza", hr: "Riža", en: "Rice", price: 3, category: "sides" },
    ],
  },
  {
    date: "2026-09-24",
    dishes: [
      { id: "th-istarska-panceta", hr: "Istarska maneštra s hamburger pancetom", en: "Istrian maneštra with bacon", price: 7, category: "mains", tags: ["home", "popular"] },
      { id: "th-istarska-hren", hr: "Istarska maneštra s hrenovkom", en: "Istrian maneštra with frankfurter", price: 7, category: "mains", tags: ["home"] },
      { id: "th-istarska-kob", hr: "Istarska maneštra s kobasicom", en: "Istrian maneštra with sausage", price: 7, category: "mains", tags: ["home"] },
      { id: "th-medaljoni", hr: "Medaljoni pileći u šampinjon umaku + prilog", en: "Chicken medallions in mushroom sauce + side", price: 8, category: "mains" },
      { id: "th-pasta-hladna", hr: "Pašta hladna s piletinom", en: "Cold pasta with chicken", price: 7, category: "mains" },
      { id: "th-pecenje", hr: "Pečenje svinjsko + prilog", en: "Roast pork + side", price: 8, category: "mains", tags: ["home", "popular"] },
      { id: "th-strips", hr: "Pileći stripsi pohani + prilog", en: "Breaded chicken strips + side", price: 8, category: "mains" },
      { id: "th-pohana-prsa", hr: "Pohana pileća prsa + prilog", en: "Breaded chicken breast + side", price: 8, category: "mains" },
      { id: "th-pohana-svinja", hr: "Pohana svinjetina + prilog", en: "Breaded pork + side", price: 8, category: "mains" },
      { id: "th-stefani", hr: "Štefani (mesna rolada) + prilog", en: "Štefani meat roll + side", price: 8, category: "mains", tags: ["home"] },
      ...sandwich,
      { id: "th-prsut", hr: "Sendvič pršut", en: "Prosciutto sandwich", noteHr: "lepinja, pršut, sir, namaz, salata, rajčica, kiseli krastavci", noteEn: "bun, prosciutto, cheese, spread, salad, tomato, pickles", price: 6, category: "sandwiches" },
      ...salads([
        { id: "th-sal-feta", hr: "Obročna salata s feta sirom", en: "Meal salad with feta", price: 7, category: "salads", tags: ["veg"] },
        { id: "th-sal-piletina", hr: "Obročna salata s piletinom", en: "Meal salad with chicken", price: 7, category: "salads" },
        { id: "th-sal-oba", hr: "Obročna salata s piletinom i feta sirom", en: "Meal salad with chicken and feta", price: 7, category: "salads" },
      ]),
      ...desserts,
      { id: "th-cvjetaca", hr: "Cvjetača (karfiol)", en: "Cauliflower", price: 5, category: "sides", tags: ["veg"] },
      { id: "th-juvec", hr: "Đuveč", en: "Đuveč vegetable rice", price: 5, category: "sides", tags: ["home"] },
      { id: "th-pire", hr: "Pire krumpir", en: "Mashed potatoes", price: 3, category: "sides" },
      { id: "th-pomfri", hr: "Pomfri", en: "French fries", price: 3, category: "sides" },
      { id: "th-restani", hr: "Restani krumpir", en: "Pan-fried potatoes", price: 3, category: "sides" },
      { id: "th-riza", hr: "Riža", en: "Rice", price: 3, category: "sides" },
    ],
  },
  {
    date: "2026-09-25",
    dishes: [
      { id: "f-gulas", hr: "Gulaš juneći s njokima", en: "Beef goulash with gnocchi", price: 8, category: "mains", tags: ["home", "popular"] },
      { id: "f-lignje", hr: "Lignje na mornarski s palentom", en: "Sailor-style squid with polenta", price: 8, category: "mains", tags: ["sea", "home"] },
      { id: "f-oslic", hr: "Oslić file pohani + prilog", en: "Breaded hake fillet + side", price: 8, category: "mains", tags: ["sea"] },
      { id: "f-pasta-tuna", hr: "Pašta hladna s tunom", en: "Cold pasta with tuna", price: 7, category: "mains" },
      { id: "f-prsa-zar", hr: "Pileća prsa žar + prilog", en: "Grilled chicken breast + side", price: 8, category: "mains", tags: ["grill"] },
      { id: "f-pohana-prsa", hr: "Pohana pileća prsa + prilog", en: "Breaded chicken breast + side", price: 8, category: "mains" },
      { id: "f-rizoto-lignje", hr: "Rižoto od lignji", en: "Squid risotto", price: 8, category: "mains", tags: ["sea"] },
      { id: "f-srdele", hr: "Srdelice frigane + prilog", en: "Fried sardines + side", price: 7, category: "mains", tags: ["sea", "home", "popular"] },
      ...sandwich,
      { id: "f-tuna-sendvic", hr: "Sendvič s tunom", en: "Tuna sandwich", price: 5, category: "sandwiches" },
      ...salads([
        { id: "f-sal-feta", hr: "Obročna salata s feta sirom", en: "Meal salad with feta", price: 7, category: "salads", tags: ["veg"] },
        { id: "f-sal-piletina", hr: "Obročna salata s piletinom", en: "Meal salad with chicken", price: 7, category: "salads" },
        { id: "f-sal-oba", hr: "Obročna salata s piletinom i feta sirom", en: "Meal salad with chicken and feta", price: 7, category: "salads" },
      ]),
      ...desserts,
      { id: "f-blitva", hr: "Blitva", en: "Swiss chard", price: 5, category: "sides", tags: ["home", "veg"] },
      { id: "f-krumpir-salata", hr: "Krumpir salata", en: "Potato salad", price: 5, category: "sides", tags: ["home"] },
      { id: "f-leso", hr: "Lešo krumpir", en: "Boiled potatoes", price: 3, category: "sides" },
      { id: "f-palenta", hr: "Palenta", en: "Polenta", price: 5, category: "sides", tags: ["home"] },
      { id: "f-pomfri", hr: "Pomfri", en: "French fries", price: 3, category: "sides" },
      { id: "f-riza", hr: "Riža", en: "Rice", price: 3, category: "sides" },
    ],
  },
  {
    date: "2026-09-28",
    dishes: [
      { id: "m2-cevapi", hr: "Ćevapi žar + prilog", en: "Grilled ćevapi + side", price: 8, category: "mains", tags: ["grill"] },
      { id: "m2-fazol-panceta", hr: "Fažol s hamburger pancetom", en: "Bean stew with bacon", price: 7, category: "mains", tags: ["home"] },
      { id: "m2-fazol-hren", hr: "Fažol s hrenovkom", en: "Bean stew with frankfurter", price: 7, category: "mains", tags: ["home"] },
      { id: "m2-fazol-kob", hr: "Fažol s kobasicom", en: "Bean stew with sausage", price: 7, category: "mains", tags: ["home"] },
      { id: "m2-grcka", hr: "Grčka salata s paštom", en: "Greek pasta salad", price: 7, category: "mains", tags: ["veg"] },
      { id: "m2-jetrica", hr: "Jetrica juneća gulaš s palentom", en: "Beef liver goulash with polenta", price: 7, category: "mains", tags: ["home"] },
      { id: "m2-bolonjez", hr: "Pašta bologneze", en: "Pasta Bolognese", price: 7, category: "mains" },
      { id: "m2-pecena", hr: "Pečena piletina (batak-zabatak) + prilog", en: "Roast chicken (thigh) + side", price: 7, category: "mains", tags: ["home"] },
      { id: "m2-pohana-prsa", hr: "Pohana pileća prsa + prilog", en: "Breaded chicken breast + side", price: 8, category: "mains" },
      { id: "m2-pohana-svinja", hr: "Pohana svinjetina + prilog", en: "Breaded pork + side", price: 8, category: "mains" },
      ...sandwich,
      ...salads([
        { id: "m2-sal-feta", hr: "Obročna salata s feta sirom", en: "Meal salad with feta", price: 7, category: "salads", tags: ["veg"] },
        { id: "m2-sal-piletina", hr: "Obročna salata s piletinom", en: "Meal salad with chicken", price: 7, category: "salads" },
        { id: "m2-sal-oba", hr: "Obročna salata s piletinom i feta sirom", en: "Meal salad with chicken and feta", price: 7, category: "salads" },
      ]),
      ...desserts,
      { id: "m2-leso", hr: "Lešo krumpir", en: "Boiled potatoes", price: 3, category: "sides" },
      { id: "m2-krpice", hr: "Pašta krpice", en: "Pasta squares", price: 5, category: "sides", tags: ["home"] },
      { id: "m2-pomfri", hr: "Pomfri", en: "French fries", price: 3, category: "sides" },
      { id: "m2-restani", hr: "Restani krumpir", en: "Pan-fried potatoes", price: 3, category: "sides" },
      { id: "m2-rizi", hr: "Rizi bizi", en: "Risi e bisi (rice and peas)", price: 3, category: "sides" },
    ],
  },
];

export const categories: { id: Category; hr: string; en: string }[] = [
  { id: "mains", hr: "Glavna jela", en: "Mains" },
  { id: "sandwiches", hr: "Sendviči", en: "Sandwiches" },
  { id: "salads", hr: "Salate", en: "Salads" },
  { id: "desserts", hr: "Deserti", en: "Desserts" },
  { id: "sides", hr: "Prilozi", en: "Sides" },
];

export function formatPrice(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

export function formatDay(date: string, locale: "hr" | "en") {
  const d = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(locale === "hr" ? "hr-HR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

export function shortDay(date: string, locale: "hr" | "en") {
  const d = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(locale === "hr" ? "hr-HR" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  }).format(d);
}

export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Zagreb" });
}

export function todayMenu(): DayMenu {
  const today = todayISO();
  return week.find((d) => d.date >= today) ?? week[0];
}

export const bannerDayKey: Record<string, string> = {
  "2026-09-21": "mon",
  "2026-09-22": "tue",
  "2026-09-23": "wed",
  "2026-09-24": "thu",
  "2026-09-25": "fri",
  "2026-09-28": "mon2",
};

export function bannerSrc(date: string, category: Category) {
  if (bannerDayKey[date]) return `/banners/banner-${bannerDayKey[date]}-${category}.png`;
  const dow = new Date(`${date}T12:00:00`).getDay();
  const same = week.find((d) => new Date(`${d.date}T12:00:00`).getDay() === dow);
  const key = (same && bannerDayKey[same.date]) || "mon";
  return `/banners/banner-${key}-${category}.png`;
}

export function nextWeekdays(from: string, count: number) {
  const out: string[] = [];
  const d = new Date(`${from}T12:00:00`);
  while (out.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      out.push(`${y}-${m}-${day}`);
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function menuForDate(date: string): DayMenu {
  const exact = week.find((d) => d.date === date);
  if (exact) return exact;
  const dow = new Date(`${date}T12:00:00`).getDay();
  const same = [...week].reverse().find((d) => new Date(`${d.date}T12:00:00`).getDay() === dow);
  return { date, dishes: same?.dishes ?? [] };
}
