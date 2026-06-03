import Link from 'next/link'
import { SectionDef, SectionProgress } from '@/lib/types'

interface Props {
  section: SectionDef
  progress: SectionProgress | undefined
  unlocked: boolean
}

export default function SectionCard({ section, progress, unlocked }: Props) {
  const status = progress?.status ?? 'not-started'
  const attemptCount = progress?.attempts.length ?? 0
  const consecutiveCleanRuns = progress?.consecutiveCleanRuns ?? 0

  const badgeMap: Record<SectionProgress['status'], { label: string; className: string }> = {
    'not-started': { label: 'Not Started', className: 'border border-warm-border text-faint' },
    'in-progress': { label: 'In Progress', className: 'bg-warm-bg text-muted' },
    passed: { label: 'Passed', className: 'bg-sage-bg text-sage' },
  }
  const badge = badgeMap[status]

  return (
    <div
      className={`bg-warm-card border border-warm-border rounded-card p-4 flex items-center gap-4 transition-opacity ${
        !unlocked ? 'opacity-40 pointer-events-none' : ''
      }`}
      aria-hidden={!unlocked}
    >
      <div className="text-[10px] font-bold tracking-widest uppercase text-faint min-w-[28px]">
        {String(section.number).padStart(2, '0')}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink">{section.title}</div>
        {section.hasTest && status !== 'not-started' && (
          <div className="text-[11px] text-faint mt-0.5">
            {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
            {status === 'in-progress' && ` · ${consecutiveCleanRuns} of 2 clean runs`}
          </div>
        )}
        {section.hasTest && status === 'not-started' && (
          <div className="text-[11px] text-faint mt-0.5">
            {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${badge.className}`}
        >
          {badge.label}
        </span>

        <Link
          href={`/section/${section.id}`}
          className="text-[12px] font-semibold text-muted hover:text-ink transition-colors"
        >
          {status === 'passed' ? 'Review' : 'Study'}
        </Link>

        {section.hasTest && unlocked && (
          <Link
            href={`/test/${section.id}`}
            className="text-[12px] font-semibold bg-ink text-warm-card px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
          >
            {status === 'passed' ? 'Retake' : 'Test'}
          </Link>
        )}
      </div>
    </div>
  )
}
