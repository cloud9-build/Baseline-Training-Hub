import { AppState, Attempt, SectionProgress } from './types'

const STORAGE_KEY = 'bth_state'

export const SECTION_ORDER = [
  'before-you-reply',
  'reading-the-message',
  'writing-the-reply',
  'when-youre-not-sure',
  'common-situations',
  'quick-reference',
]

export const FINAL_TEST_ID = 'final-test'

export function loadState(): AppState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AppState) : null
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function initState(traineeName: string): AppState {
  return { traineeName, sections: {} }
}

export function getOrInitSection(state: AppState, sectionId: string): SectionProgress {
  return (
    state.sections[sectionId] ?? {
      status: 'not-started',
      attempts: [],
      consecutiveCleanRuns: 0,
    }
  )
}

export function recordAttempt(state: AppState, sectionId: string, attempt: Attempt): AppState {
  const section = getOrInitSection(state, sectionId)
  const newConsecutive = attempt.isCleanRun ? section.consecutiveCleanRuns + 1 : 0
  const isPassed = newConsecutive >= 2

  const updated: SectionProgress = {
    status: isPassed ? 'passed' : 'in-progress',
    attempts: [...section.attempts, attempt],
    consecutiveCleanRuns: newConsecutive,
  }

  return {
    ...state,
    sections: { ...state.sections, [sectionId]: updated },
  }
}

export function isSectionUnlocked(state: AppState, sectionId: string): boolean {
  const idx = SECTION_ORDER.indexOf(sectionId)
  if (idx === -1) {
    // final-test unlocks when all 6 sections are passed
    return SECTION_ORDER.every(
      (id) => state.sections[id]?.status === 'passed'
    )
  }
  if (idx === 0) return true
  const prev = SECTION_ORDER[idx - 1]
  return state.sections[prev]?.status === 'passed'
}

export function markQuickReferenceDone(state: AppState): AppState {
  const section: SectionProgress = {
    status: 'passed',
    attempts: [],
    consecutiveCleanRuns: 2,
  }
  return {
    ...state,
    sections: { ...state.sections, 'quick-reference': section },
  }
}

export function isAppComplete(state: AppState): boolean {
  return (
    SECTION_ORDER.every((id) => state.sections[id]?.status === 'passed') &&
    state.sections[FINAL_TEST_ID]?.status === 'passed'
  )
}
