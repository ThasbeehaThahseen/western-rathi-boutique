import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Western Rathi" },
      {
        name: "description",
        content:
          "Browse every Western Rathi piece: girls' western, casual and ethnic wear plus designer sarees. Filter by size, colour, fabric and price.",
      },
      { property: "og:title", content: "Shop All — Western Rathi" },
      {
        property: "og:description",
        content: "Girls' western, casual and ethnic wear plus designer sarees.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(productsQuery());
    void context.queryClient.ensureQueryData(categoriesQuery());
  },
  component: Shop,
});

function Shop() {
  const { data: products } = useSuspenseQuery(productsQuery());

  return (
    <ProductGrid
      products={products}
      title="All Products"
      eyebrow="The full collection"
      subtitle="Every piece in the boutique, from tiny everyday sets to festive sarees."
      showCategoryFilter
    />
  );
}
