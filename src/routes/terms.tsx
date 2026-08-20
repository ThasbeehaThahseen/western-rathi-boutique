import { createFileRoute } from "@tanstack/react-router";
import { TERMS, WHATSAPP_DISPLAY } from "@/lib/brand";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Policy — Western Rathi" },
      {
        name: "description",
        content:
          "Ordering, exchange, delivery and payment terms for Western Rathi. Orders are confirmed on WhatsApp; no COD available.",
      },
      { property: "og:title", content: "Terms & Policy — Western Rathi" },
      { property: "og:description", content: "Ordering, exchange and delivery terms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-4 pb-8 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">Good to know</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-foreground">Terms &amp; Policy</h1>
      <ol className="mt-6 space-y-3">
        {TERMS.map((t, i) => (
          <li
            key={t}
            className="flex gap-3 rounded-2xl border border-border/60 bg-card p-4 text-sm leading-relaxed text-foreground/85"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
              {i + 1}
            </span>
            {t}
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted-foreground">
        Questions? WhatsApp us at {WHATSAPP_DISPLAY} — we usually reply within a few hours.
      </p>
    </div>
  );
}
