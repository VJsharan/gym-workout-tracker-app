'use client'

import React from 'react'

export interface SkipPromptModalProps {
  isOpen: boolean
  skipReasonInput: string
  onChangeReason: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function SkipPromptModal({
  isOpen,
  skipReasonInput,
  onChangeReason,
  onSubmit,
  onClose,
}: SkipPromptModalProps) {
  if (!isOpen) return null

  return (
    <div className="brutalist-overlay">
      <div className="brutalist-modal">
        <h2 className="skip-prompt-header">SKIPPING?</h2>
        <p className="skip-prompt-desc">Why are you skipping?</p>
        <input
          autoFocus
          className="brutalist-input"
          value={skipReasonInput}
          onChange={(e) => onChangeReason(e.target.value)}
          placeholder="Enter reason..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit()
          }}
        />
        <div className="brutalist-actions" style={{ marginTop: '24px' }}>
          <button className="black-btn" onClick={onSubmit}>
            Log Skip
          </button>
          <button className="transparent-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
