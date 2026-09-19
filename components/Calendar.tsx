'use client'

import React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  DayKey,
  History,
  dayColors,
  dayNames,
  formatDateKey,
  keyFor,
  nextMonth,
  previousMonth,
  workoutForDate,
} from '@/lib/workout-data'

export interface CalendarProps {
  year: number
  month: number
  selected: string
  onSelect: (year: number, month: number, day: number) => void
  onMonthChange?: (year: number, month: number) => void
  history: History
  queuedVariation: DayKey
  today: { year: number; month: number; day: number }
}

export function Calendar({
  year,
  month,
  selected,
  onSelect,
  onMonthChange,
  history,
  queuedVariation,
  today,
}: CalendarProps) {
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1))
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const previousMonthDays = new Date(year, month, 0).getDate()

  const cells = Array.from({ length: 42 }, (_, index) => {
    const raw = index - firstDay + 1
    let cellDate: Date
    let outside = false
    if (raw < 1) {
      cellDate = new Date(year, month - 1, previousMonthDays + raw)
      outside = true
    } else if (raw > daysInMonth) {
      cellDate = new Date(year, month + 1, raw - daysInMonth)
      outside = true
    } else {
      cellDate = new Date(year, month, raw)
    }
    return { date: cellDate, day: cellDate.getDate(), outside }
  })

  const selectedDate = new Date(
    Number(selected.split('-')[0]),
    Number(selected.split('-')[1]),
    Number(selected.split('-')[2])
  )
  const selectedEntry = history[selected]
  const selectedVariation =
    selectedEntry?.variation ??
    workoutForDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), queuedVariation, today)

  const handlePrevMonth = () => {
    const d = previousMonth(year, month)
    if (onMonthChange) {
      onMonthChange(d.year, d.month)
    } else {
      onSelect(d.year, d.month, 1)
    }
  }

  const handleNextMonth = () => {
    const d = nextMonth(year, month)
    if (onMonthChange) {
      onMonthChange(d.year, d.month)
    } else {
      onSelect(d.year, d.month, 1)
    }
  }

  return (
    <div className="calendar" aria-label={`${monthName} ${year} calendar`}>
      <div className="calendar-heading">
        <button onClick={handlePrevMonth} aria-label="Previous month">
          <ChevronLeft size={19} />
        </button>
        <h2>
          {monthName} {year}
        </h2>
        <button onClick={handleNextMonth} aria-label="Next month">
          <ChevronRight size={19} />
        </button>
        <ChevronDown size={18} aria-hidden="true" />
      </div>

      <div className="calendar-weekdays">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-body">
        {cells.map(({ date, day, outside }, index) => {
          const cellYear = date.getFullYear()
          const cellMonth = date.getMonth()
          const cellDay = date.getDate()
          const actualKey = keyFor(cellYear, cellMonth, cellDay)
          const entry = history[actualKey]
          const isToday = actualKey === keyFor(today.year, today.month, today.day)
          const selectedDay = actualKey === selected
          const variation =
            entry?.variation ??
            workoutForDate(cellYear, cellMonth, cellDay, queuedVariation, today)

          return (
            <button
              key={`${index}-${actualKey}`}
              className={`calendar-day ${outside ? 'outside' : ''} ${selectedDay ? 'selected' : ''} ${isToday ? 'is-today' : ''}`}
              onClick={() => onSelect(cellYear, cellMonth, cellDay)}
              aria-label={`${monthName} ${day}, ${
                entry?.skipped ? 'skipped' : entry?.variation ? dayNames[entry.variation] : 'unlogged'
              }`}
            >
              <span>{day}</span>
              {entry?.skipped ? (
                <strong className="skip-mark" aria-label="Skipped">
                  ×
                </strong>
              ) : entry?.variation ? (
                <strong className="complete-mark" aria-label="Completed">
                  ✓
                </strong>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="today-rule">
        <span>
          {selected === keyFor(today.year, today.month, today.day) ? 'TODAY' : 'SELECTED DAY'} ·{' '}
          {formatDateKey(selected)}
        </span>
        <strong>
          {selectedEntry?.skipped
            ? 'SKIPPED'
            : selectedEntry?.variation
            ? `${dayNames[selectedEntry.variation]} DAY`
            : 'UNLOGGED'}
        </strong>
      </div>
    </div>
  )
}
