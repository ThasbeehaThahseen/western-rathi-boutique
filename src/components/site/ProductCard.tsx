import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/brand";
import { productImage, type Product } from "@/lib/catalog";
import { COLOUR_SWATCHES } from "@/lib/brand";

export function ProductCard({ product }: { product: Product }) {
  const image = productImage(product);
  const soldOut = product.stock_status === "Out of Stock";

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {product.stock_status !== "In Stock" && (
          <span className="absolute top-2 left-2 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-primary-foreground uppercase">
            {soldOut ? "Sold Out" : product.stock_status}
          </span>
        )}
      </div>
      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-2 font-display text-sm leading-snug font-semibold text-foreground">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-base font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <div className="flex -space-x-1">
            {product.colours.slice(0, 4).map((c) => (
              <span
                key={c}
                title={c}
                className="h-3.5 w-3.5 rounded-full ring-2 ring-card"
                style={{ background: COLOUR_SWATCHES[c] ?? "var(--muted)" }}
              />
            ))}
          </div>
        </div>
        {product.fabric && <p className="text-[11px] text-muted-foreground">{product.fabric}</p>}
      </div>
    </Link>
  );
}
