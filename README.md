# Synch

**Find teammates. Share resources. Build together.**

Synch is a platform for students to discover collaborators based on skills, share study resources, and (soon) manage projects as a team — all in one place.

Built by two engineering students as a learning project and a real tool for our own hackathons and coursework.

---

## What Synch Does

- 📚 **Resource Library** — browse and download student-uploaded notes and study materials
- 🙋 **Student Profiles** — showcase your skills, college, and contact links
- 🔍 **Skill Search** — find teammates by searching for a specific skill (e.g. "React", "Design")
- 🗂️ **Project Boards** *(coming soon)* — create a project, invite teammates with a join code, and track tasks together

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React (via Vite) |
| Styling | Tailwind CSS |
| Backend / Database | Supabase (Postgres + Auth + Storage) |
| Hosting | Vercel *(planned — Phase 6)* |

---

## Getting Started

```bash
# install dependencies
npm install

# start local dev server
npm run dev
```

The app will be running at `http://localhost:5173` with hot reload — changes save instantly.

### Environment Setup

Create a `.env` file in the root with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are read via `import.meta.env` and used in `src/supabaseClient.js` to connect to the database. Without them, the app will run but every database call will fail.

---

## Project Structure

```
src/
├── pages/       # one file per screen (Home, Login, Profile, Search, etc.)
├── components/  # small reusable pieces (Navbar, ResourceCard, etc.)
└── context/      # app-wide shared state (AuthContext)
```

---

## Build Progress

### ✅ Phase 1 — Project Foundation
Vite + React setup, Tailwind styling, Supabase client connection, folder structure.

### ✅ Phase 2 — Authentication
Signup/Login, `AuthContext` for tracking the logged-in user app-wide, `profiles` table, protected routes, and a dynamic Navbar.

### ✅ Phase 3 — Resource Library
Upload and browse study resources. Files go to Supabase Storage; new uploads start as `pending` and only appear publicly once approved.

### ✅ Phase 4 — Student Profiles & Skill Search
Editable profiles with avatars, public profile pages, and skill-based search to find teammates.

### 🔜 Phase 5 — Projects & Tasks
Create a project, get a join code, invite teammates, and manage a shared To Do / In Progress / Done task board.

### 🔜 Phase 6 — Deployment
Push to GitHub, connect to Vercel, and go live at a real public URL with environment variables configured for production.

---

## How Key Pieces Work (Quick Reference)

- **Auth**: `AuthContext.jsx` listens to Supabase's `onAuthStateChange` — the whole app updates instantly the moment someone logs in or out.
- **Permissions**: Row Level Security (RLS) policies in Supabase control who can read/write each table — e.g. you can only edit your own profile (`auth.uid() = id`).
- **File uploads**: Large files (resources, avatars) live in Supabase Storage buckets; the database only stores a link (`file_url` / `avatar_url`) pointing to them.
- **Search**: Skill search filters profiles client-side for partial skill matches; the resource library search uses Supabase's `.ilike()` for case-insensitive matching.

---

## Contributors

Built by two engineering students, learning as we go — feedback, issues, and PRs welcome.
Name-Piyush Satpathy
Email-piyushsatpathy86@gmail.com
Github-piyushsatpathy86-hash
Name-Samikshya Bal
Email-Samikshyabal991@gmail.com
Github-Samikshyabal<img width="438" height="256" alt="Screenshot 2026-07-09 123039" src="https://github.com/user-attachments/assets/9477dca1-58f9-4cff-b868-f1ce6b027029" />
<img width="438" height="256" alt="Screenshot 2026-07-09 123039" src="https://github.com/user-attachments/assets/922d4ee4-5d07-4cab-9d75-bc40f9d18135" />

