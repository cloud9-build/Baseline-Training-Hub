import { QuestionResult } from '@/lib/types'

interface Props {
  results: QuestionResult[]
  isCleanRun: boolean
  consecutiveCleanRuns: number
  isPassed: boolean
  attemptNumber: number
  onRestart: () => void
  onContinue?: () => void
  onReviewStudy: () => void
}

export default function ResultsView({
  results,
  isCleanRun,
  consecutiveCleanRuns,
  isPassed,
  attemptNumber,
  onRestart,
  onContinue,
  onReviewStudy,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Run status banner */}
      {isPassed ? (
        <div className="bg-sage-bg border border-sage-border rounded-card p-4 flex items-start gap-3">
          <span className="text-sage font-bold text-base">✓</span>
          <div>
            <div className="text-sm font-semibold text-ink">Section passed — well done.</div>
            <div className="text-[12px] text-muted mt-0.5">
              2 consecutive clean runs achieved in {attemptNumber} total attempt{attemptNumber !== 1 ? 's' : ''}.
            </div>
          </div>
        </div>
      ) : isCleanRun ? (
        <div className="bg-sage-bg border border-sage-border rounded-card p-4 flex items-start gap-3">
          <span className="text-sage font-bold text-base">✓</span>
          <div>
            <div className="text-sm font-semibold text-ink">
              Clean run — {consecutiveCleanRuns} of 2 consecutive clean runs achieved
            </div>
            <div className="text-[12px] text-muted mt-0.5">
              One more clean run and this section is passed.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-card p-4 flex items-start gap-3">
          <span className="text-red-400 font-bold text-base">✗</span>
          <div>
            <div className="text-sm font-semibold text-ink">
              Run failed — one or more questions didn&apos;t pass
            </div>
            <div className="text-[12px] text-muted mt-0.5">
              Consecutive clean runs reset to 0. Restart from Question 1.
            </div>
          </div>
        </div>
      )}

      {/* Per-question results */}
      {results.map((result, i) => (
        <div key={i}>
          <div className="flex items-center gap-2.5 mb-2">
            <span
              className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                result.pass ? 'bg-sage-bg text-sage' : 'bg-red-50 text-red-500'
              }`}
            >
              {result.pass ? 'Pass' : 'Fail'}
            </span>
            <span className="text-sm font-semibold text-ink">Question {i + 1}</span>
          </div>
          <p className="text-sm text-muted leading-relaxed">{result.feedback}</p>
          {i < results.length - 1 && <div className="border-t border-warm-border mt-4" />}
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {isPassed && onContinue ? (
          <button
            onClick={onContinue}
            className="bg-ink text-warm-card text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-80 transition-opacity"
          >
            Continue to next section
          </button>
        ) : (
          <>
            <button
              onClick={onRestart}
              className="bg-ink text-warm-card text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-80 transition-opacity"
            >
              Restart from Question 1
            </button>
            <button
              onClick={onReviewStudy}
              className="text-sm font-semibold text-muted px-5 py-2.5 rounded-full border border-warm-border hover:border-ink transition-colors"
            >
              Review study content
            </button>
          </>
        )}
      </div>

      {/* Results sent note */}
      <p className="text-[11px] text-faint">Results sent.</p>
    </div>
  )
}
