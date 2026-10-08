import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-horizontal.png";
import type { ReactNode } from "react";

/** Wide page frame for the venue registration forms. */
export function RegisterShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="TableRush" className="h-12 w-auto max-w-[175px] rounded-sm bg-ink px-2 object-contain" />
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to site
        </Link>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-2 pb-16 lg:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        <div className="mt-8">{children}</div>
        {footer ? <div className="mt-6 text-sm">{footer}</div> : null}
      </main>
    </div>
  );
}
