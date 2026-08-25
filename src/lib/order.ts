import { supabase } from "@/integrations/supabase/client";
import { formatPrice, whatsappLink } from "@/lib/brand";
import type { CartItem } from "@/lib/cart";

export type Customer = {
  name: string;
  phone: string;
  address: string;
  pincode?: string;
  notes?: string;
};

export function productLink(item: Pick<CartItem, "productId" | "size" | "colour">): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://western-rathi-boutique.lovable.app";
  const params = new URLSearchParams({ size: item.size, colour: item.colour });
  return `${origin}/product/${item.productId}?${params.toString()}`;
}

export function buildOrderMessage(
  items: CartItem[],
  customer: Customer,
  orderRef: string,
): string {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const lines: string[] = [
    "*NEW ORDER — WESTERN RATHI*",
    "",
    `*Order Ref:* ${orderRef}`,
    "",
    "*Customer Details*",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
  ];
  if (customer.pincode) lines.push(`Pincode: ${customer.pincode}`);
  if (customer.notes) lines.push(`Notes: ${customer.notes}`);

  items.forEach((i, n) => {
    lines.push(
      "",
      "———",
      `*Item ${n + 1}: ${i.name}*`,
      `Size: ${i.size}`,
      `Colour: ${i.colour}`,
      `Quantity: ${i.quantity}`,
      // Bold plain text only — no URL here, so WhatsApp never renders the price as a link.
      `*Price: ${formatPrice(i.price)}*  (${i.quantity} × ${formatPrice(i.price)} = *${formatPrice(
        i.price * i.quantity,
      )}*)`,
      `Link: ${productLink(i)}`,
    );
  });

  lines.push(
    "",
    "———",
    `*Order Total: ${formatPrice(total)}*`,
    "",
    "Please confirm availability and share payment details. Thank you!",
  );
  return lines.join("\n");
}

export function makeOrderRef(orderId: string): string {
  return `WR-${orderId.slice(0, 8).toUpperCase()}`;
}

/** Fire-and-forget order logging. Never throws — the WhatsApp redirect must not depend on it. */
export async function logOrder(
  orderId: string,
  items: CartItem[],
  customer: Customer,
): Promise<void> {
  try {
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const address = [customer.address, customer.pincode ? `- ${customer.pincode}` : "", customer.notes ? `| Notes: ${customer.notes}` : ""]
      .filter(Boolean)
      .join(" ");
    const { error } = await supabase.from("orders").insert({
      id: orderId,
      customer_name: customer.name,
      phone: customer.phone,
      address,
      total,
      status: "pending",
    });
    if (error) throw error;
    await supabase.from("order_items").insert(
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
  } catch (err) {
    console.error("Order logging failed (WhatsApp order still sent)", err);
  }
}

// ----- Recently ordered (personal, per-device history) -----

export type OrderedItem = CartItem & { orderedAt: string };

const RECENT_KEY = "wr-recent-orders-v1";
const RECENT_LIMIT = 12;

const recentKey = (i: Pick<CartItem, "productId" | "size" | "colour">) =>
  `${i.productId}|${i.size}|${i.colour}`;

export function getRecentlyOrdered(): OrderedItem[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OrderedItem[]) : [];
  } catch {
    return [];
  }
}

export function recordOrderedItems(items: CartItem[]): void {
  try {
    const now = new Date().toISOString();
    const merged: OrderedItem[] = [
      ...items.map((i) => ({ ...i, orderedAt: now })),
      ...getRecentlyOrdered(),
    ];
    const seen = new Set<string>();
    const out: OrderedItem[] = [];
    for (const item of merged) {
      const k = recentKey(item);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(item);
      if (out.length >= RECENT_LIMIT) break;
    }
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(out));
  } catch {
    /* ignore */
  }
}

export function openWhatsAppOrder(
  items: CartItem[],
  customer: Customer,
): { ref: string; orderId: string } {
  const orderId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-0000-4000-8000-000000000000`;
  const ref = makeOrderRef(orderId);
  const url = whatsappLink(buildOrderMessage(items, customer, ref));
  window.open(url, "_blank", "noopener");
  recordOrderedItems(items);
  void logOrder(orderId, items, customer);
  return { ref, orderId };
}
