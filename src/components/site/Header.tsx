import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/category/$slug", params: { slug: "girls-ethnic-wear" }, label: "Ethnic" },
  { to: "/category/$slug", params: { slug: "designer-sarees" }, label: "Sarees" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border border-border/60 px-3 py-2 transition-all duration-300 sm:px-4",
          scrolled
            ? "bg-card/90 shadow-[var(--shadow-lift)] backdrop-blur-xl"
            : "bg-card/70 shadow-[var(--shadow-soft)] backdrop-blur-md",
        )}
      >
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logo}
            alt="Western Rathi"
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-border sm:h-11 sm:w-11"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight font-semibold text-primary sm:text-lg">
              Western Rathi
            </span>
            <span className="block truncate text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              Kids &amp; Sarees
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              params={(item as any).params}
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary/70"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-0">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-xl bg-secondary/70 text-secondary-foreground transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/70 text-secondary-foreground transition-colors hover:bg-secondary md:hidden"
          >
            {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="pointer-events-auto mx-auto mt-2 max-w-6xl rounded-2xl border border-border/60 bg-card/95 p-2 shadow-[var(--shadow-lift)] backdrop-blur-xl md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              params={(item as any).params}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary/70"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
