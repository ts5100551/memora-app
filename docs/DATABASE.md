# Memora — Database Schema & Setup Guide

> Supabase PostgreSQL database design and manual setup instructions.

## Prerequisites

- A [Supabase](https://supabase.com) account (free tier is sufficient)
- A Supabase project created with region `Northeast Asia (Tokyo)` recommended

## Step 1: Create a Supabase Project

Create a single project (`memora`) used across local dev, Vercel Preview, and
Vercel Production — this is a personal single-user project, so no
staging/production data split is needed.

1. Go to [supabase.com](https://supabase.com) and sign in (GitHub login available)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `memora`
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: `Northeast Asia (Tokyo)` (or closest to you)
4. Click **"Create new project"** and wait for provisioning (~2 minutes)
5. Once ready, go to **Settings → API** (or **Settings → API Keys**) and note down:
   - `Project URL` (e.g., `https://xxxx.supabase.co`)
   - Publishable key or `anon` key

## Step 2: Create Database Tables

Go to **SQL Editor** in Supabase Dashboard and run the following SQL:

```sql
-- ============================================
-- Memora Database Schema
-- ============================================

-- 1. Users profile table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'system'
    CHECK (theme_preference IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Links table (core data)
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  source TEXT DEFAULT 'web',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, url)
);

-- 3. Tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366F1',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, name)
);

-- 4. Link-Tags junction table (many-to-many)
CREATE TABLE public.link_tags (
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (link_id, tag_id)
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_created_at ON public.links(created_at DESC);
CREATE INDEX idx_links_is_read ON public.links(user_id, is_read);
CREATE INDEX idx_tags_user_id ON public.tags(user_id);

-- ============================================
-- Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

## Step 3: Set Up Row Level Security (RLS)

```sql
-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Users policies
-- ============================================
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- Links policies
-- ============================================
CREATE POLICY "Users can view own links"
  ON public.links FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own links"
  ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
  ON public.links FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
  ON public.links FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Tags policies
-- ============================================
CREATE POLICY "Users can view own tags"
  ON public.tags FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags"
  ON public.tags FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
  ON public.tags FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
  ON public.tags FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Link_tags policies
-- ============================================
CREATE POLICY "Users can view own link_tags"
  ON public.link_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = link_tags.link_id AND links.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own link_tags"
  ON public.link_tags FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.links
      WHERE links.id = link_tags.link_id AND links.user_id = auth.uid())
    AND
    EXISTS (SELECT 1 FROM public.tags
      WHERE tags.id = link_tags.tag_id AND tags.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own link_tags"
  ON public.link_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = link_tags.link_id AND links.user_id = auth.uid()
  ));
```

## Step 4: Create User Profile Trigger

This trigger automatically creates a user profile when a new user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      ''
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'avatar_url',
      NEW.raw_user_meta_data ->> 'picture',
      ''
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Step 5: Set Up Google Auth Provider

### 5.1 Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or use an existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add **Authorized redirect URIs**:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
7. Note down the **Client ID** and **Client Secret**

### 5.2 Supabase Dashboard

1. Go to **Authentication → Providers**
2. Find **Google** and toggle it on
3. Paste the **Client ID** and **Client Secret**
4. Save

## ER Diagram

```
┌──────────────┐       ┌──────────────────────────────┐
│  auth.users  │       │        public.users           │
│──────────────│       │──────────────────────────────│
│ id (PK)      │◀──────│ id (PK, FK)                  │
│ email        │       │ email                        │
│ ...          │       │ display_name                 │
└──────────────┘       │ avatar_url                   │
                       │ theme_preference             │
                       │ created_at                   │
                       └──────────┬───────────────────┘
                                  │ 1
                    ┌─────────────┼─────────────┐
                    │ *                         │ *
              ┌─────▼──────┐             ┌─────▼──────┐
              │   links    │             │    tags    │
              │────────────│             │────────────│
              │ id (PK)    │             │ id (PK)    │
              │ user_id    │             │ user_id    │
              │ url        │             │ name       │
              │ title      │             │ color      │
              │ description│             │ created_at │
              │ source     │             └─────┬──────┘
              │ is_read    │                   │ 1
              │ ...        │                   │
              └─────┬──────┘                   │
                    │ 1        ┌────────────┐  │
                    └─────────▶│ link_tags  │◀─┘
                           *   │────────────│  *
                               │ link_id    │
                               │ tag_id     │
                               └────────────┘
```
