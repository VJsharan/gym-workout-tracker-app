<div align="center">
  <h1>💪 Sharan's Gym Buddy</h1>
  <p><strong>Move well. Keep going.</strong></p>
  <p>A focused daily workout tracker for planning sessions, logging progress, and building a consistent five-day training rhythm.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase" alt="Supabase" />
  </p>
  <p>
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/shadcn/ui-components-000000?style=for-the-badge" alt="shadcn/ui" />
    <img src="https://img.shields.io/badge/PWA-ready-5a0fc8?style=for-the-badge" alt="PWA ready" />
  </p>
</div>

---

## 🎯 What is it?

**Sharan's Gym Buddy** is a personal workout companion built around a simple idea: make the next training session obvious and keep a clear record of showing up.

The app combines a five-day workout rotation with a visual calendar, interactive exercise checklists, local progress persistence, and Supabase-backed workout history. It is designed for quick use during a workout while still giving you a useful overview of your consistency over time.

## ⚡ Core Features

### 🏋️ Workout planning and tracking

- **Five-day workout rotation** covering Bi + Tri, Legs, Cardio, Chest, and Lats.
- **Queued next workout** so the next session is ready from the home screen.
- **Interactive exercise checklist** with per-exercise progress stages.
- **Workout variations** that can be selected or swapped for a date.
- **Mark-all-done action** for quickly logging completed historical sessions.

### 📅 Calendar and history

- **Monthly workout calendar** for reviewing past and upcoming dates.
- **Workout logging** for completed sessions.
- **Skip tracking** with a reason for missed sessions.
- **Edit or clear entries** directly from the calendar.
- **Completion and skip statistics** displayed on the overview screen.

### ⏱️ Workout utilities

- **Rest timer** with a full-screen countdown overlay.
- **Hydration reminders** during a session.
- **Session restoration** using URL parameters and local storage.
- **Responsive mobile-first layout** for use at the gym.
- **Reduced-motion support** for users who prefer fewer animations.

### 🎨 Product experience

- **Editorial neo-brutalist visual style** with bold typography, color-coded workout cards, and high-contrast controls.
- **Installable web-app foundation** through a web manifest and service-worker registration.
- **Vercel Analytics** in production builds.

## 🧩 Workout Rotation

| Day | Focus | Training type |
| --- | --- | --- |
| 1 | Bi + Tri | Arms and triceps |
| 2 | Leg | Lower body |
| 3 | Cardio | Conditioning and core |
| 4 | Chest | Chest and shoulders |
| 5 | Lat | Back and shoulders |

The workout definitions live in `lib/workout-data.ts`, making it straightforward to adjust exercise names, details, colors, and motivational quotes.

## 🛠️ Technology Stack

### Application

- **Next.js 16** with the App Router
- **React 19**
- **TypeScript 5.7**
- **Tailwind CSS 4** and `tw-animate-css`
- **shadcn/ui** and Base UI primitives
- **Lucide React** for icons

### Data and persistence

- **Supabase JavaScript client** for workout logs, skipped days, and queued workout state.
- **Browser localStorage** for exercise progress and restoring the active session.
- **URL search parameters** for shareable/restorable workout, calendar, and completion views.

### Deployment and web platform

- **Vercel Analytics** for production analytics.
- **Web App Manifest** for installable-app metadata.
- **Service worker registration** for progressive-web-app support.

## 📁 Repository Structure

```text
gym-workout-tracker-app/
├── app/
│   ├── globals.css             # Global styles and responsive design system
│   ├── layout.tsx              # Root layout, metadata, analytics, and PWA setup
│   └── page.tsx                # Main tracker state and application flow
│
├── components/
│   ├── modals/                 # Rest timer, hydration, and skip dialogs
│   ├── ui/                     # Reusable UI primitives
│   └── views/                  # Home, calendar, workout, and completion views
│
├── lib/
│   ├── supabase.ts             # Supabase client configuration
│   ├── utils.ts                # Shared class-name utility
│   └── workout-data.ts         # Workout rotation, dates, colors, and quotes
│
├── public/
│   ├── manifest.json           # Installable web-app metadata
│   └── ...                     # Icons and static assets
│
├── components.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [Supabase](https://supabase.com/) project
- npm, pnpm, yarn, or another Node.js package manager

### 1. Clone the repository

```bash
git clone https://github.com/VJsharan/gym-workout-tracker-app.git
cd gym-workout-tracker-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The application reads and writes the following Supabase tables:

- `workouts_log` — completed workout dates and workout types.
- `skipped_days` — skipped dates, reasons, and penalty values.
- `user_state` — the currently queued workout and last active date.

At minimum, configure the columns used by the app:

```text
workouts_log
├── date
└── workout_type

skipped_days
├── date
├── reason
└── financial_penalty

user_state
├── id
├── current_queued_workout
└── last_active_date
```

Use appropriate primary keys or unique constraints on `date` for `workouts_log` and `skipped_days`, since the app uses upserts by date. Configure Supabase Row Level Security policies according to your deployment and privacy requirements.

> The Supabase anonymous key is intended for client-side use, but never commit service-role keys or other private credentials.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

```bash
npm run dev       # Start the Next.js development server
npm run build     # Create a production build
npm run start     # Start the production server
```

## 🧭 How to Use

1. **Start from the home screen** and review the queued workout for today.
2. **Begin the session** or choose another workout day from the rotation.
3. **Tap exercises** as you progress through the routine.
4. **Use the rest timer** between sets and respond to hydration reminders.
5. **Finish the workout** to log it to Supabase and advance the queue.
6. **Open the calendar** to review history, change a routine, log a past workout, or record a skipped session.

## 🔐 Data and Privacy

- Workout history is stored in the configured Supabase project.
- In-progress exercise stages are cached in the browser's local storage.
- The active view, selected date, and workout variation can be restored from local storage and URL parameters.
- Review and customize your Supabase Row Level Security policies before deploying the app for multiple users.

## 🗺️ Roadmap Ideas

- [ ] Authentication and user-specific workout profiles.
- [ ] Custom workout creation and exercise editing.
- [ ] Set, weight, and repetition tracking.
- [ ] Streaks, weekly summaries, and progress charts.
- [ ] Supabase migrations and seed data for easier setup.
- [ ] Offline-first synchronization for gym sessions with unreliable connectivity.
- [ ] Push notifications for workouts and hydration reminders.

## 🤝 Contributing

Contributions and ideas are welcome. To propose a change:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes locally.
4. Open a pull request with a clear description of the improvement.

## 📄 License

No license file is currently included in the repository. Add a license before distributing or reusing the project publicly.

---

Built with 💪 by **VJsharan**.
