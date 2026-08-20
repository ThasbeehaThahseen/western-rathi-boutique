import { Link } from "@tanstack/react-router";
import { Instagram, Phone } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Western Rathi"
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12 rounded-xl object-cover ring-1 ring-border"
            />
            <div>
              <p className="font-display text-lg font-semibold text-primary">Western Rathi</p>
              <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Since day one, made with love
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Thoughtfully curated western, casual and ethnic wear for girls aged 0–12, and handpicked
            designer sarees for women. Every order is confirmed personally over WhatsApp.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="transition-colors hover:text-primary">
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/category/$slug"
                params={{ slug: "designer-sarees" }}
                className="transition-colors hover:text-primary"
              >
                Designer Sarees
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-primary">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/terms" className="transition-colors hover:text-primary">
                Terms &amp; Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
            Order &amp; Support
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={whatsappLink("Hi Western Rathi! I have a question.")}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" /> {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Instagram className="h-4 w-4" /> @westernrathi
              </a>
            </li>
            <li className="pt-1 text-xs">Orders are confirmed on WhatsApp — no COD.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Western Rathi. All rights reserved.
      </div>
    </footer>
  );
}
