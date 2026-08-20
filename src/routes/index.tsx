import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, Sparkles, Truck } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { whatsappLink } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Western Rathi — Girls' Western, Casual & Ethnic Wear + Designer Sarees" },
      {
        name: "description",
        content:
          "Shop handpicked western, casual and ethnic outfits for girls 0–12 years and designer sarees for women. Order in minutes over WhatsApp.",
      },
      { property: "og:title", content: "Western Rathi — Kids' Wear & Designer Sarees" },
      {
        property: "og:description",
        content: "Warm, premium kidswear and designer sarees, ordered simply over WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(categoriesQuery());
    void context.queryClient.ensureQueryData(productsQuery());
  },
  component: Home,
});

const SLIDES = [
  {
    image: hero1,
    eyebrow: "New season",
    title: "Little outfits, big smiles",
    body: "Western, casual and ethnic picks for girls aged 0 to 12 — sizes 18 to 36.",
    to: "/shop" as const,
    cta: "Shop kids' wear",
  },
  {
    image: hero2,
    eyebrow: "For her",
    title: "Sarees woven to be remembered",
    body: "Handpicked designer sarees in silk, chiffon and georgette with zari borders.",
    to: "/category/$slug" as const,
    params: { slug: "designer-sarees" },
    cta: "Explore sarees",
  },
];

function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="px-3 sm:px-5">
      <div className="relative mx-auto aspect-[4/5] max-w-6xl overflow-hidden rounded-3xl shadow-[var(--shadow-lift)] sm:aspect-[16/9] lg:aspect-[21/9]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== index}
          >
            <img
              src={slide.image}
              alt={slide.title}
              width={1600}
              height={1104}
              className={`h-full w-full object-cover transition-transform duration-[7000ms] ease-out ${i === index ? "scale-105" : "scale-100"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.28_0.07_350_/_0.78)] via-[oklch(0.28_0.07_350_/_0.28)] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10 lg:p-14">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
                {slide.eyebrow}
              </p>
              <h1 className="mt-2 max-w-xl font-display text-3xl leading-tight font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/85 sm:text-base">
                {slide.body}
              </p>
              <Link
                to={slide.to}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                params={(slide as any).params}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-semibold text-primary shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
              >
                {slide.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}

        <div className="absolute right-5 bottom-5 flex gap-1.5 sm:right-10">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-card" : "w-3 bg-card/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const { data: products } = useSuspenseQuery(productsQuery());
  const fresh = products.slice(0, 8);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="pb-4">
      <Hero />

      <section className="mx-auto mt-6 max-w-6xl px-3 sm:px-5">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { icon: Sparkles, label: "Handpicked quality" },
            { icon: Heart, label: "Sizes 18–36 · 0–12 yrs" },
            { icon: Truck, label: "Pan-India shipping" },
            { icon: ArrowRight, label: "Order on WhatsApp" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-3 text-xs font-medium text-foreground/80"
            >
              <Icon className="h-4 w-4 shrink-0 text-gold" />
              <span className="min-w-0 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-3 sm:px-5">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
              Just in
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Fresh Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </Reveal>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {fresh.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-5">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">Browse</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
            Shop by category
          </h2>
        </Reveal>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <Link
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative block aspect-[5/4] overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]"
              >
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.28_0.07_350_/_0.75)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <h3 className="font-display text-sm font-semibold text-primary-foreground sm:text-lg">
                    {c.name}
                  </h3>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-primary-foreground/80">
                    Shop now <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-5">
          <Reveal>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
              Loved by our customers
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Editor's picks
            </h2>
          </Reveal>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-5">
        <Reveal className="overflow-hidden rounded-3xl border border-border/60 bg-[var(--gradient-blush)]">
          <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.3em] text-primary/70 uppercase">
                About us
              </p>
              <h2 className="mt-2 font-serif text-2xl leading-snug text-primary italic sm:text-4xl">
                A little boutique with a very big heart.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
                Western Rathi began with a simple wish — that dressing up should feel joyful, never
                complicated. We handpick every frock, kurta set and saree ourselves, checking fabric,
                stitching and comfort before it reaches your little one's wardrobe. No mass catalogues,
                no guesswork; just pieces we would happily buy for our own family.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  Read our story
                </Link>
                <a
                  href={whatsappLink("Hi Western Rathi! I'd love a styling recommendation.")}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-primary/25 bg-card px-5 py-3 text-sm font-semibold text-primary transition-transform hover:scale-[1.03]"
                >
                  Ask us on WhatsApp
                </a>
              </div>
            </div>
            <img
              src={hero1}
              alt="Western Rathi collection"
              loading="lazy"
              width={1600}
              height={1104}
              className="hidden h-64 w-full rounded-2xl object-cover shadow-[var(--shadow-soft)] lg:block"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
