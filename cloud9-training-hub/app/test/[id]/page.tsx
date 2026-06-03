'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSectionById } from '@/lib/sections'
import { loadState, saveState, isSectionUnlocked, recordAttempt, SECTION_ORDER } from '@/lib/state'
import { AppState, Attempt, Question, QuestionResult, ScoreRequest, ScoreResponse } from '@/lib/types'
import TestQuestion from '@/components/TestQuestion'
import ResultsView from '@/components/ResultsView'

type Phase =
  | { type: 'answering' }
  | { type: 'loading' }
  | { type: 'results'; results: QuestionResult[]; isCleanRun: boolean; consecutiveCleanRuns: number; isPassed: boolean }
  | { type: 'error'; message: string }

export default function TestPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>({ type: 'answering' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const s = loadState()
    setState(s)
  }, [])

  const sectionMaybe = getSectionById(id)

  useEffect(() => {
    if (sectionMaybe) {
      setAnswers(Array(sectionMaybe.questions.length).fill(''))
    }
  }, [id])

  if (!mounted || !state) return null
  if (!sectionMaybe) return <p className="p-8 text-sm text-muted">Section not found.</p>
  if (!isSectionUnlocked(state, id)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-muted mb-4">This section is locked.</p>
          <Link href="/" className="text-sm font-semibold text-ink underline">Back to home</Link>
        </div>
      </main>
    )
  }

  // Narrowed local const — TypeScript now treats `section` as non-nullable in all closures below
  const section = sectionMaybe

  const sectionProgress = state.sections[id]
  const attemptNumber = (sectionProgress?.attempts.length ?? 0) + 1

  async function scoreQuestion(q: Question, answer: string): Promise<QuestionResult> {
    const req: ScoreRequest = {
      sectionId: id,
      questionText: q.questionText,
      contextText: q.contextText,
      answer,
      criteria: q.criteria,
    }
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
    if (!res.ok) throw new Error('Scoring failed')
    const data = (await res.json()) as ScoreResponse
    return {
      questionText: q.questionText,
      contextText: q.contextText,
      answer,
      pass: data.pass,
      feedback: data.feedback,
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPhase({ type: 'loading' })

    try {
      // Score all questions in parallel
      const results = await Promise.all(
        section.questions.map((q, i) => scoreQuestion(q, answers[i] ?? ''))
      )

      const isCleanRun = results.every((r) => r.pass)
      const currentState = loadState() ?? state!

      const attempt: Attempt = {
        runNumber: (currentState.sections[id]?.attempts.length ?? 0) + 1,
        isCleanRun,
        timestamp: new Date().toISOString(),
        questions: results,
      }

      const updatedState = recordAttempt(currentState, id, attempt)
      saveState(updatedState)
      setState(updatedState)

      const newSection = updatedState.sections[id]
      const consecutiveCleanRuns = newSection.consecutiveCleanRuns
      const isPassed = newSection.status === 'passed'

      // Send results in background — do not await
      fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeName: updatedState.traineeName,
          sectionName: section.title,
          attempts: newSection.attempts,
          passed: isPassed,
          consecutiveCleanRuns,
        }),
      }).catch(() => {/* silent fail — results already saved locally */})

      setPhase({ type: 'results', results, isCleanRun, consecutiveCleanRuns, isPassed })
    } catch {
      setPhase({ type: 'error', message: 'Something went wrong. Please try submitting again.' })
    }
  }

  function handleRestart() {
    setAnswers(Array(section.questions.length).fill(''))
    setPhase({ type: 'answering' })
  }

  function handleContinue() {
    const currentIdx = SECTION_ORDER.indexOf(id)
    if (currentIdx >= 0 && currentIdx < SECTION_ORDER.length - 1) {
      router.push(`/section/${SECTION_ORDER[currentIdx + 1]}`)
    } else {
      router.push('/')
    }
  }

  const isAnswering = phase.type === 'answering'
  const isLoading = phase.type === 'loading'

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/section/${id}`} className="text-[12px] font-semibold text-muted hover:text-ink transition-colors">
            ← Study content
          </Link>
          <div className="text-[11px] font-bold tracking-widest uppercase text-faint">
            Section {String(section.number).padStart(2, '0')} · Test
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-ink mb-1">{section.title}</h1>
        <p className="text-sm text-muted mb-8">
          Attempt {attemptNumber}
          {sectionProgress?.consecutiveCleanRuns === 1 ? ' · 1 of 2 consecutive clean runs achieved' : ''}
        </p>

        {/* Results view */}
        {phase.type === 'results' && (
          <ResultsView
            results={phase.results}
            isCleanRun={phase.isCleanRun}
            consecutiveCleanRuns={phase.consecutiveCleanRuns}
            isPassed={phase.isPassed}
            attemptNumber={attemptNumber}
            onRestart={handleRestart}
            onContinue={phase.isPassed ? handleContinue : undefined}
            onReviewStudy={() => router.push(`/section/${id}`)}
          />
        )}

        {/* Error */}
        {phase.type === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-card p-4 mb-6">
            <p className="text-sm text-red-600">{phase.message}</p>
            <button
              onClick={() => setPhase({ type: 'answering' })}
              className="text-sm font-semibold text-ink mt-2 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Questions */}
        {(isAnswering || isLoading) && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {section.questions.map((q, i) => (
              <div key={q.id}>
                <TestQuestion
                  index={i}
                  questionText={q.questionText}
                  contextText={q.contextText}
                  value={answers[i] ?? ''}
                  onChange={(val) => {
                    const updated = [...answers]
                    updated[i] = val
                    setAnswers(updated)
                  }}
                  disabled={isLoading}
                />
                {i < section.questions.length - 1 && (
                  <div className="border-t border-warm-border mt-8" />
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <span className="text-[11px] text-faint">Attempt {attemptNumber}</span>
              <button
                type="submit"
                disabled={isLoading || answers.some((a) => !a.trim())}
                className="bg-ink text-warm-card text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Checking your answers…' : 'Submit answers'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
