import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type MediaItem = { url: string; type: "image" | "video" };

export type Product = {
  id: string;
  name: string;
  price: number;
  category_slug: string;
  fabric: string | null;
  stock_status: string;
  media: MediaItem[];
  sizes: string[];
  colours: string[];
  description: string | null;
  instagram_url: string | null;
  featured: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  sort_order: number;
};

function normalise(row: Record<string, unknown>): Product {
  const media = Array.isArray(row["media"]) ? (row["media"] as MediaItem[]) : [];
  return {
    id: String(row["id"]),
    name: String(row["name"]),
    price: Number(row["price"] ?? 0),
    category_slug: String(row["category_slug"]),
    fabric: (row["fabric"] as string | null) ?? null,
    stock_status: String(row["stock_status"] ?? "In Stock"),
    media,
    sizes: (row["sizes"] as string[] | null) ?? [],
    colours: (row["colours"] as string[] | null) ?? [],
    description: (row["description"] as string | null) ?? null,
    instagram_url: (row["instagram_url"] as string | null) ?? null,
    featured: Boolean(row["featured"]),
    created_at: String(row["created_at"]),
  };
}

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Category[];
    },
  });

export const productsQuery = (categorySlug?: string) =>
  queryOptions({
    queryKey: ["products", categorySlug ?? "all"],
    queryFn: async (): Promise<Product[]> => {
      let q = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (categorySlug) q = q.eq("category_slug", categorySlug);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((r) => normalise(r as Record<string, unknown>));
    },
  });

export const productQuery = (id: string) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? normalise(data as Record<string, unknown>) : null;
    },
  });

export function productImage(product: Pick<Product, "media">): string | null {
  const first = product.media.find((m) => m.type === "image") ?? product.media[0];
  return first?.url ?? null;
}
