-- Create Drivers Table
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    license_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
-- Temporarily allow all access for testing
DROP POLICY IF EXISTS "Admins can manage drivers" ON public.drivers;
CREATE POLICY "Allow admin access to drivers" ON public.drivers FOR ALL
    USING (true)
    WITH CHECK (true);