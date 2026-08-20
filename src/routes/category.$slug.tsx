import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const pretty = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${pretty} — Western Rathi` },
        {
          name: "description",
          content: `Shop ${pretty.toLowerCase()} at Western Rathi. Handpicked pieces, easy WhatsApp ordering.`,
        },
        { property: "og:title", content: `${pretty} — Western Rathi` },
        {
          property: "og:description",
          content: `Handpicked ${pretty.toLowerCase()} from Western Rathi.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ context, params }) => {
    void context.queryClient.ensureQueryData(productsQuery(params.slug));
    void context.queryClient.ensureQueryData(categoriesQuery());
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: products } = useSuspenseQuery(productsQuery(slug));
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const category = categories.find((c) => c.slug === slug);

  return (
    <ProductGrid
      products={products}
      eyebrow="Collection"
      title={category?.name ?? "Collection"}
      subtitle="Tap any piece to see fabric, sizes and full photos."
    />
  );
}
