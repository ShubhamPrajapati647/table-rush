import { SiteHeader } from "@/components/site/SiteHeader";
import type { ReactNode } from "react";

export function AuthShell({
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
      <SiteHeader />

      <main className="flex flex-1 items-start justify-center px-4 pt-4 pb-16">
        <div className="w-full max-w-md">
          <div className="surface-card p-7">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-6">{children}</div>
          </div>
          {footer ? <div className="mt-5 text-center text-sm">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
