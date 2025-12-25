-- Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    emoji TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Venues Table
CREATE TABLE IF NOT EXISTS public.venues (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id),
    name TEXT NOT NULL,
    rating NUMERIC DEFAULT 0,
    delivery_time TEXT,
    image TEXT,
    price_range TEXT,
    categories TEXT[], -- Array of strings for filter tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES public.venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete categories" ON public.categories;

DROP POLICY IF EXISTS "Public venues are viewable by everyone" ON public.venues;
DROP POLICY IF EXISTS "Users can insert venues" ON public.venues;
DROP POLICY IF EXISTS "Users can update venues" ON public.venues;
DROP POLICY IF EXISTS "Users can delete venues" ON public.venues;

DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Users can insert products" ON public.products;
DROP POLICY IF EXISTS "Users can update products" ON public.products;
DROP POLICY IF EXISTS "Users can delete products" ON public.products;

-- Create new policies
-- Categories
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL
    USING ((SELECT public.is_user_in_role(auth.uid(), 'admin')))
    WITH CHECK ((SELECT public.is_user_in_role(auth.uid(), 'admin')));

-- Venues
CREATE POLICY "Public venues are viewable by everyone" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Admins can manage venues" ON public.venues FOR ALL
    USING ((SELECT public.is_user_in_role(auth.uid(), 'admin')))
    WITH CHECK ((SELECT public.is_user_in_role(auth.uid(), 'admin')));

-- Products
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL
    USING ((SELECT public.is_user_in_role(auth.uid(), 'admin')))
    WITH CHECK ((SELECT public.is_user_in_role(auth.uid(), 'admin')));