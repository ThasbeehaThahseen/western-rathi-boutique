CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  comment text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5)
);
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY reviews_public_read ON public.reviews FOR SELECT TO anon, authenticated USING (featured = true);
CREATE POLICY reviews_public_insert ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (featured = false);
CREATE POLICY reviews_admin_all ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

WITH map(old_label, new_label) AS (
  VALUES
    ('0-6M','18 in'), ('6-12M','20 in'), ('1-2Y','22 in'), ('2-3Y','24 in'),
    ('3-4Y','26 in'), ('4-5Y','28 in'), ('5-6Y','30 in'), ('6-7Y','30 in'),
    ('7-8Y','32 in'), ('8-9Y','32 in'), ('9-10Y','34 in'), ('10-11Y','34 in'),
    ('11-12Y','36 in')
)
UPDATE public.products p
SET sizes = (
  SELECT array_agg(DISTINCT m.new_label ORDER BY m.new_label)
  FROM unnest(p.sizes) AS s
  JOIN map AS m ON m.old_label = s
)
WHERE EXISTS (
  SELECT 1 FROM unnest(p.sizes) AS s JOIN map AS m ON m.old_label = s
);