ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_session_id text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'INR';
CREATE INDEX IF NOT EXISTS payments_provider_order_id_idx ON public.payments (provider_order_id);