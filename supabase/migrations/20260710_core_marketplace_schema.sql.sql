-- ==========================================
-- 1. CLEAN UP EXSTING SCHEMA IF APPLICABLE
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==========================================
-- 2. TABLE 1: PROFILES (Tied to Supabase Auth)
-- ==========================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT
);

-- ==========================================
-- 3. TABLE 2: USER_ROLES (Role-Based Access Control)
-- ==========================================
CREATE TABLE public.user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  UNIQUE(user_id, role)
);

-- ==========================================
-- 4. TABLE 3: LISTINGS (Marketplace Items)
-- ==========================================
CREATE TABLE public.listings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. TABLE 4: COMMENTS (For Required 4-Table Minimum)
-- ==========================================
CREATE TABLE public.comments (
  id BIGSERIAL PRIMARY KEY,
  listing_id BIGINT REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CREATE INDEXES FOR BEST PRACTICE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_slug);
CREATE INDEX IF NOT EXISTS idx_comments_listing ON public.comments(listing_id);

-- ==========================================
-- 6. AUTOMATED SYSTEM TRIGGER FOR NEW REGISTERED USERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into Profiles
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id, 
    split_part(new.email, '@', 1), 
    split_part(new.email, '@', 1),
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  );

  -- Assign standard default buyer/seller role profile row
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 7. DISABLE RLS TEMPORARILY TO PERMIT ACCESS FEED READS
-- ==========================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- 8. PRE-LOAD LIVE MOCK MARKETPLACE PRODUCTS
-- ==========================================
INSERT INTO public.listings (title, description, price, image_url, category_slug) VALUES 
('Premium Noise-Canceling Headphones', 'Studio-quality wireless headphones with active noise cancellation, 40-hour battery life, and plush memory foam earcups.', 249.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'electronics'),
('Vintage Minimalist Denim Jacket', 'Authentic oversized blue denim jacket. Light wash, heavy-duty stitching, 100% premium cotton fabric. Unisex size L.', 65.00, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600', 'fashion'),
('The Art of Clean Code - Hardcover Edition', 'An absolute must-read guide for software engineers. Covers architectural patterns, refactoring strategies, and best industry practices.', 34.99, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', 'books');