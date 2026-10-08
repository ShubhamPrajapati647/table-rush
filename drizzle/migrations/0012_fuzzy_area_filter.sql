CREATE OR REPLACE FUNCTION public.search_directory(_term text DEFAULT NULL::text, _type text DEFAULT NULL::text, _area text DEFAULT NULL::text, _cuisine text DEFAULT NULL::text, _open_now boolean DEFAULT false, _table_rush boolean DEFAULT false, _sort text DEFAULT 'name'::text, _lat double precision DEFAULT NULL::double precision, _lng double precision DEFAULT NULL::double precision, _limit integer DEFAULT 12, _offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, business_type business_type, business_name text, description text, address text, area text, city text, state text, pincode text, latitude double precision, longitude double precision, cuisine text, cafe_type text, business_category text, logo_url text, cover_image_url text, opening_time time without time zone, closing_time time without time zone, website_url text, phone text, source business_source, source_url text, verified boolean, table_rush_registered boolean, created_at timestamp with time zone, distance_km double precision, total_count bigint)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  WITH now_ist AS (SELECT (now() AT TIME ZONE 'Asia/Kolkata')::time AS t),
  filtered AS (
    SELECT d.*,
      CASE WHEN _lat IS NULL OR _lng IS NULL OR d.latitude IS NULL OR d.longitude IS NULL THEN NULL
        ELSE 6371 * 2 * asin(sqrt(power(sin(radians(d.latitude - _lat) / 2), 2) +
          cos(radians(_lat)) * cos(radians(d.latitude)) * power(sin(radians(d.longitude - _lng) / 2), 2)))
      END AS distance_km
    FROM public.public_directory d, now_ist n
    WHERE (_type IS NULL OR _type = '' OR d.business_type::text = _type)
      AND (_area IS NULL OR _area = ''
           OR coalesce(d.area, '') ILIKE '%' || _area || '%'
           OR coalesce(d.address, '') ILIKE '%' || _area || '%'
           OR coalesce(d.city, '') ILIKE '%' || _area || '%')
      AND (_cuisine IS NULL OR _cuisine = ''
           OR coalesce(d.cuisine, '') ILIKE '%' || _cuisine || '%'
           OR coalesce(d.cafe_type, '') ILIKE '%' || _cuisine || '%'
           OR coalesce(d.business_category, '') ILIKE '%' || _cuisine || '%')
      AND (NOT _table_rush OR d.table_rush_registered)
      AND (_term IS NULL OR _term = '' OR (
            d.business_name ILIKE '%' || _term || '%'
            OR coalesce(d.area, '') ILIKE '%' || _term || '%'
            OR coalesce(d.city, '') ILIKE '%' || _term || '%'
            OR coalesce(d.address, '') ILIKE '%' || _term || '%'
            OR coalesce(d.cuisine, '') ILIKE '%' || _term || '%'
            OR coalesce(d.cafe_type, '') ILIKE '%' || _term || '%'
            OR coalesce(d.business_category, '') ILIKE '%' || _term || '%'))
      AND (NOT _open_now OR (d.opening_time IS NOT NULL AND d.closing_time IS NOT NULL AND (
            CASE WHEN d.closing_time > d.opening_time THEN n.t >= d.opening_time AND n.t < d.closing_time
              ELSE n.t >= d.opening_time OR n.t < d.closing_time END)))
  )
  SELECT f.id, f.business_type, f.business_name, f.description, f.address, f.area, f.city, f.state, f.pincode,
         f.latitude, f.longitude, f.cuisine, f.cafe_type, f.business_category, f.logo_url, f.cover_image_url,
         f.opening_time, f.closing_time, f.website_url, f.phone, f.source, f.source_url, f.verified,
         f.table_rush_registered, f.created_at, f.distance_km, count(*) OVER () AS total_count
  FROM filtered f
  ORDER BY CASE WHEN _sort = 'distance' THEN f.distance_km END ASC NULLS LAST,
    CASE WHEN _sort = 'recent' THEN f.created_at END DESC, f.business_name ASC
  LIMIT greatest(1, least(coalesce(_limit, 12), 48)) OFFSET greatest(0, coalesce(_offset, 0));
$function$;