'use client'

import React from 'react'

export interface CompletionViewProps {
  quote: string
  returnView: 'home' | 'calendar'
  onReturn: () => void
}

export function CompletionView({ quote, returnView, onReturn }: CompletionViewProps) {
  return (
    <section className="completion-view">
      <div className="completion-content">
        <h1>SESSION CLOSED.</h1>
        <p>
          <i>{quote}</i>
        </p>
      </div>
      <button className="edge-to-edge-btn" onClick={onReturn}>
        Return to {returnView === 'calendar' ? 'Calendar' : 'Overview'}
      </button>
    </section>
  )
}
