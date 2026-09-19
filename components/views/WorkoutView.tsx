'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import {
  DayKey,
  coreWorkouts,
  dayColors,
  dayNames,
  titleCase,
  workoutDetail,
} from '@/lib/workout-data'

export interface WorkoutViewProps {
  variation: DayKey
  returnView: 'home' | 'calendar'
  progress: Record<number, number>
  isToday: boolean
  isPast?: boolean
  onBack: () => void
  onSwapRoutine: (next: DayKey) => void
  onResetExercise: (index: number) => void
  onTapExercise: (index: number, singleTap?: boolean) => void
  onFinishWorkout: () => void
  onMarkAllDone?: () => void
}

export function WorkoutView({
  variation,
  returnView,
  progress,
  isToday,
  isPast = false,
  onBack,
  onSwapRoutine,
  onResetExercise,
  onTapExercise,
  onFinishWorkout,
  onMarkAllDone,
}: WorkoutViewProps) {
  const [swapOpen, setSwapOpen] = useState(false)

  // Build the list of exercises
  const pre = [
    { name: 'Stretching' },
    ...(variation === 2 ? [{ name: 'Leg mobility' }] : [{ name: 'Silambam stick stretch' }]),
    ...(variation !== 3 ? [{ name: 'Treadmill', detail: '10 mins walk' }] : []),
  ]
  const post = [
    { name: 'Stretch using roller' },
    { name: 'Machine stretch' },
    { name: 'Lower body relief' },
  ]
  const core = coreWorkouts[variation]
  const exercises = [...pre, ...core, ...post]

  const preCount = variation === 3 ? 2 : 3
  const coreStart = preCount
  const coreEnd = coreStart + core.length

  const totalCount = exercises.length
  const completedCount = exercises.filter((_, idx) => (progress[idx] ?? 0) === 3).length
  const allDone = completedCount === totalCount
  const canSubmit = isPast ? true : allDone

  return (
    <section className="workout-view">
      <button className="back-link" onClick={onBack}>
        <ChevronLeft size={18} /> {returnView === 'calendar' ? 'Calendar' : 'Overview'}
      </button>

      <div className="workout-title">
        <div className="workout-heading-row">
          <div className="section-kicker">LOCKED QUEUE / DAY {variation}</div>
          <button
            className="swap-trigger"
            onClick={() => setSwapOpen((value) => !value)}
            aria-expanded={swapOpen}
          >
            Swap routine <ChevronDown size={14} />
          </button>
        </div>

        {swapOpen && (
          <div className="swap-menu" role="listbox" aria-label="Choose today's routine">
            {([1, 2, 3, 4, 5] as DayKey[])
              .filter((day) => day !== variation)
              .map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSwapOpen(false)
                    onSwapRoutine(day)
                  }}
                >
                  {dayNames[day]} <span style={{ backgroundColor: dayColors[day] }} />
                </button>
              ))}
          </div>
        )}

        <h1>
          {dayNames[variation]}
          <br />
          <span>day.</span>
        </h1>
        <p>
          Pre and post work are one tap. Core work tracks your sets and cardio. The next day only
          advances after completion.
        </p>
      </div>

      {(['PRE-WORKOUT', 'CORE WORKOUT', 'POST-WORKOUT'] as const).map((section) => {
        const range =
          section === 'PRE-WORKOUT'
            ? exercises.slice(0, preCount)
            : section === 'CORE WORKOUT'
            ? exercises.slice(coreStart, coreEnd)
            : exercises.slice(coreEnd)

        const start = exercises.indexOf(range[0])

        return (
          <div className="exercise-section" key={section}>
            <h2>{section}</h2>
            {range.map((exercise, index) => {
              const absoluteIndex = start + index
              const stage = progress[absoluteIndex] ?? 0
              const isThreeStage =
                section === 'CORE WORKOUT' &&
                (variation !== 3 || /weighted ab crunch|russian twist/i.test(exercise.name))

              return (
                <div
                  className={`exercise-item exercise-card workout-tone-${absoluteIndex % 10} ${
                    stage === 3 ? 'complete' : ''
                  }`}
                  key={`${section}-${absoluteIndex}`}
                >
                  <div className="exercise-info">
                    <button
                      className={`exercise-name ${stage === 3 ? 'complete-name' : ''}`}
                      onClick={() => onResetExercise(absoluteIndex)}
                      aria-label={`Reset ${titleCase(exercise.name)}`}
                    >
                      {titleCase(exercise.name)}
                    </button>
                    <span className="rep-pill">
                      {workoutDetail(exercise, section)}
                    </span>
                  </div>
                  <button
                    className={`stage-button ${
                      !isThreeStage ? 'mark-button' : `stage-${stage}`
                    } ${stage === 3 ? 'is-done' : ''}`}
                    onClick={() => onTapExercise(absoluteIndex, !isThreeStage)}
                    aria-label={`${exercise.name}, ${
                      isThreeStage
                        ? `${stage} of 3 complete`
                        : stage === 3
                        ? 'complete'
                        : 'tap to complete'
                    }`}
                  >
                    <span className="stage-fill" />
                    {isThreeStage ? (
                      <span>{stage === 3 ? 'DONE' : `${stage}/3`}</span>
                    ) : (
                      <span>DONE</span>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Complete Workout Day button at bottom */}
      <div className="workout-bottom-actions">
        <button
          className={`primary-cta finish-cta ${!allDone ? 'btn-grey' : 'btn-active-color'} ${
            !canSubmit ? 'btn-disabled' : ''
          }`}
          style={{
            backgroundColor: allDone ? dayColors[variation] : '#9ca3af',
            color: allDone ? '#ffffff' : '#171210',
          }}
          onClick={() => {
            if (canSubmit) onFinishWorkout()
          }}
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
        >
          Complete {dayNames[variation]} Day
        </button>
      </div>

      {/* For past unlogged days: sleek compact Mark Entire Day As Done button below */}
      {isPast && onMarkAllDone && (
        <div className="mark-all-done-container">
          <button
            className="mark-all-done-btn"
            onClick={onMarkAllDone}
          >
            <span>Mark entire day as done</span>
            <span className="mark-check">✓</span>
          </button>
        </div>
      )}
    </section>
  )
}
