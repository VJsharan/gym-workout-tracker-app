'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { Calendar } from '@/components/Calendar'
import {
  DayKey,
  History,
  dayColors,
  dayNames,
  formatDateKey,
} from '@/lib/workout-data'

export interface CalendarViewProps {
  calendarDate: { year: number; month: number }
  selectedKey: string
  todayKey: string
  selectedDate: { year: number; month: number; day: number }
  today: { year: number; month: number; day: number }
  history: History
  queuedVariation: DayKey
  activeVariation: DayKey
  onSelectDate: (year: number, month: number, day: number) => void
  onMonthChange: (year: number, month: number) => void
  onSelectVariation: (variation: DayKey) => void
  onBackToHome: () => void
  onOpenWorkoutSession: () => void
  onDirectLogWorkout: (variation: DayKey) => void
  onHandleSkip: () => void
  onClearEntry: (key: string) => void
}

export function CalendarView({
  calendarDate,
  selectedKey,
  todayKey,
  selectedDate,
  today,
  history,
  queuedVariation,
  activeVariation,
  onSelectDate,
  onMonthChange,
  onSelectVariation,
  onBackToHome,
  onOpenWorkoutSession,
  onDirectLogWorkout,
  onHandleSkip,
  onClearEntry,
}: CalendarViewProps) {
  const entry = history[selectedKey]
  const isSelectedToday = selectedKey === todayKey
  const isFuture =
    new Date(selectedDate.year, selectedDate.month, selectedDate.day).getTime() >
    new Date(today.year, today.month, today.day, 23, 59, 59).getTime()

  return (
    <section className="calendar-page">
      <button className="back-link" onClick={onBackToHome}>
        <ChevronLeft size={18} /> Overview
      </button>

      <Calendar
        year={calendarDate.year}
        month={calendarDate.month}
        selected={selectedKey}
        onSelect={onSelectDate}
        onMonthChange={onMonthChange}
        history={history}
        queuedVariation={queuedVariation}
        today={today}
      />

      {entry?.skipped ? (
        <div className="calendar-status-card">
          <div className="status-row">
            <span className="status-badge skip-badge">SKIPPED</span>
            <span className="status-penalty">Penalty: ₹25.20</span>
          </div>
          <p className="status-detail">
            {entry.skipReason ? `"${entry.skipReason}"` : 'No skip reason logged.'}
          </p>

          <div className="routine-pill-selector">
            <span>Change to routine:</span>
            <div className="routine-pill-row">
              {([1, 2, 3, 4, 5] as DayKey[]).map((v) => (
                <button
                  key={v}
                  className={`routine-pill ${activeVariation === v ? 'active' : ''}`}
                  style={{
                    borderColor: dayColors[v],
                    backgroundColor: activeVariation === v ? dayColors[v] : 'transparent',
                    color: activeVariation === v ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    onSelectVariation(v)
                    onDirectLogWorkout(v)
                  }}
                >
                  {dayNames[v]}
                </button>
              ))}
            </div>
          </div>

          <div className="calendar-actions">
            <button
              className="primary-cta"
              onClick={onOpenWorkoutSession}
              style={{ flex: 1, backgroundColor: dayColors[activeVariation] }}
            >
              Open Session
            </button>
            <button className="outline-cta log-skip-btn" onClick={onHandleSkip} style={{ flex: 1 }}>
              <span className="skip-btn-symbol">✎</span> Edit Reason
            </button>
            <button className="clear-cta" onClick={() => onClearEntry(selectedKey)}>
              Clear
            </button>
          </div>
        </div>
      ) : entry?.variation ? (
        <div className="calendar-status-card">
          <div className="status-row">
            <span className="status-badge done-badge">✓ COMPLETED</span>
            <strong className="status-title">{dayNames[entry.variation]} Day</strong>
          </div>
          <p className="status-detail">Completed session on {formatDateKey(selectedKey)}.</p>

          <div className="routine-pill-selector">
            <span>Switch routine:</span>
            <div className="routine-pill-row">
              {([1, 2, 3, 4, 5] as DayKey[]).map((v) => (
                <button
                  key={v}
                  className={`routine-pill ${entry.variation === v ? 'active' : ''}`}
                  style={{
                    borderColor: dayColors[v],
                    backgroundColor: entry.variation === v ? dayColors[v] : 'transparent',
                    color: entry.variation === v ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    onSelectVariation(v)
                    onDirectLogWorkout(v)
                  }}
                >
                  {dayNames[v]}
                </button>
              ))}
            </div>
          </div>

          <div className="calendar-actions">
            <button
              className="primary-cta"
              onClick={onOpenWorkoutSession}
              style={{ flex: 1, backgroundColor: dayColors[entry.variation] }}
            >
              View / Redo
            </button>
            <button className="outline-cta log-skip-btn" onClick={onHandleSkip} style={{ flex: 1 }}>
              <span className="skip-btn-symbol">×</span> Change to Skip
            </button>
            <button className="clear-cta" onClick={() => onClearEntry(selectedKey)}>
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="calendar-unlogged-card">
          <div className="unlogged-meta">
            <small>
              {isSelectedToday
                ? 'TODAY'
                : isFuture
                ? 'UPCOMING DAY'
                : 'PAST UNLOGGED DAY'}
            </small>
            <strong>Choose Workout or Log Skip</strong>
          </div>

          <div className="routine-pill-selector">
            <span>Choose routine for this day:</span>
            <div className="routine-pill-row">
              {([1, 2, 3, 4, 5] as DayKey[]).map((v) => (
                <button
                  key={v}
                  className={`routine-pill ${activeVariation === v ? 'active' : ''}`}
                  style={{
                    borderColor: dayColors[v],
                    backgroundColor: activeVariation === v ? dayColors[v] : 'transparent',
                    color: activeVariation === v ? '#000' : '#fff',
                  }}
                  onClick={() => onSelectVariation(v)}
                >
                  {dayNames[v]}
                </button>
              ))}
            </div>
          </div>

          <div className="calendar-actions">
            <button
              className="primary-cta"
              onClick={() => {
                if (isSelectedToday) {
                  onOpenWorkoutSession()
                } else {
                  onDirectLogWorkout(activeVariation)
                }
              }}
              style={{ flex: 1, backgroundColor: dayColors[activeVariation] }}
            >
              {isSelectedToday
                ? `Start ${dayNames[activeVariation]} day`
                : `Log ${dayNames[activeVariation]} day`}
            </button>
            {!isSelectedToday && !isFuture && (
              <button
                className="outline-cta"
                onClick={onOpenWorkoutSession}
                style={{ flex: 1 }}
              >
                Open Session
              </button>
            )}
            <button className="outline-cta log-skip-btn" onClick={onHandleSkip} style={{ flex: 1 }}>
              <span className="skip-btn-symbol">×</span> Log Skip
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
