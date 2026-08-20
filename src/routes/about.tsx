import { createFileRoute, Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import { Reveal } from "@/components/site/Reveal";
import { whatsappLink } from "@/lib/brand";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Western Rathi" },
      {
        name: "description",
        content:
          "Western Rathi is a family-run boutique curating girls' western, casual and ethnic wear and designer sarees, with every order confirmed personally on WhatsApp.",
      },
      { property: "og:title", content: "Our Story — Western Rathi" },
      {
        property: "og:description",
        content: "A family-run boutique for girls' wear and designer sarees.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-4 pb-8 sm:px-6">
      <Reveal>
        <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">About us</p>
        <h1 className="mt-2 font-serif text-3xl leading-tight text-primary italic sm:text-5xl">
          Dressing little girls, and the women who love them.
        </h1>
      </Reveal>

      <Reveal delay={80}>
        <img
          src={hero1}
          alt="Western Rathi kidswear collection"
          loading="lazy"
          width={1600}
          height={1104}
          className="mt-6 aspect-[16/9] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
        />
      </Reveal>

      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-foreground/85">
        <Reveal>
          <p>
            Western Rathi started at a kitchen table, with two suitcases of frocks and a phone that
            wouldn't stop buzzing. Friends wanted something better than what the local market offered
            — softer fabrics, sweeter prints, honest prices. Word travelled, and a boutique was born.
          </p>
        </Reveal>
        <Reveal>
          <p>
            Today we curate western, casual and ethnic wear for girls from newborn to twelve years
            (sizes 18 to 36), alongside a small, carefully chosen shelf of designer sarees for the
            women in the family. Every single piece is inspected by hand: seams pulled, zips tested,
            fabric held against the light. If it isn't good enough for our own children, it doesn't
            make it to the rack.
          </p>
        </Reveal>
        <Reveal>
          <p>
            We keep the ordering personal, too. There's no faceless checkout here — you pick what you
            love, and we finish the conversation on WhatsApp, confirming size, colour and delivery
            just like you would in a shop.
          </p>
        </Reveal>
      </div>

      <Reveal delay={80}>
        <img
          src={hero2}
          alt="Designer saree collection"
          loading="lazy"
          width={1600}
          height={1104}
          className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
        />
      </Reveal>

      <Reveal className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { title: "Handpicked", body: "Nothing is drop-shipped. We choose each style ourselves." },
          { title: "True to size", body: "Measurements checked against a real size chart." },
          { title: "Personal service", body: "One chat away for styling, sizing or tracking." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="font-display text-base font-semibold text-primary">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/shop"
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Browse the collection
        </Link>
        <a
          href={whatsappLink("Hi Western Rathi! I'd like to know more about your brand.")}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-full border border-primary/25 bg-card px-5 py-3 text-sm font-semibold text-primary"
        >
          Say hello on WhatsApp
        </a>
      </Reveal>
    </div>
  );
}
