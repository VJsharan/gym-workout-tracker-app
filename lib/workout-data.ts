export type DayKey = 1 | 2 | 3 | 4 | 5

export type HistoryEntry = {
  variation?: DayKey
  skipped?: boolean
  skipReason?: string
}

export type History = Record<string, HistoryEntry>

export const coreWorkouts: Record<DayKey, { name: string; detail?: string }[]> = {
  1: [
    'Dumbbell curls (machine)',
    'Tricep rope pulldown',
    'Dumbbell curls (manual)',
    'Tricep bar pushdown',
    'Bicep bar pull',
    'Tricep dips',
    'Hammer curls',
    'Barbell curls',
    'Preacher bicep curl',
    'Tricep overhead extension',
  ].map((name) => ({ name })),
  2: [
    'Squat',
    'Hamstring',
    'Leg extension',
    'Leg press',
    'Calf raises',
    'Machine squats',
    'Abductor',
    'Adductor',
  ].map((name) => ({ name })),
  3: [
    ['10 - X mins treadmill', '12.5 incline · 3.8 speed'],
    ['X mins running', '10 speed'],
    ['10 mins elliptical trainer', '12 level'],
    ['10 mins rowing machine'],
    ['10 mins moderate cycling'],
    ['Weighted ab crunches', '17 X 3 · 12.5kg top · 10kg bottom'],
    ['Russian twist with 4kg ball', '17 X 3'],
  ].map(([name, detail]) => ({ name, detail })),
  4: [
    'Flat chest press',
    'Slightly up (incline chest press)',
    'Even slightly up (higher incline chest press)',
    'Shoulder press',
    'Normal chest flies',
    'Reverse flies',
    'Tricep + chest looking down dips',
  ].map((name) => ({ name })),
  5: [
    'Wide Grip Lat Pulldown',
    'V-Bar Arm Pull',
    'Mid Grip Lat Pulldown',
    'Arm Grip Reverse Lat Pulldown',
    'Cable lat pushdown',
    'Assisted pull ups',
    'Lateral raise',
    'Shoulder shrugs',
    'Shoulder dumbbell raise',
  ].map((name) => ({ name })),
}

export const dayNames: Record<DayKey, string> = {
  1: 'Bi + Tri',
  2: 'Leg',
  3: 'Cardio',
  4: 'Chest',
  5: 'Lat',
}

export const dayColors: Record<DayKey, string> = {
  1: '#ef476f',
  2: '#ffc43d',
  3: '#2ec4b6',
  4: '#32a8ff',
  5: '#8b5cf6',
}

export const quotes = [
  'The work is the reward.',
  'Consistency is a form of self-respect.',
  'No noise. Just the next right move.',
]

export const getToday = () => {
  const d = new Date()
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() }
}

export const keyFor = (year: number, month: number, day: number) => `${year}-${month}-${day}`

export const formatDateKey = (key: string) => {
  const [y, m, d] = key.split('-')
  const date = new Date(Number(y), Number(m), Number(d))
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date).toUpperCase()
}

export const titleCase = (value: string) => value.replace(/\b\w/g, (letter) => letter.toUpperCase())

export const workoutDetail = (exercise: { name: string; detail?: string }, section: string) => {
  if (section !== 'CORE WORKOUT') return exercise.detail || 'Warm-up / mobility'
  const isCardio = coreWorkouts[3].some((item) => item.name === exercise.name)
  const isException = /weighted ab crunch|russian twist/i.test(exercise.name)
  if (isCardio && !isException) return exercise.detail || 'Cardio'
  if (exercise.detail?.includes('3x17')) return exercise.detail.replace('3x17', '17 X 3')
  if (exercise.detail?.includes('17 X 3')) return exercise.detail
  return exercise.detail ? `15 X 3 · ${exercise.detail}` : '15 X 3'
}

export function previousMonth(year: number, month: number) {
  const date = new Date(year, month - 1, 1)
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function nextMonth(year: number, month: number) {
  const date = new Date(year, month + 1, 1)
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function workoutForDate(
  year: number,
  month: number,
  day: number,
  anchor: DayKey,
  baseToday = getToday()
) {
  const target = new Date(year, month, day)
  const base = new Date(baseToday.year, baseToday.month, baseToday.day)
  const dayOffset = Math.round((target.getTime() - base.getTime()) / 86400000)
  return ((((anchor - 1 + dayOffset) % 5) + 5) % 5 + 1) as DayKey
}

export const HARDCODED_SKIPPED_DAYS: History = {
  // May 2026 (Month 4)
  '2026-4-6': { skipped: true, skipReason: 'Missed workout' },
  '2026-4-12': { skipped: true, skipReason: 'Missed workout' },
  '2026-4-18': { skipped: true, skipReason: 'Missed workout' },
  '2026-4-24': { skipped: true, skipReason: 'Missed workout' },
  '2026-4-29': { skipped: true, skipReason: 'Missed workout' },
  // June 2026 (Month 5)
  '2026-5-4': { skipped: true, skipReason: 'Missed workout' },
  '2026-5-10': { skipped: true, skipReason: 'Missed workout' },
  '2026-5-15': { skipped: true, skipReason: 'Missed workout' },
  '2026-5-20': { skipped: true, skipReason: 'Missed workout' },
  '2026-5-25': { skipped: true, skipReason: 'Missed workout' },
  '2026-5-28': { skipped: true, skipReason: 'Missed workout' },
  // July 2026 (Month 6)
  '2026-6-3': { skipped: true, skipReason: 'Missed workout' },
  '2026-6-9': { skipped: true, skipReason: 'Missed workout' },
  '2026-6-16': { skipped: true, skipReason: 'Missed workout' },
  '2026-6-23': { skipped: true, skipReason: 'Missed workout' },
  '2026-6-29': { skipped: true, skipReason: 'Missed workout' },
  // August 2026 (Month 7)
  '2026-7-5': { skipped: true, skipReason: 'Missed workout' },
  '2026-7-11': { skipped: true, skipReason: 'Missed workout' },
  '2026-7-18': { skipped: true, skipReason: 'Missed workout' },
  '2026-7-22': { skipped: true, skipReason: 'Missed workout' },
  '2026-7-28': { skipped: true, skipReason: 'Missed workout' },
  // September 2026 (Month 8 - 4 existing skips)
  '2026-8-1': { skipped: true, skipReason: 'didnt feel like going' },
  '2026-8-3': { skipped: true, skipReason: 'Rest day / missed' },
  '2026-8-8': { skipped: true, skipReason: 'Busy with work' },
  '2026-8-15': { skipped: true, skipReason: 'i didnt feel like going' },
}

export const HARDCODED_SKIP_COUNT = Object.keys(HARDCODED_SKIPPED_DAYS).length // 25 days
export const HARDCODED_PENALTY_AMOUNT = HARDCODED_SKIP_COUNT * 25.2 // ₹630.00

