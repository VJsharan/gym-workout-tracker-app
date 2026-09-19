'use client'

import React, { CSSProperties } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DayKey, dayColors, dayNames } from '@/lib/workout-data'

export interface HomeViewProps {
  queuedVariation: DayKey
  skipCount: number
  completedEntries: number
  onStartToday: () => void
  onOpenCalendar: () => void
  onSelectDayCard: (day: DayKey) => void
  onSkipToday: () => void
}

export function HomeView({
  queuedVariation,
  skipCount,
  completedEntries,
  onStartToday,
  onOpenCalendar,
  onSelectDayCard,
  onSkipToday,
}: HomeViewProps) {
  return (
    <>
      <section className="editorial-hero">
        <div className="hero-copy">
          <div className="section-kicker">LIVE · DAILY MOVEMENT / 2026</div>
          <h1>
            Move well.
            <br />
            <em>Keep going.</em>
          </h1>
          <p>
            One clean queue for the work that matters. Your next session is ready when you are.
          </p>
          <div className="hero-actions">
            <Button
              className="primary-cta"
              style={{ backgroundColor: dayColors[queuedVariation] }}
              onClick={onStartToday}
            >
              <Play data-icon="inline-start" fill="currentColor" /> Start {dayNames[queuedVariation]} day
            </Button>
            <Button className="outline-cta" variant="outline" onClick={onOpenCalendar}>
              Open calendar
            </Button>
          </div>
        </div>
        <div className="hero-feature">
          <span>QUEUED / TODAY</span>
          <strong>{dayNames[queuedVariation]}</strong>
          <small>DAY {queuedVariation} · {queuedVariation === 3 ? 'CARDIO' : 'STRENGTH'}</small>
          <div className="hero-arrow">↗</div>
        </div>
      </section>

      <div className="ticker">
        <span>THE DAILY QUEUE</span>
        <b>•</b>
        <span>TRAIN WITH INTENT</span>
        <b>•</b>
        <span>KEEP THE LEDGER CLEAN</span>
        <b>•</b>
        <span>THE DAILY QUEUE</span>
      </div>

      <section className="collection-section">
        <div className="collection-intro">
          <div className="section-kicker">THE ROTATION / 05 DAYS</div>
          <h2>
            Five ways to
            <br />
            <em>show up.</em>
          </h2>
          <p>Strength, cardio, and recovery arranged around a simple repeatable rhythm.</p>
          <Button className="text-link" variant="link" onClick={onOpenCalendar}>
            View the full calendar →
          </Button>
        </div>
        <div className="day-grid">
          {([1, 2, 3, 4, 5] as DayKey[]).map((day, index) => (
            <button
              key={day}
              className="day-card"
              style={{ '--card-color': dayColors[day] } as CSSProperties}
              onClick={() => onSelectDayCard(day)}
            >
              <span>0{index + 1}</span>
              <strong>{dayNames[day]}</strong>
              <small>
                {day === 3 ? 'Conditioning' : day === 2 ? 'Lower body' : 'Strength work'}
              </small>
              <i>↗</i>
            </button>
          ))}
        </div>
      </section>

      <section className="feature-banner">
        <div>
          <span>SHARAN&apos;S GYM BUDDY / 2026</span>
          <h2>
            A routine that
            <br />
            <em>outlasts excuses.</em>
          </h2>
        </div>
        <p>
          Every completed session moves the account forward. Track the work, keep the streak,
          and make the next choice obvious.
        </p>
      </section>

      <section className="ledger-widget">
        <div>
          <span>Days skipped</span>
          <strong>{skipCount}</strong>
        </div>
        <div>
          <span>Money wasted</span>
          <strong>₹{(skipCount * 25.2).toFixed(2)}</strong>
        </div>
        <p>
          Based on ₹9200 / year gym membership (4 months tracked). {completedEntries} completed workouts tracked.
        </p>
      </section>

      <section className="home-footer-cta">
        <div>
          <div className="section-kicker">A SMALL PROMISE</div>
          <h2>
            Come back
            <br />
            <em>tomorrow.</em>
          </h2>
        </div>
        <div>
          <p>Skip today and the same workout carries forward.</p>
          <Button className="outline-cta log-skip-btn" variant="outline" onClick={onSkipToday}>
            <span className="skip-btn-symbol">×</span> Skip today
          </Button>
        </div>
      </section>

      <footer className="editorial-footer">
        <strong>Sharan&apos;s Gym Buddy.</strong>
        <span>Daily movement, made clear.</span>
        <small>© 2026 · Built for consistency</small>
      </footer>
    </>
  )
}
