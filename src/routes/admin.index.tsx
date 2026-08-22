import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, productsQuery, productImage, type MediaItem, type Product } from "@/lib/catalog";
import {
  COLOUR_OPTIONS,
  FABRICS,
  KIDS_SIZES,
  SAREE_CATEGORY,
  SAREE_SIZES,
  STOCK_STATUSES,
  formatPrice,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({ component: AdminProducts });

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

type Draft = {
  id?: string;
  name: string;
  price: string;
  category_slug: string;
  fabric: string;
  stock_status: string;
  media: MediaItem[];
  sizes: string[];
  colours: string[];
  description: string;
  instagram_url: string;
  featured: boolean;
  featured_section: "fresh" | "editors";
};

const emptyDraft = (category: string): Draft => ({
  name: "",
  price: "",
  category_slug: category,
  fabric: "",
  stock_status: "In Stock",
  media: [],
  sizes: [],
  colours: [],
  description: "",
  instagram_url: "",
  featured: false,
  featured_section: "fresh",
});

const toDraft = (p: Product): Draft => ({
  id: p.id,
  name: p.name,
  price: String(p.price),
  category_slug: p.category_slug,
  fabric: p.fabric ?? "",
  stock_status: p.stock_status,
  media: p.media,
  sizes: p.sizes,
  colours: p.colours,
  description: p.description ?? "",
  instagram_url: p.instagram_url ?? "",
  featured: p.featured,
  featured_section: p.featured_section,
});

function AdminProducts() {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery(categoriesQuery());
  const { data: products = [], isLoading } = useQuery(productsQuery());
  const [draft, setDraft] = useState<Draft | null>(null);

  const grouped = useMemo(
    () =>
      categories.map((c) => ({
        category: c,
        items: products.filter((p) => p.category_slug === c.slug),
      })),
    [categories, products],
  );

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <span className="text-sm text-muted-foreground">{products.length} total</span>
      </div>

      {isLoading && (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading products…
        </p>
      )}

      <div className="mt-5 space-y-5">
        {grouped.map(({ category, items }) => (
          <section key={category.slug} className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-lg font-semibold">{category.name}</h2>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
                {items.length} {items.length === 1 ? "product" : "products"}
              </span>
              <button
                type="button"
                onClick={() => setDraft(emptyDraft(category.slug))}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5" /> Add product
              </button>
            </div>

            <div className="mt-3 divide-y divide-border/60">
              {items.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">No products yet.</p>
              )}
              {items.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {productImage(p) && (
                      <img src={productImage(p)!} alt={p.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(p.price)} · {p.stock_status}
                      {p.featured && ` · Featured (${p.featured_section === "editors" ? "Editor's Picks" : "Fresh Arrivals"})`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft(toDraft(p))}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"
                    aria-label={`Edit ${p.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${p.name}"?`)) del.mutate(p.id);
                    }}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/10 text-destructive"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {draft && (
        <ProductForm
          draft={draft}
          setDraft={setDraft}
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          onDone={() => {
            setDraft(null);
            void qc.invalidateQueries({ queryKey: ["products"] });
          }}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function ProductForm({
  draft,
  setDraft,
  categories,
  onDone,
}: {
  draft: Draft;
  setDraft: (d: Draft | null) => void;
  categories: { slug: string; name: string }[];
  onDone: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSaree = draft.category_slug === SAREE_CATEGORY;
  const sizeOptions = isSaree ? SAREE_SIZES : KIDS_SIZES;
  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });

  const toggle = (key: "sizes" | "colours", value: string) =>
    set({
      [key]: draft[key].includes(value)
        ? draft[key].filter((v) => v !== value)
        : [...draft[key], value],
    } as Partial<Draft>);

  const onCategoryChange = (slug: string) => {
    if (slug === SAREE_CATEGORY) set({ category_slug: slug, sizes: [...SAREE_SIZES] });
    else set({ category_slug: slug, sizes: draft.sizes.filter((s) => KIDS_SIZES.includes(s)) });
  };

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const added: MediaItem[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-media").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data, error: signErr } = await supabase.storage
          .from("product-media")
          .createSignedUrl(path, SIGNED_URL_TTL);
        if (signErr || !data) throw signErr ?? new Error("Could not create media URL");
        added.push({ url: data.signedUrl, type: file.type.startsWith("video") ? "video" : "image" });
      }
      set({ media: [...draft.media, ...added] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: draft.name.trim(),
        price: Number(draft.price || 0),
        category_slug: draft.category_slug,
        fabric: draft.fabric || null,
        stock_status: draft.stock_status,
        media: draft.media as unknown as never,
        sizes: draft.sizes,
        colours: draft.colours,
        description: draft.description.trim() || null,
        instagram_url: draft.instagram_url.trim() || null,
        featured: draft.featured,
        featured_section: draft.featured_section,
      };
      if (draft.id) {
        const { error: err } = await supabase.from("products").update(payload).eq("id", draft.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("products").insert(payload);
        if (err) throw err;
      }
    },
    onSuccess: onDone,
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/40 p-3 backdrop-blur-sm">
      <div className="mx-auto my-6 max-w-2xl rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            {draft.id ? "Edit product" : "Add product"}
          </h2>
          <button
            type="button"
            onClick={() => setDraft(null)}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Field label="Product name">
            <input
              required
              className={inputCls}
              value={draft.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price (₹)">
              <input
                required
                type="number"
                min={0}
                className={inputCls}
                value={draft.price}
                onChange={(e) => set({ price: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <select
                className={inputCls}
                value={draft.category_slug}
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fabric">
              <select
                className={inputCls}
                value={draft.fabric}
                onChange={(e) => set({ fabric: e.target.value })}
              >
                <option value="">Not specified</option>
                {FABRICS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stock status">
              <select
                className={inputCls}
                value={draft.stock_status}
                onChange={(e) => set({ stock_status: e.target.value })}
              >
                {STOCK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Media (images & video)">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => void upload(e.target.files)}
              className="w-full text-sm"
            />
            {uploading && (
              <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…
              </p>
            )}
            {draft.media.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.media.map((m, i) => (
                  <div key={m.url} className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted">
                    {m.type === "video" ? (
                      <video src={m.url} className="h-full w-full object-cover" muted />
                    ) : (
                      <img src={m.url} alt="" className="h-full w-full object-cover" />
                    )}
                    <button
                      type="button"
                      aria-label="Remove media"
                      onClick={() => set({ media: draft.media.filter((_, j) => j !== i) })}
                      className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-foreground/70 text-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <Field label={isSaree ? "Size (sarees)" : "Sizes"}>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle("sizes", s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium",
                    draft.sizes.includes(s)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Colours">
            <div className="flex flex-wrap gap-2">
              {COLOUR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggle("colours", c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium",
                    draft.colours.includes(c)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Short description">
            <textarea
              rows={3}
              className={cn(inputCls, "resize-none")}
              value={draft.description}
              onChange={(e) => set({ description: e.target.value })}
            />
          </Field>

          <Field label="Instagram post / reel URL (optional)">
            <input
              type="url"
              className={inputCls}
              value={draft.instagram_url}
              onChange={(e) => set({ instagram_url: e.target.value })}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-secondary/50 p-3">
            <label className="inline-flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => set({ featured: e.target.checked })}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Featured product
            </label>
            {draft.featured && (
              <select
                className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
                value={draft.featured_section}
                onChange={(e) => set({ featured_section: e.target.value as "fresh" | "editors" })}
              >
                <option value="fresh">Show in Fresh Arrivals carousel</option>
                <option value="editors">Show in Editor's Picks</option>
              </select>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={save.isPending || uploading}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Save product"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-xl border border-border px-5 py-3 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
