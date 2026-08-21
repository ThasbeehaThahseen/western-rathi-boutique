import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, whatsappLink, WHATSAPP_DISPLAY } from "@/lib/brand";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Western Rathi" },
      {
        name: "description",
        content:
          "Review your Western Rathi bag and send your order straight to us on WhatsApp for confirmation.",
      },
      { property: "og:title", content: "Your Bag — Western Rathi" },
      { property: "og:description", content: "Review your bag and order on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQuantity, removeItem, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));


  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e["name"] = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10)))
      e["phone"] = "Enter a valid 10-digit mobile number.";
    if (form.address.trim().length < 10) e["address"] = "Please enter your full address.";
    if (!/^\d{6}$/.test(form.pincode.trim())) e["pincode"] = "Enter a 6-digit pincode.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = async () => {
    if (items.length === 0 || !validate()) return;
    setSending(true);
    try {
      const fullAddress = `${form.address.trim()} - ${form.pincode.trim()}${
        form.notes.trim() ? ` | Notes: ${form.notes.trim()}` : ""
      }`;
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name.trim(),
          phone: form.phone.replace(/\D/g, "").slice(-10),
          address: fullAddress,
          total: subtotal,
          status: "New",
        })
        .select("id")
        .single();
      if (error) throw error;

      const orderId = (order as { id: string }).id;
      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: orderId,
          product_id: i.productId,
          product_name: i.name,
          size: i.size,
          colour: i.colour,
          quantity: i.quantity,
          price: i.price,
        })),
      );
      if (itemsError) throw itemsError;

      const ref = `WR-${orderId.slice(0, 8).toUpperCase()}`;
      window.open(whatsappLink(buildMessage(ref)), "_blank", "noopener");
      setDone(ref);
      clear();
    } catch (err) {
      console.error(err);
      setErrors({ form: "We couldn't save your order. Please try again or message us directly." });
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-primary">Order sent!</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your order <span className="font-semibold text-foreground">{done}</span> is on its way to
          our WhatsApp. If the chat didn't open, message us at {WHATSAPP_DISPLAY}.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-3 pt-2 pb-8 sm:px-5">
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Your bag</h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <p className="font-display text-lg font-semibold">Your bag is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Little frocks and beautiful sarees are waiting.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <ul className="space-y-3">
            {items.map((i) => (
              <li
                key={`${i.productId}|${i.size}|${i.colour}`}
                className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-[var(--shadow-soft)]"
              >
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {i.image && (
                    <img
                      src={i.image}
                      alt={i.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-display text-sm font-semibold">{i.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {i.size} · {i.colour}
                  </p>
                  <p className="mt-1 font-display text-sm font-bold text-primary">
                    {formatPrice(i.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="inline-flex items-center rounded-lg border border-border">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setQuantity(i.productId, i.size, i.colour, i.quantity - 1)}
                        className="px-2.5 py-1.5"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">{i.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => setQuantity(i.productId, i.size, i.colour, i.quantity + 1)}
                        className="px-2.5 py-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(i.productId, i.size, i.colour)}
                      className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl font-bold text-primary">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping is confirmed on WhatsApp based on your pincode.
            </p>

            <h2 className="pt-1 font-display text-base font-semibold">Delivery details</h2>

            {(
              [
                { k: "name", label: "Full name", placeholder: "Priya Sharma" },
                { k: "phone", label: "WhatsApp number", placeholder: "9876543210" },
                { k: "pincode", label: "Pincode", placeholder: "600001" },
              ] as const
            ).map((f) => (
              <div key={f.k}>
                <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                <input
                  value={form[f.k]}
                  onChange={(e) => update(f.k, e.target.value)}
                  placeholder={f.placeholder}
                  inputMode={f.k === "name" ? "text" : "numeric"}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                {errors[f.k] && <p className="mt-1 text-xs text-destructive">{errors[f.k]}</p>}
              </div>
            ))}

            <div>
              <label className="text-xs font-medium text-muted-foreground">Full address</label>
              <textarea
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                rows={3}
                placeholder="House / street, area, city, state"
                className="mt-1 w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              {errors["address"] && (
                <p className="mt-1 text-xs text-destructive">{errors["address"]}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Notes (optional)
              </label>
              <input
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Gift wrap, delivery by date…"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {errors["form"] && <p className="text-xs text-destructive">{errors["form"]}</p>}

            <button
              type="button"
              onClick={() => void handleCheckout()}
              disabled={sending}
              className="w-full rounded-xl bg-whatsapp px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {sending ? "Preparing your order…" : "Order on WhatsApp"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              We'll open WhatsApp with your order details filled in. Payment and confirmation happen
              in chat — no COD.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
