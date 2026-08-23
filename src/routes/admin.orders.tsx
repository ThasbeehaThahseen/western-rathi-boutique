import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  PackageOpen,
  Repeat2,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

type OrderItem = {
  id: string;
  product_name: string;
  size: string | null;
  colour: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customer_name: string;
  phone: string | null;
  address: string;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
};

const STATUS_ACTIONS = [
  { key: "finished", label: "Finished", icon: CheckCircle2 },
  { key: "dismissed", label: "Dismissed", icon: XCircle },
] as const;

const inputCls =
  "rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const toTs = to ? new Date(`${to}T23:59:59.999`).getTime() : null;
    return orders.filter((o) => {
      const t = new Date(o.created_at).getTime();
      if (fromTs !== null && t < fromTs) return false;
      if (toTs !== null && t > toTs) return false;
      return true;
    });
  }, [orders, from, to]);

  const stats = useMemo(
    () => ({
      total: filtered.length,
      finished: filtered.filter((o) => o.status === "finished").length,
      dismissed: filtered.filter((o) => o.status === "dismissed").length,
    }),
    [filtered],
  );

  const repeatPhones = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of orders) {
      if (!o.phone) continue;
      counts.set(o.phone, (counts.get(o.phone) ?? 0) + 1);
    }
    return new Set([...counts.entries()].filter(([, c]) => c > 1).map(([p]) => p));
  }, [orders]);

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="block text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={cn(inputCls, "mt-1")}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              To
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={cn(inputCls, "mt-1")}
            />
          </div>
          {(from || to) && (
            <button
              type="button"
              onClick={() => {
                setFrom("");
                setTo("");
              }}
              className="rounded-full bg-secondary px-3.5 py-2 text-xs font-semibold"
            >
              Clear dates
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {[
          { label: "Total orders", value: stats.total },
          { label: "Finished", value: stats.finished },
          { label: "Dismissed", value: stats.dismissed },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border/60 bg-card p-3 text-center sm:p-4"
          >
            <p className="font-display text-2xl font-bold text-primary sm:text-3xl">{s.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {isLoading && (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading orders…
        </p>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <PackageOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-semibold">No orders in this range</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {from || to
              ? "Try widening the date range."
              : "Orders placed via WhatsApp checkout will appear here."}
          </p>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {filtered.map((o) => {
          const isRepeat = o.phone !== null && repeatPhones.has(o.phone);
          return (
            <article
              key={o.id}
              className={cn(
                "rounded-2xl border p-4 shadow-[var(--shadow-soft)]",
                isRepeat ? "border-gold/70 bg-gold/10" : "border-border/60 bg-card",
              )}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <p className="font-display text-base font-semibold">{o.customer_name}</p>
                {o.phone && <p className="text-sm text-muted-foreground">{o.phone}</p>}
                {isRepeat && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
                    <Repeat2 className="h-3 w-3" /> Repeat customer
                  </span>
                )}
                <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(o.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-muted-foreground">{o.address}</p>

              <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
                {o.order_items.map((i) => (
                  <li key={i.id} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="font-medium">{i.product_name}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {[i.size, i.colour].filter(Boolean).join(" · ")} · qty {i.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold">
                      {formatPrice(i.price * i.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                <p className="font-display text-base font-bold text-primary">
                  Total {formatPrice(o.total)}
                </p>
                <div className="ml-auto flex items-center gap-2">
                  {o.status !== "finished" && o.status !== "dismissed" && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold tracking-wide text-secondary-foreground uppercase">
                      Pending
                    </span>
                  )}
                  {STATUS_ACTIONS.map(({ key, label, icon: Icon }) => {
                    const active = o.status === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={setStatus.isPending}
                        onClick={() =>
                          setStatus.mutate({ id: o.id, status: active ? "pending" : key })
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                          active
                            ? key === "finished"
                              ? "border-transparent bg-whatsapp text-white"
                              : "border-transparent bg-foreground/80 text-background"
                            : "border-border bg-card hover:bg-secondary/70",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
