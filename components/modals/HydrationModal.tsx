'use client'

import React from 'react'

export interface HydrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HydrationModal({ isOpen, onClose }: HydrationModalProps) {
  if (!isOpen) return null

  return (
    <div className="brutalist-overlay">
      <div className="brutalist-modal">
        <h2 className="hydrate-header">HYDRATE.</h2>
        <div className="brutalist-actions">
          <button className="black-btn" onClick={onClose}>
            Drank
          </button>
          <button className="transparent-btn" onClick={onClose}>
            Snooze
          </button>
        </div>
      </div>
    </div>
  )
}
