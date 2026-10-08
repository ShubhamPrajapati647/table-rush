import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

function Stars({ value, onChange, size = "size-5" }: { value: number; onChange?: (v: number) => void; size?: string }) {
  return (
    <div className="flex gap-1" role={onChange ? "radiogroup" : undefined} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = <Star className={`${size} ${n <= value ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />;
        return onChange ? (
          <button key={n} type="button" aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => onChange(n)}>
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </div>
  );
}

export function VenueReviews({ businessId }: { businessId: string }) {
  const { user } = useAuth();
  const canReply = useQuery({
    queryKey: ["can-manage-business", businessId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("can_manage_business", { _business_id: businessId });
      if (error) throw error;
      return data === true;
    },
  });
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, reviewer_name, rating, comment, created_at, owner_reply, owner_reply_at")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });
  const count = data?.length ?? 0;
  const avg = count ? (data!.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : null;

  return (
    <div className="surface-card space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Reviews & ratings</h2>
        {avg ? (
          <div className="flex items-center gap-2 text-sm">
            <Stars value={Math.round(Number(avg))} size="size-4" />
            <span className="font-semibold">{avg}</span>
            <span className="text-muted-foreground">({count})</span>
          </div>
        ) : null}
      </div>
      {isLoading ? (
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      ) : count === 0 ? (
        <p className="text-sm text-muted-foreground">
          No reviews yet. Customers can rate this venue after their order is served.
        </p>
      ) : (
        <ul className="space-y-4">
          {data!.map((r) => (
            <li key={r.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{r.reviewer_name}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <Stars value={r.rating} size="size-4" />
              {r.comment ? <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p> : null}
              {r.owner_reply ? (
                <div className="mt-3 rounded-xl border-l-2 border-primary bg-muted/40 px-4 py-3">
                  <p className="text-xs font-semibold tracking-wide uppercase">Reply from the venue</p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.owner_reply}</p>
                </div>
              ) : null}
              {canReply.data ? <ReplyForm reviewId={r.id} businessId={businessId} current={r.owner_reply} /> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function OrderReviewCard({
  orderId,
  businessId,
  status,
  customerName,
}: {
  orderId: string;
  businessId: string;
  status: string;
  customerName: string;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const eligible = !!user && (status === "served" || status === "completed");

  const existing = useQuery({
    queryKey: ["review-for-order", orderId],
    enabled: eligible,
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("rating, comment").eq("order_id", orderId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reviews").insert({
        order_id: orderId,
        business_id: businessId,
        customer_id: user!.id,
        reviewer_name: customerName.trim().split(/\s+/)[0] || "Customer",
        rating,
        comment: comment.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["review-for-order", orderId] });
      void qc.invalidateQueries({ queryKey: ["reviews", businessId] });
    },
  });

  if (!eligible) return null;

  if (existing.data) {
    return (
      <div className="surface-card space-y-2 p-5">
        <h2 className="font-display text-lg font-semibold">Your review</h2>
        <Stars value={existing.data.rating} />
        {existing.data.comment ? <p className="text-sm text-muted-foreground">{existing.data.comment}</p> : null}
      </div>
    );
  }

  return (
    <div className="surface-card space-y-3 p-5">
      <h2 className="font-display text-lg font-semibold">Rate your visit</h2>
      <Stars value={rating} onChange={setRating} size="size-7" />
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
        placeholder="Tell others about the food and service (optional)"
      />
      {submit.isError ? <p className="text-sm text-destructive">Couldn't save your review. Please try again.</p> : null}
      <Button disabled={rating === 0 || submit.isPending} onClick={() => submit.mutate()}>
        {submit.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        Submit review
      </Button>
    </div>
  );
}

function ReplyForm({ reviewId, businessId, current }: { reviewId: string; businessId: string; current: string | null }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(current ?? "");
  const save = useMutation({
    mutationFn: async (reply: string) => {
      const { error } = await supabase.rpc("reply_to_review", { _review_id: reviewId, _reply: reply });
      if (error) throw error;
    },
    onSuccess: () => {
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["reviews", businessId] });
    },
  });

  if (!open) {
    return (
      <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setText(current ?? ""); setOpen(true); }}>
        {current ? "Edit reply" : "Reply"}
      </Button>
    );
  }
  return (
    <div className="mt-3 space-y-2">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} placeholder="Write a public reply" />
      {save.isError ? <p className="text-sm text-destructive">Couldn't save your reply. Please try again.</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={!text.trim() || save.isPending} onClick={() => save.mutate(text)}>
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Post reply
        </Button>
        {current ? (
          <Button size="sm" variant="outline" disabled={save.isPending} onClick={() => save.mutate("")}>Remove reply</Button>
        ) : null}
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}
