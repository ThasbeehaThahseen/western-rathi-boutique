import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  featured: boolean;
  created_at: string;
};

export const featuredReviewsQuery = () =>
  queryOptions({
    queryKey: ["reviews", "featured"],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Review[];
    },
  });

export const allReviewsQuery = () =>
  queryOptions({
    queryKey: ["reviews", "all"],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Review[];
    },
  });
