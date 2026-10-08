CREATE OR REPLACE FUNCTION public.guard_business_insert()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.table_rush_registered := false;
    RETURN NEW;
  END IF;
  NEW.table_rush_registered := true;
  IF public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;
  -- New registrations go live immediately; admins can suspend later.
  NEW.status := 'active'::public.business_status;
  IF NEW.business_type = 'restaurant'::public.business_type
     AND NOT public.has_role(NEW.owner_id, 'restaurant_owner'::public.app_role) THEN
    RAISE EXCEPTION 'Only restaurant owners can create a restaurant';
  END IF;
  IF NEW.business_type = 'cafe'::public.business_type
     AND NOT public.has_role(NEW.owner_id, 'cafe_owner'::public.app_role) THEN
    RAISE EXCEPTION 'Only cafe owners can create a cafe';
  END IF;
  RETURN NEW;
END;
$function$;