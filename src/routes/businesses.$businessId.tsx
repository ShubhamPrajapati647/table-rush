import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { listVenueTables, openVenueTable } from "@/lib/scan.functions";
import { Clock, Loader2, MapPin, Phone, Store } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { BusinessLogo, OpenBadge, TypeBadge } from "@/components/site/BusinessCard";
import { PublicPage, Section } from "@/components/site/PublicPage";
import { Button } from "@/components/ui/button";
import { VenueReviews } from "@/components/reviews/Reviews";
import { categoryLabel, hoursLabel, placeLabel, useBusiness } from "@/lib/discovery";

export const Route = createFileRoute("/businesses/$businessId")({
  head: () => ({
    meta: [
      { title: "Venue details — Table Rush" },
      {
        name: "description",
        content: "Venue details, opening hours and menu entry point on Table Rush.",
      },
      { property: "og:title", content: "Venue details — Table Rush" },
      {
        property: "og:description",
        content: "See a venue's hours, location and menu, then order from your table.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BusinessDetail,
});

function BusinessDetail() {
  const { businessId } = Route.useParams();
  const { data: business, isLoading, isError } = useBusiness(businessId);

  if (isLoading) {
    return (
      <PublicPage>
        <Section>
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        </Section>
      </PublicPage>
    );
  }

  if (isError || !business) {
    return (
      <PublicPage>
        <Section>
          <EmptyState
            icon={Store}
            title={isError ? "We couldn't load this venue" : "Venue not found"}
            description={
              isError
                ? "Something went wrong while loading this page. Please refresh and try again."
                : "This venue is not available right now. Browse the full list instead."
            }
            action={
              <Button asChild>
                <Link to="/businesses">Browse venues</Link>
              </Button>
            }
          />
        </Section>
      </PublicPage>
    );
  }

  const place = placeLabel(business);
  const categories = categoryLabel(business);
  const hours = hoursLabel(business);
  const address = [business.address, business.city, business.state, business.pincode]
    .filter(Boolean)
    .join(", ");

  return (
    <PublicPage>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 lg:flex-row lg:items-center lg:px-8 lg:py-16">
          <BusinessLogo business={business} className="size-20" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge business={business} />
              <OpenBadge business={business} />
            </div>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{business.business_name}</h1>
            {place ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {place}
              </p>
            ) : null}
            {categories ? <p className="mt-1 text-sm text-muted-foreground">{categories}</p> : null}
          </div>
        </div>
      </section>

      <Section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {business.description ? (
            <div className="surface-card p-6">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {business.description}
              </p>
            </div>
          ) : null}

          <TablePicker businessId={business.id} />
        </div>

        <aside className="space-y-6">
          <div className="surface-card p-6 text-sm">
            <h2 className="text-lg font-semibold">Details</h2>
            <dl className="mt-4 space-y-4 text-muted-foreground">
              {address ? (
                <div>
                  <dt className="font-medium text-foreground">Address</dt>
                  <dd className="mt-1">{address}</dd>
                </div>
              ) : null}
              {hours ? (
                <div>
                  <dt className="flex items-center gap-2 font-medium text-foreground">
                    <Clock className="size-4" /> Opening hours
                  </dt>
                  <dd className="mt-1">{hours}</dd>
                </div>
              ) : null}
              {business.phone ? (
                <div>
                  <dt className="flex items-center gap-2 font-medium text-foreground">
                    <Phone className="size-4" /> Phone
                  </dt>
                  <dd className="mt-1">{business.phone}</dd>
                </div>
              ) : null}
              {categories ? (
                <div>
                  <dt className="font-medium text-foreground">
                    {business.business_type === "restaurant" ? "Cuisine" : "Café type"}
                  </dt>
                  <dd className="mt-1">{categories}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link to="/businesses">Back to all venues</Link>
          </Button>
        </aside>
      </Section>
      <Section className="pt-0">
        <VenueReviews businessId={business.id} />
      </Section>
    </PublicPage>
  );
}

function TablePicker({ businessId }: { businessId: string }) {
  const navigate = useNavigate();
  const [tableId, setTableId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tables = useQuery({
    queryKey: ["venue-tables", businessId],
    queryFn: () => listVenueTables({ data: { business_id: businessId } }),
  });

  async function open() {
    if (!tableId) return;
    setBusy(true);
    setError(null);
    try {
      const { token } = await openVenueTable({ data: { business_id: businessId, table_id: tableId } });
      void navigate({ to: "/order/$token", params: { token } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't open this table.");
      setBusy(false);
    }
  }

  const list = tables.data ?? [];
  return (
    <div className="surface-card p-6">
      <h2 className="text-lg font-semibold">Menu & ordering</h2>
      {tables.isLoading ? (
        <Loader2 className="mt-4 size-5 animate-spin text-muted-foreground" />
      ) : list.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          This venue hasn't set up its tables yet, so ordering isn't open here.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose your table number to see the menu and order. Or scan the QR code on your table.
          </p>
          <label htmlFor="table-pick" className="mt-4 block text-sm font-medium">
            Your table
          </label>
          <select
            id="table-pick"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">Select table</option>
            {list.map((t) => (
              <option key={t.id} value={t.id}>
                Table {t.table_number} · seats {t.capacity}
              </option>
            ))}
          </select>
          {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
          <Button className="mt-4 w-full sm:w-auto" disabled={!tableId || busy} onClick={open}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null} View menu & order
          </Button>
        </>
      )}
    </div>
  );
}
