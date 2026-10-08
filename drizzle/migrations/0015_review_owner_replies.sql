ALTER TABLE public.reviews
  ADD COLUMN owner_reply text CHECK (owner_reply IS NULL OR char_length(owner_reply) <= 1000),
  ADD COLUMN owner_reply_at timestamptz;

CREATE OR REPLACE FUNCTION public.reply_to_review(_review_id uuid, _reply text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _biz uuid; _clean text := nullif(btrim(_reply), '');
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT business_id INTO _biz FROM public.reviews WHERE id = _review_id;
  IF _biz IS NULL THEN RAISE EXCEPTION 'Review not found'; END IF;
  IF NOT public.has_business_access(_biz, auth.uid()) THEN
    RAISE EXCEPTION 'You can only reply to reviews of your own venue';
  END IF;
  IF _clean IS NOT NULL AND char_length(_clean) > 1000 THEN RAISE EXCEPTION 'Reply is too long'; END IF;
  UPDATE public.reviews SET owner_reply = _clean, owner_reply_at = CASE WHEN _clean IS NULL THEN NULL ELSE now() END
  WHERE id = _review_id;
END $$;
REVOKE ALL ON FUNCTION public.reply_to_review(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reply_to_review(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.can_manage_business(_business_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT auth.uid() IS NOT NULL AND public.has_business_access(_business_id, auth.uid())
$$;
GRANT EXECUTE ON FUNCTION public.can_manage_business(uuid) TO authenticated;