'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Timer } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  DayKey,
  HARDCODED_SKIPPED_DAYS,
  History,
  coreWorkouts,
  getToday,
  keyFor,
  quotes,
} from '@/lib/workout-data'

import { HomeView } from '@/components/views/HomeView'
import { CalendarView } from '@/components/views/CalendarView'
import { WorkoutView } from '@/components/views/WorkoutView'
import { CompletionView } from '@/components/views/CompletionView'

import { RestTimerModal } from '@/components/modals/RestTimerModal'
import { SkipPromptModal } from '@/components/modals/SkipPromptModal'
import { HydrationModal } from '@/components/modals/HydrationModal'

export default function Page() {
  const [today] = useState(getToday)
  const [returnView, setReturnView] = useState<'home' | 'calendar'>('home')
  const [view, setView] = useState<'home' | 'calendar' | 'workout' | 'completion'>('home')

  const [calendarDate, setCalendarDate] = useState(() => ({
    year: getToday().year,
    month: getToday().month,
  }))
  const [selectedDate, setSelectedDate] = useState(getToday)

  const [history, setHistory] = useState<History>(() => ({ ...HARDCODED_SKIPPED_DAYS }))
  const [queuedVariation, setQueuedVariation] = useState<DayKey>(1)
  const [selectedVariation, setSelectedVariation] = useState<DayKey>(1)
  const [workoutVariation, setWorkoutVariation] = useState<DayKey>(1)
  const [userStateId, setUserStateId] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  const [progress, setProgress] = useState<Record<number, number>>({})
  const [rest, setRest] = useState(0)
  const [hydration, setHydration] = useState(false)
  const [hydrationDue, setHydrationDue] = useState(false)

  const [skipPromptOpen, setSkipPromptOpen] = useState(false)
  const [skipReasonInput, setSkipReasonInput] = useState('')

  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])

  const selectedKey = keyFor(selectedDate.year, selectedDate.month, selectedDate.day)
  const todayKey = keyFor(today.year, today.month, today.day)
  const isToday = selectedKey === todayKey
  const isFuture =
    new Date(selectedDate.year, selectedDate.month, selectedDate.day).getTime() >
    new Date(today.year, today.month, today.day, 23, 59, 59).getTime()
  const isPast = !isToday && !isFuture

  // Storage key for exercise progress persistence across page reloads
  const progressStorageKey = `the_ledger_progress_${selectedKey}_${workoutVariation}`

  // Load progress from localStorage whenever selectedKey or workoutVariation changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(progressStorageKey)
      if (saved) {
        setProgress(JSON.parse(saved))
      } else {
        setProgress({})
      }
    } catch {
      setProgress({})
    }
  }, [progressStorageKey])

  // Load data from Supabase
  useEffect(() => {
    async function loadData() {
      // Start with 25 historical skips (3 weeks + 4 days across 4 months)
      const parsedHistory: History = { ...HARDCODED_SKIPPED_DAYS }

      // Fetch Workouts Log from Supabase
      const { data: workoutsData } = await supabase.from('workouts_log').select('*')
      if (workoutsData) {
        workoutsData.forEach((row) => {
          parsedHistory[row.date] = { variation: row.workout_type as DayKey }
        })
      }

      // Fetch Skipped Days from Supabase
      const { data: skippedData } = await supabase.from('skipped_days').select('*')
      if (skippedData) {
        skippedData.forEach((row) => {
          parsedHistory[row.date] = { skipped: true, skipReason: row.reason }
        })
      }

      setHistory(parsedHistory)

      // Fetch Queue State
      const { data: userStateData } = await supabase
        .from('user_state')
        .select('*')
        .limit(1)
        .single()

      let activeView: 'home' | 'calendar' | 'workout' | 'completion' = 'home'
      let activeWorkoutDay: DayKey | null = null
      let activeSelectedDate: { year: number; month: number; day: number } | null = null
      let activeReturnView: 'home' | 'calendar' = 'home'

      // Restore session state from URL or localStorage
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const urlView = params.get('view')
        const urlDay = Number(params.get('day'))
        const urlDate = params.get('date')

        if (
          urlView === 'home' ||
          urlView === 'calendar' ||
          urlView === 'workout' ||
          urlView === 'completion'
        ) {
          activeView = urlView
        }
        if (urlDay >= 1 && urlDay <= 5) {
          activeWorkoutDay = urlDay as DayKey
        }
        if (urlDate) {
          const [y, m, d] = urlDate.split('-').map(Number)
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            activeSelectedDate = { year: y, month: m, day: d }
          }
        }

        try {
          const savedSessionStr = localStorage.getItem('gym_buddy_session_state')
          if (savedSessionStr) {
            const saved = JSON.parse(savedSessionStr)
            if (!urlView && saved.view) activeView = saved.view
            if (!activeWorkoutDay && saved.workoutVariation)
              activeWorkoutDay = saved.workoutVariation
            if (!activeSelectedDate && saved.selectedDate)
              activeSelectedDate = saved.selectedDate
            if (saved.returnView) activeReturnView = saved.returnView
          }
        } catch {}
      }

      if (userStateData) {
        const queued = (userStateData.current_queued_workout || 1) as DayKey
        setQueuedVariation(queued)
        setUserStateId(userStateData.id)

        // Default to queued if not currently in an active session
        if (!activeWorkoutDay) {
          activeWorkoutDay = queued
        }
      }

      if (activeSelectedDate) {
        setSelectedDate(activeSelectedDate)
        setCalendarDate({
          year: activeSelectedDate.year,
          month: activeSelectedDate.month,
        })
      }
      if (activeWorkoutDay) {
        setWorkoutVariation(activeWorkoutDay)
        setSelectedVariation(activeWorkoutDay)
      }
      setReturnView(activeReturnView)
      setView(activeView)

      setDataLoaded(true)
    }
    loadData()
  }, [])

  const completedEntries = useMemo(
    () => Object.values(history).filter((entry) => entry.variation).length,
    [history]
  )
  const skipCount = useMemo(
    () => Object.values(history).filter((entry) => entry.skipped).length,
    [history]
  )

  // Rest timer tick
  useEffect(() => {
    if (!rest) return
    const timer = window.setInterval(() => setRest((value) => Math.max(value - 1, 0)), 1000)
    return () => window.clearInterval(timer)
  }, [rest])

  // Hydration interval
  useEffect(() => {
    const timer = window.setTimeout(() => setHydrationDue(true), 900000)
    return () => window.clearTimeout(timer)
  }, [])

  // Select a date on the calendar
  const handleSelectDate = (year: number, month: number, day: number) => {
    setSelectedDate({ year, month, day })
    setCalendarDate({ year, month })

    const key = keyFor(year, month, day)
    const existing = history[key]
    if (existing?.variation) {
      setSelectedVariation(existing.variation)
      setWorkoutVariation(existing.variation)
    } else if (key === todayKey) {
      setSelectedVariation(queuedVariation)
      setWorkoutVariation(queuedVariation)
    }
    // For unlogged days, the user decides which workout to do: no forced auto-assignment
  }

  // Change month in calendar view without forcing date selection
  const handleMonthChange = (year: number, month: number) => {
    setCalendarDate({ year, month })
  }

  // Choose workout variation for selected date in CalendarView
  const handleSelectVariation = async (next: DayKey) => {
    setSelectedVariation(next)
    setWorkoutVariation(next)

    // If this date already has a completed entry, update it in database and local state
    if (history[selectedKey]?.variation) {
      setHistory((prev) => ({
        ...prev,
        [selectedKey]: { variation: next },
      }))
      await supabase
        .from('workouts_log')
        .upsert({ date: selectedKey, workout_type: next }, { onConflict: 'date' })
    }
  }

  // Open skip prompt
  const handlePromptSkip = () => {
    const existing = history[selectedKey]
    setSkipReasonInput(existing?.skipReason || '')
    setSkipPromptOpen(true)
  }

  // Submit a skip for selectedKey
  const handleSubmitSkip = async () => {
    const reasonToSave = skipReasonInput.trim() || 'Skipped session'
    setHistory((prev) => ({
      ...prev,
      [selectedKey]: { skipped: true, skipReason: reasonToSave },
    }))
    setSkipPromptOpen(false)

    // Remove existing workout entry for selected day if any, and upsert skipped day
    await supabase.from('workouts_log').delete().eq('date', selectedKey)
    const { error } = await supabase.from('skipped_days').upsert(
      {
        date: selectedKey,
        reason: reasonToSave,
        financial_penalty: 25.2,
      },
      { onConflict: 'date' }
    )
    if (error) console.error('Error submitting skip:', error.message || error)
  }

  // Directly log a workout for selected date
  const handleDirectLogWorkout = async (variationToLog: DayKey) => {
    const nextQueue = (((variationToLog % 5) + 1) as DayKey)

    setSelectedVariation(variationToLog)
    setWorkoutVariation(variationToLog)
    setHistory((prev) => ({
      ...prev,
      [selectedKey]: { variation: variationToLog },
    }))

    if (isToday) {
      setQueuedVariation(nextQueue)
    }

    // Remove existing skip entry for date if any, and upsert workout log
    await supabase.from('skipped_days').delete().eq('date', selectedKey)
    const { error } = await supabase.from('workouts_log').upsert(
      {
        date: selectedKey,
        workout_type: variationToLog,
      },
      { onConflict: 'date' }
    )
    if (error) console.error('Error logging workout:', error.message || error)

    if (userStateId && isToday) {
      await supabase
        .from('user_state')
        .update({ current_queued_workout: nextQueue, last_active_date: todayKey })
        .eq('id', userStateId)
    }
  }

  // Clear any entry for a date
  const handleClearEntry = async (dateKeyToClear: string) => {
    setHistory((prev) => {
      const copy = { ...prev }
      delete copy[dateKeyToClear]
      return copy
    })
    await supabase.from('workouts_log').delete().eq('date', dateKeyToClear)
    await supabase.from('skipped_days').delete().eq('date', dateKeyToClear)
  }

  // Sync view, routine, and date to URL and localStorage whenever state changes
  useEffect(() => {
    if (!dataLoaded || typeof window === 'undefined') return

    try {
      localStorage.setItem(
        'gym_buddy_session_state',
        JSON.stringify({
          view,
          returnView,
          selectedDate,
          workoutVariation,
          selectedVariation,
        })
      )

      const url = new URL(window.location.href)
      if (view === 'workout') {
        url.searchParams.set('view', 'workout')
        url.searchParams.set('day', String(workoutVariation))
        url.searchParams.set('date', selectedKey)
      } else if (view === 'calendar') {
        url.searchParams.set('view', 'calendar')
        url.searchParams.delete('day')
        url.searchParams.set('date', selectedKey)
      } else if (view === 'completion') {
        url.searchParams.set('view', 'completion')
        url.searchParams.delete('day')
        url.searchParams.delete('date')
      } else {
        url.searchParams.delete('view')
        url.searchParams.delete('day')
        url.searchParams.delete('date')
      }
      window.history.replaceState(null, '', url.toString())
    } catch (err) {
      console.error('Failed to sync session state', err)
    }
  }, [view, returnView, selectedDate, workoutVariation, selectedVariation, selectedKey, dataLoaded])

  // Swap routine inside active WorkoutView
  const handleSwapWorkoutRoutine = async (next: DayKey) => {
    setWorkoutVariation(next)
    setSelectedVariation(next)

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'gym_buddy_session_state',
          JSON.stringify({
            view: 'workout',
            returnView,
            selectedDate,
            workoutVariation: next,
            selectedVariation: next,
          })
        )
        const url = new URL(window.location.href)
        url.searchParams.set('view', 'workout')
        url.searchParams.set('day', String(next))
        url.searchParams.set('date', selectedKey)
        window.history.replaceState(null, '', url.toString())
      } catch {}
    }

    if (isToday) {
      setQueuedVariation(next)
      if (userStateId) {
        await supabase
          .from('user_state')
          .update({ current_queued_workout: next })
          .eq('id', userStateId)
      }
    } else if (history[selectedKey]?.variation) {
      // If editing an existing past workout
      setHistory((prev) => ({
        ...prev,
        [selectedKey]: { variation: next },
      }))
      await supabase
        .from('workouts_log')
        .upsert({ date: selectedKey, workout_type: next }, { onConflict: 'date' })
    }
  }

  // Complete workout from WorkoutView
  const handleFinishWorkout = async () => {
    try {
      localStorage.removeItem(progressStorageKey)
    } catch {}
    await handleDirectLogWorkout(workoutVariation)
    setView('completion')
  }

  // Helper to persist exercise updates to state and localStorage
  const updateProgressState = (updater: (prev: Record<number, number>) => Record<number, number>) => {
    setProgress((prev) => {
      const next = updater(prev)
      try {
        localStorage.setItem(progressStorageKey, JSON.stringify(next))
      } catch (err) {
        console.error('Failed to save progress to localStorage', err)
      }
      return next
    })
  }

  // Reset an exercise
  const handleResetExercise = (index: number) => {
    updateProgressState((prev) => {
      const copy = { ...prev }
      copy[index] = 0
      return copy
    })
  }

  // Tap an exercise: saves to state and localStorage immediately
  const handleTapExercise = (index: number, singleTap = false) => {
    updateProgressState((prev) => {
      const current = prev[index] ?? 0
      const next = singleTap ? (current === 3 ? 0 : 3) : (current + 1) % 4
      return { ...prev, [index]: next }
    })
  }

  // Mark entire day as done for past workouts
  const handleMarkAllDone = async () => {
    const preCount = workoutVariation === 3 ? 2 : 3
    const totalCount = preCount + coreWorkouts[workoutVariation].length + 3
    const allDoneObj: Record<number, number> = {}
    for (let i = 0; i < totalCount; i++) {
      allDoneObj[i] = 3
    }
    setProgress(allDoneObj)
    try {
      localStorage.removeItem(progressStorageKey)
    } catch {}
    await handleDirectLogWorkout(workoutVariation)
    setView('completion')
  }

  if (!dataLoaded) {
    return (
      <main className="tracker-shell">
        <div
          className="editorial-hero"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1>Loading Sharan&apos;s Gym Buddy...</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="tracker-shell">
      <header className="app-header">
        <button
          className="date-title"
          onClick={() => setView('home')}
          aria-label="Return to overview"
        >
          Sharan&apos;s Gym Buddy <span>·</span> <strong>daily workout tracker</strong>
        </button>
      </header>

      {view === 'home' && (
        <HomeView
          queuedVariation={queuedVariation}
          skipCount={skipCount}
          completedEntries={completedEntries}
          onStartToday={() => {
            setSelectedDate(today)
            setSelectedVariation(queuedVariation)
            setWorkoutVariation(queuedVariation)
            setReturnView('home')
            setView('workout')
          }}
          onOpenCalendar={() => setView('calendar')}
          onSelectDayCard={async (day) => {
            setSelectedDate(today)
            setSelectedVariation(day)
            setWorkoutVariation(day)
            setQueuedVariation(day)
            if (userStateId) {
              await supabase
                .from('user_state')
                .update({ current_queued_workout: day })
                .eq('id', userStateId)
            }
            setReturnView('home')
            setView('workout')
          }}
          onSkipToday={() => {
            setSelectedDate(today)
            handlePromptSkip()
          }}
        />
      )}

      {view === 'calendar' && (
        <CalendarView
          calendarDate={calendarDate}
          selectedKey={selectedKey}
          todayKey={todayKey}
          selectedDate={selectedDate}
          today={today}
          history={history}
          queuedVariation={queuedVariation}
          activeVariation={selectedVariation}
          onSelectDate={handleSelectDate}
          onMonthChange={handleMonthChange}
          onSelectVariation={handleSelectVariation}
          onBackToHome={() => setView('home')}
          onOpenWorkoutSession={() => {
            setWorkoutVariation(selectedVariation)
            setReturnView('calendar')
            setView('workout')
          }}
          onDirectLogWorkout={handleDirectLogWorkout}
          onHandleSkip={handlePromptSkip}
          onClearEntry={handleClearEntry}
        />
      )}

      {view === 'workout' && (
        <WorkoutView
          variation={workoutVariation}
          returnView={returnView}
          progress={progress}
          isToday={isToday}
          isPast={isPast}
          onBack={() => setView(returnView)}
          onSwapRoutine={handleSwapWorkoutRoutine}
          onResetExercise={handleResetExercise}
          onTapExercise={handleTapExercise}
          onFinishWorkout={handleFinishWorkout}
          onMarkAllDone={handleMarkAllDone}
        />
      )}

      {view === 'completion' && (
        <CompletionView
          quote={quote}
          returnView={returnView}
          onReturn={() => setView(returnView)}
        />
      )}

      {/* Floating Timer & Modals */}
      <button
        className="floating-timer"
        onClick={() => setRest(rest > 0 ? 0 : 30)}
        aria-label="Start 30 second rest timer"
      >
        <Timer size={20} />
        {rest > 0 && <b>{rest}s</b>}
      </button>

      <RestTimerModal rest={rest} onClose={() => setRest(0)} />

      <button className="debug-hydration" onClick={() => setHydration(true)}>
        debug hydration
      </button>

      <HydrationModal
        isOpen={hydration || hydrationDue}
        onClose={() => {
          setHydration(false)
          setHydrationDue(false)
        }}
      />

      <SkipPromptModal
        isOpen={skipPromptOpen}
        skipReasonInput={skipReasonInput}
        onChangeReason={setSkipReasonInput}
        onSubmit={handleSubmitSkip}
        onClose={() => setSkipPromptOpen(false)}
      />
    </main>
  )
}
