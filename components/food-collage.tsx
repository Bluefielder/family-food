const PHOTOS = [
  { src: "/food/food-fazol.png", className: "col-span-2 row-span-2" },
  { src: "/food/food-chicken.png", className: "col-span-2" },
  { src: "/food/food-strudel.png", className: "" },
  { src: "/food/food-sardines.png", className: "" },
  { src: "/food/food-cevapi.png", className: "col-span-2" },
  { src: "/food/food-goulash.png", className: "row-span-2" },
  { src: "/food/food-pasta.png", className: "col-span-2" },
  { src: "/food/food-risotto.png", className: "" },
  { src: "/food/food-manestra.png", className: "col-span-2" },
  { src: "/food/food-schnitzel.png", className: "" },
  { src: "/food/food-salad.png", className: "" },
  { src: "/food/food-blitva.png", className: "col-span-2" },
] as const;

export function FoodCollage() {
  const wall = [...PHOTOS, ...PHOTOS];
  return (
    <div className="food-collage" aria-hidden>
      <div className="food-collage-grid">
        {wall.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`${p.src}-${i}`} src={p.src} alt="" className={p.className} />
        ))}
      </div>
    </div>
  );
}
