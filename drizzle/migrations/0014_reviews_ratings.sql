CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  reviewer_name text NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text CHECK (comment IS NULL OR char_length(comment) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX reviews_business_idx ON public.reviews(business_id, created_at DESC);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Customers review own finished orders" ON public.reviews FOR INSERT TO authenticated
WITH CHECK (
  customer_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid()
    AND o.business_id = reviews.business_id AND o.order_status IN ('served','completed'))
);
CREATE POLICY "Authors or admin delete reviews" ON public.reviews FOR DELETE TO authenticated
USING (customer_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE OR REPLACE VIEW public.business_ratings WITH (security_invoker = on) AS
SELECT business_id, round(avg(rating)::numeric, 1) AS average_rating, count(*)::int AS review_count
FROM public.reviews GROUP BY business_id;
GRANT SELECT ON public.business_ratings TO anon, authenticated;