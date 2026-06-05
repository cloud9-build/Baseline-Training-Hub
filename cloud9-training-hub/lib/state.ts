import { AppState, Attempt, SectionProgress } from './types'

const CURRENT_USER_KEY = 'bth_current_user'

function storageKey(name: string): string {
  return `bth_${name.toLowerCase().replace(/\s+/g, '_')}`
}

export const SECTION_ORDER = [
  'before-you-reply',
  'reading-the-message',
  'writing-the-reply',
  'when-youre-not-sure',
  'common-situations',
  'quick-reference',
]

export const FINAL_TEST_ID = 'final-test'

export function getCurrentUserName(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_USER_KEY)
}

export function setCurrentUserName(name: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CURRENT_USER_KEY, name)
}

export function loadStateForName(name: string): AppState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(storageKey(name))
    return raw ? (JSON.parse(raw) as AppState) : null
  } catch {
    return null
  }
}

export function loadState(): AppState | null {
  const name = getCurrentUserName()
  if (!name) return null
  return loadStateForName(name)
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey(state.traineeName), JSON.stringify(state))
  } catch {
    // Storage quota exceeded — state not persisted
  }
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
  const isPassed = newConsecutive >= 1

  const updated: SectionProgress = {
    status: (isPassed || section.status === 'passed') ? 'passed' : 'in-progress',
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
    return SECTION_ORDER.every(
      (id) => state.sections[id]?.status === 'passed'
    )
  }
  if (idx === 0) return true
  const prev = SECTION_ORDER[idx - 1]
  return state.sections[prev]?.status === 'passed'
}

export function markQuickReferenceDone(state: AppState): AppState {
  const quickRefId = SECTION_ORDER[SECTION_ORDER.length - 1]
  const section: SectionProgress = {
    status: 'passed',
    attempts: [],
    consecutiveCleanRuns: 1,
  }
  return {
    ...state,
    sections: { ...state.sections, [quickRefId]: section },
  }
}

export function isAppComplete(state: AppState): boolean {
  return (
    SECTION_ORDER.every((id) => state.sections[id]?.status === 'passed') &&
    state.sections[FINAL_TEST_ID]?.status === 'passed'
  )
}
