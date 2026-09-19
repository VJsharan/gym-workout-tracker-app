'use client'

import React from 'react'

export interface RestTimerModalProps {
  rest: number
  onClose: () => void
}

export function RestTimerModal({ rest, onClose }: RestTimerModalProps) {
  if (rest <= 0) return null

  return (
    <div className="rest-overlay" onClick={onClose}>
      <div className="rest-timer-box" onClick={(event) => event.stopPropagation()}>
        <span className="rest-timer-tag">REST</span>
        <div className="rest-timer-giant">
          <strong>{rest}</strong>
        </div>
        <span className="rest-timer-unit">seconds</span>
      </div>
      <p className="rest-tap-hint">TAP ANYWHERE TO CLOSE</p>
    </div>
  )
}
