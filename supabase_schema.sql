-- Create Categories Table
CREATE TABLE public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    emoji TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Venues Table
CREATE TABLE public.venues (
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
CREATE TABLE public.products (
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

-- Create Policies (Allow Public Read, Authenticated Write)
-- Categories
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR
SELECT USING (true);

CREATE POLICY "Users can insert categories" ON public.categories FOR
INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

CREATE POLICY "Users can update categories" ON public.categories FOR
UPDATE USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Users can delete categories" ON public.categories FOR DELETE USING (
    auth.role () = 'authenticated'
);

-- Venues
CREATE POLICY "Public venues are viewable by everyone" ON public.venues FOR
SELECT USING (true);

CREATE POLICY "Users can insert venues" ON public.venues FOR
INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

CREATE POLICY "Users can update venues" ON public.venues FOR
UPDATE USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Users can delete venues" ON public.venues FOR DELETE USING (
    auth.role () = 'authenticated'
);

-- Products
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR
SELECT USING (true);

CREATE POLICY "Users can insert products" ON public.products FOR
INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

CREATE POLICY "Users can update products" ON public.products FOR
UPDATE USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Users can delete products" ON public.products FOR DELETE USING (
    auth.role () = 'authenticated'
);