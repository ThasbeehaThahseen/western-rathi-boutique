import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { categoriesQuery, type Product } from "@/lib/catalog";
import { COLOUR_SWATCHES, formatPrice } from "@/lib/brand";
import { cn } from "@/lib/utils";

type SortKey = "newest" | "price-asc" | "price-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground/75 hover:bg-secondary/70",
      )}
    >
      {children}
    </button>
  );
}

export function ProductGrid({
  products,
  title,
  eyebrow,
  subtitle,
  showCategoryFilter = false,
}: {
  products: Product[];
  title: string;
  eyebrow?: string;
  subtitle?: string;
  showCategoryFilter?: boolean;
}) {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [colour, setColour] = useState<string | null>(null);
  const [fabric, setFabric] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");

  const priceCeiling = useMemo(
    () => Math.max(1000, ...products.map((p) => Math.ceil(p.price / 500) * 500)),
    [products],
  );

  const sizes = useMemo(
    () => [...new Set(products.flatMap((p) => p.sizes))],
    [products],
  );
  const colours = useMemo(() => [...new Set(products.flatMap((p) => p.colours))], [products]);
  const fabrics = useMemo(
    () => [...new Set(products.map((p) => p.fabric).filter(Boolean) as string[])],
    [products],
  );

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        (!category || p.category_slug === category) &&
        (!size || p.sizes.includes(size)) &&
        (!colour || p.colours.includes(colour)) &&
        (!fabric || p.fabric === fabric) &&
        (maxPrice === null || p.price <= maxPrice) &&
        (!inStockOnly || p.stock_status === "In Stock"),
    );
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, size, colour, fabric, maxPrice, inStockOnly, sort]);

  const activeCount =
    (category ? 1 : 0) +
    (size ? 1 : 0) +
    (colour ? 1 : 0) +
    (fabric ? 1 : 0) +
    (maxPrice !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const clearAll = () => {
    setCategory(null);
    setSize(null);
    setColour(null);
    setFabric(null);
    setMaxPrice(null);
    setInStockOnly(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-3 pt-4 sm:px-5">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 truncate font-display text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-[var(--shadow-soft)]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </button>
      </header>

      {open && (
        <div className="mt-4 space-y-4 rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
          {showCategoryFilter && (
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Chip
                    key={c.slug}
                    active={category === c.slug}
                    onClick={() => setCategory(category === c.slug ? null : c.slug)}
                  >
                    {c.name}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <Chip key={s} active={size === s} onClick={() => setSize(size === s ? null : s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Colour
            </p>
            <div className="flex flex-wrap gap-2">
              {colours.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColour(colour === c ? null : c)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    colour === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground/75 hover:bg-secondary/70",
                  )}
                >
                  <span
                    className="h-3 w-3 rounded-full ring-1 ring-border"
                    style={{ background: COLOUR_SWATCHES[c] ?? "var(--muted)" }}
                  />
                  {c}
                </button>
              ))}
            </div>
          </div>

          {fabrics.length > 1 && (
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Fabric
              </p>
              <div className="flex flex-wrap gap-2">
                {fabrics.map((f) => (
                  <Chip
                    key={f}
                    active={fabric === f}
                    onClick={() => setFabric(fabric === f ? null : f)}
                  >
                    {f}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Max price · {maxPrice === null ? "Any" : formatPrice(maxPrice)}
            </p>
            <input
              type="range"
              min={500}
              max={priceCeiling}
              step={100}
              value={maxPrice ?? priceCeiling}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              In stock only
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-border bg-card px-3 py-2 text-sm"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                <X className="h-4 w-4" /> Clear all
              </button>
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <p className="font-display text-lg font-semibold">Nothing matches those filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing a filter or two — new stock lands every week.
          </p>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 pb-6 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 6) * 50}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
