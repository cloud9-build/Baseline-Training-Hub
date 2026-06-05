'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSectionById } from '@/lib/sections'
import { loadState, saveState, isSectionUnlocked, markQuickReferenceDone } from '@/lib/state'
import { AppState } from '@/lib/types'
import StudyContent from '@/components/StudyContent'

export default function SectionStudyPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setState(loadState())
  }, [])

  if (!mounted || !state) return null

  const section = getSectionById(id)
  if (!section) return <p className="p-8 text-sm text-muted">Section not found.</p>

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

  function handleMarkDone() {
    if (!state) return
    const updated = markQuickReferenceDone(state)
    saveState(updated)
    router.push('/')
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-[12px] font-semibold text-muted hover:text-ink transition-colors">
            ← Back
          </Link>
          <div className="text-[11px] font-bold tracking-widest uppercase text-faint">
            Section {String(section.number).padStart(2, '0')}
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-ink mb-1">{section.title}</h1>
        <p className="text-sm text-muted mb-8">
          {section.hasTest ? 'Study this content before taking the test.' : 'Reference material — read and mark as complete when done.'}
        </p>

        {/* Content */}
        <StudyContent sectionId={id} />

        {/* CTA */}
        <div className="mt-10 flex gap-3">
          {section.hasTest ? (
            <Link
              href={`/test/${id}`}
              className="bg-ink text-warm-card text-sm font-semibold px-6 py-3 rounded-full hover:opacity-80 transition-opacity"
            >
              Start test
            </Link>
          ) : id === 'quick-reference' ? (
            <button
              onClick={handleMarkDone}
              className="bg-ink text-warm-card text-sm font-semibold px-6 py-3 rounded-full hover:opacity-80 transition-opacity"
            >
              Done — mark as complete
            </button>
          ) : null}
          <Link href="/" className="text-sm font-semibold text-muted px-6 py-3 rounded-full border border-warm-border hover:border-ink transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
