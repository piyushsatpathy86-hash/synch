# Synch — Setup (Phase 1 + Phase 2 done)

## 1. Install & run locally

```bash
npm install
cp .env.example .env
# ab .env open karke apni real Supabase URL/anon key daal
npm run dev
```
Browser mein `http://localhost:5173` khol.

## 2. Supabase setup

1. supabase.com → New project (region: Singapore, India ke closest)
2. Project Settings → API → copy **Project URL** aur **anon public key** → `.env` mein daal
3. Authentication → Providers → Email → Enable
4. Authentication → URL Configuration → Site URL mein `http://localhost:5173` daal
5. Table Editor → SQL Editor → neeche wala poora SQL paste karke Run kar:

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  college text,
  skills text[],
  instagram text,
  email_contact text,
  github text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read all profiles"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);
```

## 3. Test karo

1. `npm run dev`
2. `/signup` pe jaa, email + password se signup kar
3. Email confirm kar (Supabase apne aap bhejta hai)
4. `/login` se login kar
5. Navbar mein "Profile" aur "Logout" dikhna chahiye
6. Supabase dashboard → Table Editor → `profiles` → tera row dikhna chahiye

Agar ye sab chal gaya — **Phase 1 + Phase 2 done.**

## Next (Phase 3)

Resource library — `resources` table, Storage bucket, Home page, Upload page.
Bolna jab ready ho, wo code bhi bana dunga.
