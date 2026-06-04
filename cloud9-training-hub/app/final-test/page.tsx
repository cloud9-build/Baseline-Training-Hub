'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { finalTestQuestions } from '@/lib/sections'
import { loadState, saveState, isSectionUnlocked, recordAttempt, FINAL_TEST_ID } from '@/lib/state'
import { AppState, Attempt, Question, QuestionResult, ScoreRequest, ScoreResponse } from '@/lib/types'
import TestQuestion from '@/components/TestQuestion'
import ResultsView from '@/components/ResultsView'

type Phase =
  | { type: 'answering' }
  | { type: 'loading' }
  | { type: 'results'; results: QuestionResult[]; isCleanRun: boolean; consecutiveCleanRuns: number; isPassed: boolean }
  | { type: 'error'; message: string }

export default function FinalTestPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [answers, setAnswers] = useState<string[]>(Array(finalTestQuestions.length).fill(''))
  const [phase, setPhase] = useState<Phase>({ type: 'answering' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setState(loadState())
  }, [])

  if (!mounted || !state) return null

  if (!isSectionUnlocked(state, FINAL_TEST_ID)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-muted mb-4">Complete all sections before taking the final test.</p>
          <Link href="/" className="text-sm font-semibold text-ink underline">Back to home</Link>
        </div>
      </main>
    )
  }

  const finalProgress = state.sections[FINAL_TEST_ID]
  const attemptNumber = (finalProgress?.attempts.length ?? 0) + 1

  // Fix 1: Use `Question` type instead of `typeof finalTestQuestions[0]`
  async function scoreQuestion(q: Question, answer: string): Promise<QuestionResult> {
    const req: ScoreRequest = {
      sectionId: FINAL_TEST_ID,
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
      // Fix 2: Use `answers[i] ?? ''` (not bare `answers[i]`)
      const results = await Promise.all(
        finalTestQuestions.map((q, i) => scoreQuestion(q, answers[i] ?? ''))
      )

      const isCleanRun = results.every((r) => r.pass)
      // Fix 3: Use `loadState() ?? state!` (safe — non-null guard above ensures state is set)
      const currentState = loadState() ?? state!

      // Fix 4: Compute runNumber from currentState inside handleSubmit for accuracy
      const attempt: Attempt = {
        runNumber: (currentState.sections[FINAL_TEST_ID]?.attempts.length ?? 0) + 1,
        isCleanRun,
        timestamp: new Date().toISOString(),
        questions: results,
      }

      const updatedState = recordAttempt(currentState, FINAL_TEST_ID, attempt)
      saveState(updatedState)
      setState(updatedState)

      const newSection = updatedState.sections[FINAL_TEST_ID]
      const consecutiveCleanRuns = newSection.consecutiveCleanRuns
      const isPassed = newSection.status === 'passed'

      fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeName: updatedState.traineeName,
          sectionName: 'Final Test',
          attempts: newSection.attempts,
          passed: isPassed,
          consecutiveCleanRuns,
        }),
      }).catch(() => {})

      setPhase({ type: 'results', results, isCleanRun, consecutiveCleanRuns, isPassed })
    } catch (err) {
      console.error('Final test submission failed:', err)
      setPhase({ type: 'error', message: 'Something went wrong. Please try submitting again.' })
    }
  }

  function handleRestart() {
    setAnswers(Array(finalTestQuestions.length).fill(''))
    setPhase({ type: 'answering' })
  }

  const isAnswering = phase.type === 'answering'
  const isLoading = phase.type === 'loading'

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-[12px] font-semibold text-muted hover:text-ink transition-colors">
            ← Home
          </Link>
          <div className="text-[11px] font-bold tracking-widest uppercase text-faint">
            Final Test
          </div>
        </div>

        <h1 className="text-2xl font-bold text-ink mb-1">Final Test</h1>
        <p className="text-sm text-muted mb-8">
          Attempt {attemptNumber}
          {finalProgress?.consecutiveCleanRuns === 1 ? ' · 1 of 2 consecutive clean runs achieved' : ''}
        </p>

        {phase.type === 'results' && (
          <ResultsView
            results={phase.results}
            isCleanRun={phase.isCleanRun}
            consecutiveCleanRuns={phase.consecutiveCleanRuns}
            isPassed={phase.isPassed}
            attemptNumber={attemptNumber}
            onRestart={handleRestart}
            onContinue={phase.isPassed ? () => router.push('/completion') : undefined}
            onReviewStudy={() => router.push('/')}
          />
        )}

        {phase.type === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-card p-4 mb-6">
            <p className="text-sm text-red-600">{phase.message}</p>
            <button onClick={() => setPhase({ type: 'answering' })} className="text-sm font-semibold text-ink mt-2 underline">
              Try again
            </button>
          </div>
        )}

        {(isAnswering || isLoading) && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {finalTestQuestions.map((q, i) => (
              <div key={q.id}>
                <TestQuestion
                  index={i}
                  questionText={q.questionText}
                  contextText={q.contextText}
                  value={answers[i] ?? ''}
                  onChange={(val) => {
                    setAnswers((prev) => {
                      const updated = [...prev]
                      updated[i] = val
                      return updated
                    })
                  }}
                  disabled={isLoading}
                />
                {i < finalTestQuestions.length - 1 && (
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
