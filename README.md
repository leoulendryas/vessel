# vessel — Full Build Specification

vessel is a personal gym tracker web app built with vanilla HTML, CSS, and JS. It uses Supabase as a backend (with a localStorage fallback).

## Features
- **Workout Tracker**: Track your daily workouts (Mon-Fri) with a built-in set tracker and rest timer.
- **Stats & Progress**: Visualize your progress with charts, PR tracking, and "most improved" analytics.
- **Offline First**: Works without a database using localStorage.
- **Modern UI**: Dark mode, electric lime accent, and a responsive layout.

## Setup Instructions

### 1. Supabase Setup (Optional)
If you want to sync your data across devices:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the following SQL to create the `logs` table:

```sql
CREATE TABLE logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id   TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  day_id        TEXT NOT NULL,
  weight        NUMERIC(6,2) NOT NULL,
  reps          INTEGER,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS — this is a personal app, you're the only user
ALTER TABLE logs DISABLE ROW LEVEL SECURITY;
```

4. Go to **Project Settings** -> **API**.
5. Copy your `Project URL` and `anon public` key.
6. Open `config.js` and paste them there.

### 2. Local Run
- Use VS Code with the **Live Server** extension.
- Right-click `index.html` and select **Open with Live Server**.
- Or use any static server: `npx serve .`

## File Structure
- `index.html`: Workout tracking page.
- `stats.html`: Progress and analytics page.
- `style.css`: Shared styling.
- `data.js`: The workout program data.
- `config.js`: Supabase credentials.
- `app.js`: Logic for the workout page.
- `stats.js`: Logic for the stats page.

## Note
The set tracker and rest timer are **session-only**. They reset when you refresh the page. Only the weight logs are saved permanently.
