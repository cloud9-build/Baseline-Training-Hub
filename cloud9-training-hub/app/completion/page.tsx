'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadState } from '@/lib/state'
import { sections } from '@/lib/sections'
import { AppState } from '@/lib/types'

export default function CompletionPage() {
  const [state, setState] = useState<AppState | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setState(loadState())
  }, [])

  if (!mounted || !state) return null

  const completedAt = state.sections['final-test']?.attempts.slice(-1)[0]?.timestamp
  const dateStr = completedAt
    ? new Date(completedAt).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Today'

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="text-[11px] font-bold tracking-widest uppercase text-faint mb-8">
          Baseline Training Hub
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">Training complete.</h1>
        <p className="text-sm text-muted mb-1">{state.traineeName}</p>
        <p className="text-sm text-faint mb-10">{dateStr}</p>

        <div className="space-y-2.5 mb-10">
          {sections.map((section) => {
            const progress = state.sections[section.id]
            const attempts = progress?.attempts.length ?? 0
            return (
              <div
                key={section.id}
                className="bg-warm-card border border-warm-border rounded-card px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-ink">{section.title}</div>
                  {section.hasTest && (
                    <div className="text-[11px] text-faint mt-0.5">
                      {attempts} attempt{attempts !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-sage-bg text-sage">
                  Passed
                </span>
              </div>
            )
          })}

          {/* Final test */}
          <div className="bg-warm-card border border-warm-border rounded-card px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-ink">Final Test</div>
              <div className="text-[11px] text-faint mt-0.5">
                {state.sections['final-test']?.attempts.length ?? 0} attempt{(state.sections['final-test']?.attempts.length ?? 0) !== 1 ? 's' : ''}
              </div>
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-sage-bg text-sage">
              Passed
            </span>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed mb-8">
          You've completed all sections and passed the final test. You're ready to start. If you ever need to look something up, head back to the study sections — they'll always be here.
        </p>

        <Link href="/" className="text-sm font-semibold text-muted hover:text-ink transition-colors underline">
          Back to home
        </Link>
      </div>
    </main>
  )
}
