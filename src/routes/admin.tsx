import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Western Rathi" },
      { name: "description", content: "Western Rathi admin dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const [state, setState] = useState<"loading" | "out" | "in" | "denied">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const check = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return setState("out");
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: data.session.user.id,
      _role: "admin",
    });
    setState(isAdmin ? "in" : "denied");
  };

  useEffect(() => {
    void check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) return setError(err.message);
    setState("loading");
    void check();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState("out");
  };

  if (state === "loading") {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (state !== "in") {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--gradient-blush)] px-4">
        <form
          onSubmit={signIn}
          className="w-full max-w-sm rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-lift)]"
        >
          <h1 className="font-display text-2xl font-bold text-primary">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Western Rathi dashboard</p>
          {state === "denied" && (
            <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
              This account does not have admin access.
            </p>
          )}
          <label className="mt-5 block text-xs font-semibold text-muted-foreground uppercase">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="mt-4 block text-xs font-semibold text-muted-foreground uppercase">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground underline">
            Back to store
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-3 sm:px-5">
          <span className="font-display text-lg font-bold text-primary">Western Rathi Admin</span>
          <nav className="ml-auto flex items-center gap-1">
            <Link
              to="/admin"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium hover:bg-secondary"
            >
              Products
            </Link>
            <Link
              to="/admin/orders"
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium hover:bg-secondary"
            >
              Orders
            </Link>
            <Link to="/" className="rounded-full px-3.5 py-2 text-sm font-medium hover:bg-secondary">
              Store
            </Link>
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
