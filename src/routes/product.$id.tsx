import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Check, ChevronLeft, Ruler, ShoppingBag } from "lucide-react";
import { productQuery, productsQuery, productImage } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { COLOUR_SWATCHES, SIZE_CHART, TERMS, formatPrice } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { openWhatsAppOrder } from "@/lib/order";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    size: typeof search["size"] === "string" ? search["size"] : "",
    colour: typeof search["colour"] === "string" ? search["colour"] : "",
  }),
  head: (ctx) => {
    const name = (ctx.loaderData as { name?: string } | undefined)?.name;
    return {
      meta: name
        ? [
            { title: `${name} — Western Rathi` },
            {
              name: "description",
              content: `${name} — available now at Western Rathi. Choose your size and colour, then confirm your order on WhatsApp.`,
            },
            { property: "og:title", content: `${name} — Western Rathi` },
            {
              property: "og:description",
              content: `${name} from Western Rathi. Order easily on WhatsApp.`,
            },
            { property: "og:type", content: "product" },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        : [
            { title: "Product unavailable — Western Rathi" },
            { name: "robots", content: "noindex" },
            { name: "description", content: "This product is not available." },
            { property: "og:title", content: "Product unavailable — Western Rathi" },
            { property: "og:description", content: "This product is not available." },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
    };
  },
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.id));
    if (!product) throw notFound();
    void context.queryClient.ensureQueryData(productsQuery(product.category_slug));
    return { name: product.name };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const { data: product } = useSuspenseQuery(productQuery(id));
  const { data: related } = useSuspenseQuery(productsQuery(product?.category_slug ?? ""));
  const { addItem } = useCart();

  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(search.size || null);
  const [colour, setColour] = useState<string | null>(search.colour || null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buyForm, setBuyForm] = useState({ name: "", phone: "", address: "" });
  const [showChart, setShowChart] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  const media = product.media.length > 0 ? product.media : [];
  const current = media[Math.min(active, media.length - 1)];
  const soldOut = product.stock_status === "Out of Stock";

  const validate = () => {
    if (product.sizes.length > 0 && !size) {
      setError("Please choose a size.");
      return false;
    }
    if (product.colours.length > 0 && !colour) {
      setError("Please choose a colour.");
      return false;
    }
    setError(null);
    return true;
  };

  const buildItem = () => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    image: productImage(product),
    size: size ?? "Free Size",
    colour: colour ?? "As shown",
    quantity: qty,
  });

  const handleAdd = () => {
    if (!validate()) return;
    addItem(buildItem());
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    setBuyError(null);
    setBuyOpen(true);
  };

  const submitBuyNow = () => {
    if (buyForm.name.trim().length < 2) return setBuyError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(buyForm.phone.replace(/\D/g, "").slice(-10)))
      return setBuyError("Enter a valid 10-digit mobile number.");
    if (buyForm.address.trim().length < 10) return setBuyError("Please enter your full address.");
    setBuyError(null);
    openWhatsAppOrder([buildItem()], {
      name: buyForm.name.trim(),
      phone: buyForm.phone.replace(/\D/g, "").slice(-10),
      address: buyForm.address.trim(),
    });
    setBuyOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-3 pt-2 pb-8 sm:px-5">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <div
            ref={frameRef}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            onMouseLeave={() => setZoom(null)}
            className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted shadow-[var(--shadow-lift)]"
          >
            {current?.type === "video" ? (
              <video
                src={current.url}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : current ? (
              <img
                src={current.url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-200"
                style={
                  zoom
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      }
                    : undefined
                }
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                No media
              </div>
            )}
            <span className="pointer-events-none absolute bottom-3 left-3 hidden rounded-full bg-card/85 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur lg:block">
              Hover to zoom
            </span>
          </div>

          {media.length > 1 && (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {media.map((m, i) => (
                <button
                  key={m.url + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                    i === active ? "border-primary" : "border-transparent",
                  )}
                >
                  {m.type === "video" ? (
                    <span className="grid h-full w-full place-items-center bg-secondary text-[10px] font-semibold">
                      Video
                    </span>
                  ) : (
                    <img src={m.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-2xl leading-tight font-bold text-foreground sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="font-display text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
                product.stock_status === "In Stock"
                  ? "bg-whatsapp/15 text-[oklch(0.45_0.13_145)]"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {product.stock_status}
            </span>
          </div>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{product.description}</p>
          )}

          {product.fabric && (
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground/80">Fabric:</span> {product.fabric}
            </p>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Select size
                </p>
                <button
                  type="button"
                  onClick={() => setShowChart((v) => !v)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  <Ruler className="h-3.5 w-3.5" /> Size chart
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-14 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-secondary/70",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {showChart && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60 text-xs uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Size</th>
                        <th className="px-3 py-2 text-left font-semibold">Chest (approx.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHART.map((r) => (
                        <tr key={r.size} className="border-t border-border/60">
                          <td className="px-3 py-1.5">{r.size}</td>
                          <td className="px-3 py-1.5 text-muted-foreground">{r.chest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {product.colours.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Select colour
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colours.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColour(c)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                      colour === c
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-secondary/70",
                    )}
                  >
                    <span
                      className="h-4 w-4 rounded-full ring-1 ring-border"
                      style={{ background: COLOUR_SWATCHES[c] ?? "var(--muted)" }}
                    />
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Qty
            </p>
            <div className="inline-flex items-center rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3.5 py-2 text-lg leading-none"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-3.5 py-2 text-lg leading-none"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-card px-5 py-3.5 text-sm font-semibold text-primary transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? "Added to cart" : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={soldOut}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              Buy now
            </button>
          </div>

          {buyOpen && (
            <div className="mt-3 space-y-3 rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
              <p className="font-display text-base font-semibold">Your details</p>
              {(
                [
                  { k: "name", label: "Full name", placeholder: "Priya Sharma" },
                  { k: "phone", label: "WhatsApp number", placeholder: "9876543210" },
                ] as const
              ).map((f) => (
                <div key={f.k}>
                  <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                  <input
                    value={buyForm[f.k]}
                    onChange={(e) => setBuyForm((s) => ({ ...s, [f.k]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full address</label>
                <textarea
                  value={buyForm.address}
                  onChange={(e) => setBuyForm((s) => ({ ...s, address: e.target.value }))}
                  rows={3}
                  placeholder="House / street, area, city, state, pincode"
                  className="mt-1 w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {buyError && <p className="text-xs text-destructive">{buyError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBuyOpen(false)}
                  className="rounded-xl border border-border px-4 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitBuyNow}
                  className="flex-1 rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
                >
                  Send order on WhatsApp
                </button>
              </div>
            </div>
          )}


          <div className="mt-6 rounded-2xl bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
            <p className="mb-1.5 font-semibold text-foreground/80">Before you order</p>
            <ul className="list-disc space-y-1 pl-4">
              {TERMS.slice(0, 4).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Link to="/terms" className="mt-2 inline-block font-semibold text-primary">
              Read all terms
            </Link>
          </div>
        </div>
      </div>

      {related.filter((r) => r.id !== product.id).length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            You may also like
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {related
              .filter((r) => r.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
