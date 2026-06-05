'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Attempt {
  id: string
  trainee_name: string
  section_name: string
  passed: boolean
  consecutive_clean_runs: number
  submitted_at: string
  questions: {
    questionText: string
    contextText?: string
    answer: string
    pass: boolean
    feedback: string
  }[]
}

export default function AdminResultsPage() {
  const router = useRouter()
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/results')
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) setAttempts(data)
        setLoading(false)
      })
  }, [router])

  if (loading) return null

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="text-[11px] font-bold tracking-widest uppercase text-faint">
            Baseline Training Hub — Admin
          </div>
          <Link href="/" className="text-[12px] font-semibold text-muted hover:text-ink transition-colors">
            ← Back to app
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-ink mb-8">Results</h1>

        {attempts.length === 0 ? (
          <p className="text-sm text-muted">No attempts yet.</p>
        ) : (
          <div className="space-y-2">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="bg-warm-card border border-warm-border rounded-card overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === attempt.id ? null : attempt.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-warm-bg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                        attempt.passed ? 'bg-sage-bg text-sage' : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {attempt.passed ? 'Pass' : 'Fail'}
                    </span>
                    <span className="text-sm font-semibold text-ink truncate">{attempt.trainee_name}</span>
                    <span className="text-sm text-muted truncate">{attempt.section_name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-[11px] text-faint">
                      {new Date(attempt.submitted_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span className="text-faint text-xs">{expanded === attempt.id ? '▲' : '▼'}</span>
                  </div>
                </button>

                {expanded === attempt.id && (
                  <div className="border-t border-warm-border px-4 py-4 space-y-5">
                    {attempt.questions.map((q, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                              q.pass ? 'bg-sage-bg text-sage' : 'bg-red-50 text-red-500'
                            }`}
                          >
                            {q.pass ? 'Pass' : 'Fail'}
                          </span>
                          <span className="text-sm font-semibold text-ink">Question {i + 1}</span>
                        </div>
                        <p className="text-[12px] text-muted mb-1">{q.questionText}</p>
                        {q.contextText && (
                          <p className="text-[12px] text-faint italic mb-2 border-l-2 border-warm-border pl-3">{q.contextText}</p>
                        )}
                        <div className="bg-warm-bg rounded-card px-3 py-2 mb-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-faint mb-1">Their answer</p>
                          <p className="text-[12px] text-ink">{q.answer}</p>
                        </div>
                        <p className="text-[12px] text-muted leading-relaxed">{q.feedback}</p>
                        {i < attempt.questions.length - 1 && (
                          <div className="border-t border-warm-border mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
