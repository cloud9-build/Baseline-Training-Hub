'use client'

import { useState, useEffect } from 'react'
import { sections } from '@/lib/sections'
import { loadState, saveState, initState, isSectionUnlocked, FINAL_TEST_ID } from '@/lib/state'
import { AppState } from '@/lib/types'
import SectionCard from '@/components/SectionCard'
import Link from 'next/link'

export default function HomePage() {
  const [state, setState] = useState<AppState | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setState(loadState())
  }, [])

  function handleStart(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (!trimmed) return
    const newState = initState(trimmed)
    saveState(newState)
    setState(newState)
  }

  if (!mounted) return null

  // Name entry
  if (!state) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-faint mb-2">
            Baseline Training Hub
          </div>
          <h1 className="text-2xl font-bold text-ink mb-1">Welcome</h1>
          <p className="text-sm text-muted mb-8">Enter your name to get started.</p>
          <form onSubmit={handleStart} className="flex gap-3">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              className="flex-1 border border-warm-border rounded-xl px-4 py-2.5 text-sm font-medium text-ink bg-warm-card focus:outline-none focus:border-sage"
              autoFocus
            />
            <button
              type="submit"
              className="bg-ink text-warm-card text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-80 transition-opacity"
            >
              Start
            </button>
          </form>
        </div>
      </main>
    )
  }

  const passedCount = sections.filter(
    (s) => state.sections[s.id]?.status === 'passed'
  ).length

  const finalUnlocked = isSectionUnlocked(state, FINAL_TEST_ID)
  const finalProgress = state.sections[FINAL_TEST_ID]
  const appComplete = finalProgress?.status === 'passed'

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-faint mb-1">
              Baseline Training Hub
            </div>
            <h1 className="text-2xl font-bold text-ink">Welcome back, {state.traineeName}</h1>
            {!appComplete && (
              <p className="text-sm text-muted mt-1">
                {passedCount === 0
                  ? 'Start with Section 1 below.'
                  : `${passedCount} of ${sections.length} sections complete. Keep going.`}
              </p>
            )}
            {appComplete && (
              <p className="text-sm text-sage mt-1 font-semibold">Training complete.</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-1 bg-warm-border rounded-full overflow-hidden">
            <div
              className="h-1 bg-sage rounded-full transition-all"
              style={{ width: `${(passedCount / sections.length) * 100}%` }}
            />
          </div>
          <div className="text-[11px] font-semibold text-faint tracking-wide">
            {passedCount} / {sections.length}
          </div>
        </div>

        {/* Section cards */}
        <div className="flex flex-col gap-2.5 mb-6">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              progress={state.sections[section.id]}
              unlocked={isSectionUnlocked(state, section.id)}
            />
          ))}
        </div>

        {/* Final test */}
        {finalUnlocked && (
          <div className="bg-warm-card border border-warm-border rounded-card p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-ink">Final Test</div>
              <div className="text-[11px] text-faint mt-0.5">
                {finalProgress
                  ? `${finalProgress.attempts.length} attempts`
                  : '6 questions — all sections'}
              </div>
            </div>
            {finalProgress?.status === 'passed' ? (
              <Link
                href="/completion"
                className="text-[12px] font-semibold bg-sage text-white px-3 py-1.5 rounded-full"
              >
                View results
              </Link>
            ) : (
              <Link
                href="/final-test"
                className="text-[12px] font-semibold bg-ink text-warm-card px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
              >
                {finalProgress ? 'Continue' : 'Begin'}
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
