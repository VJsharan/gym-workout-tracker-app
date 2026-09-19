'use client'

import React from 'react'
import { DayKey, HistoryEntry, dayNames, formatDateKey } from '@/lib/workout-data'

export interface HistoryModalProps {
  modalData: { dateKey: string; entry: HistoryEntry } | null
  onClose: () => void
  onGoToWorkout: () => void
  onChangeToSkip: () => void
  onClearEntry: (dateKey: string) => void
}

export function HistoryModal({
  modalData,
  onClose,
  onGoToWorkout,
  onChangeToSkip,
  onClearEntry,
}: HistoryModalProps) {
  if (!modalData) return null

  const { dateKey, entry } = modalData

  return (
    <div className="brutalist-overlay sheet-overlay" onClick={onClose}>
      <div className="brutalist-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        {entry.skipped ? (
          <>
            <div className="sheet-date">{formatDateKey(dateKey)}</div>
            <h2 className="skipped-header">SKIPPED</h2>
            <p className="skip-reason">{entry.skipReason || 'No reason provided.'}</p>
            <div className="penalty-text">Penalty: ₹25.20</div>
          </>
        ) : (
          <h2 className="completed-header">
            {formatDateKey(dateKey)} /{' '}
            {dayNames[entry.variation as DayKey]?.toUpperCase()} DAY COMPLETED
          </h2>
        )}

        <div className="calendar-actions" style={{ marginBottom: '20px' }}>
          <button className="primary-cta" onClick={onGoToWorkout}>
            Go to Workout
          </button>
          <button className="outline-cta" onClick={onChangeToSkip}>
            Change to Skip
          </button>
          <button className="clear-cta" onClick={() => onClearEntry(dateKey)}>
            Clear Entry
          </button>
        </div>

        <button className="sheet-close" onClick={onClose}>
          [ CLOSE ]
        </button>
      </div>
    </div>
  )
}
