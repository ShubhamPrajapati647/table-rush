import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { homePathForRoles } from "@/lib/roles";
import logo from "@/assets/logo-horizontal.png";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Orders", to: "/customer/orders" },
  { label: "Restaurants & Cafés", to: "/businesses" },
  { label: "Game Support", to: "/game" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, roles, signOut } = useAuth();
  const workspace = homePathForRoles(roles);
  const isBusiness = workspace !== "/customer/orders";
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-ink/95 text-ink-foreground backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="TableRush home">
          <img src={logo} alt="TableRush — Fine Food, Fine Moments" className="h-13 w-auto max-w-[190px] object-contain sm:h-14 sm:max-w-[220px]" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="border-b border-transparent py-2 text-sm font-medium text-ink-foreground/75 transition-colors hover:text-gold"
              activeProps={{ className: "border-gold text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Button asChild variant="onDark" size="sm">
                <Link to={isBusiness ? workspace : "/profile"}>{isBusiness ? "Dashboard" : "Profile"}</Link>
              </Button>
              <Button size="sm" onClick={handleSignOut}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="onDark" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="gold" size="sm">
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          type="button"
          aria-label="Toggle menu"
          variant="onDark"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-gold/20 bg-ink lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-ink-foreground/80 hover:text-gold"
                activeProps={{ className: "text-gold" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2 border-t border-gold/20 pt-3">
              {user ? (
                <>
                  <Button asChild variant="onDark" className="flex-1">
                    <Link to={isBusiness ? workspace : "/profile"} onClick={() => setOpen(false)}>
                      {isBusiness ? "Dashboard" : "Profile"}
                    </Link>
                  </Button>
                  <Button className="flex-1" onClick={handleSignOut}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="onDark" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
