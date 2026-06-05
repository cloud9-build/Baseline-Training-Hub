import {
  loadState,
  saveState,
  initState,
  getOrInitSection,
  recordAttempt,
  isSectionUnlocked,
  markQuickReferenceDone,
  isAppComplete,
  getCurrentUserName,
  setCurrentUserName,
  loadStateForName,
  SECTION_ORDER,
  FINAL_TEST_ID,
} from '../state'
import { Attempt, AppState } from '../types'

const mockAttempt = (isCleanRun: boolean, runNumber: number): Attempt => ({
  runNumber,
  isCleanRun,
  timestamp: new Date().toISOString(),
  questions: [],
})

beforeEach(() => {
  localStorage.clear()
})

describe('getCurrentUserName / setCurrentUserName', () => {
  it('returns null when no user set', () => {
    expect(getCurrentUserName()).toBeNull()
  })

  it('returns the name after setting', () => {
    setCurrentUserName('Jordan')
    expect(getCurrentUserName()).toBe('Jordan')
  })
})

describe('loadStateForName', () => {
  it('returns null when no state stored for name', () => {
    expect(loadStateForName('Jordan')).toBeNull()
  })

  it('returns stored state for matching name', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    saveState(state)
    expect(loadStateForName('Jordan')).toEqual(state)
  })

  it('isolates state between different users', () => {
    const j: AppState = { traineeName: 'Jordan', sections: {} }
    const a: AppState = { traineeName: 'Alex', sections: {} }
    saveState(j)
    saveState(a)
    expect(loadStateForName('Jordan')).toEqual(j)
    expect(loadStateForName('Alex')).toEqual(a)
  })
})

describe('loadState / saveState', () => {
  it('returns null when no current user is set', () => {
    expect(loadState()).toBeNull()
  })

  it('round-trips state through localStorage for current user', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    saveState(state)
    setCurrentUserName('Jordan')
    expect(loadState()).toEqual(state)
  })
})

describe('getOrInitSection', () => {
  it('returns default section progress for new section', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    const section = getOrInitSection(state, 'before-you-reply')
    expect(section.status).toBe('not-started')
    expect(section.attempts).toHaveLength(0)
    expect(section.consecutiveCleanRuns).toBe(0)
  })
})

describe('recordAttempt', () => {
  it('increments consecutiveCleanRuns on clean run', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    const updated = recordAttempt(state, 'before-you-reply', mockAttempt(true, 1))
    expect(updated.sections['before-you-reply'].consecutiveCleanRuns).toBe(1)
  })

  it('resets consecutiveCleanRuns on failed run', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    state = recordAttempt(state, 'before-you-reply', mockAttempt(true, 1))
    state = recordAttempt(state, 'before-you-reply', mockAttempt(false, 2))
    expect(state.sections['before-you-reply'].consecutiveCleanRuns).toBe(0)
  })

  it('sets status to passed after one clean run', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    state = recordAttempt(state, 'before-you-reply', mockAttempt(true, 1))
    expect(state.sections['before-you-reply'].status).toBe('passed')
    expect(state.sections['before-you-reply'].consecutiveCleanRuns).toBe(1)
  })

  it('does not pass section on a failed run', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    state = recordAttempt(state, 'before-you-reply', mockAttempt(false, 1))
    expect(state.sections['before-you-reply'].status).toBe('in-progress')
  })

  it('stores all attempts in history', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    state = recordAttempt(state, 'before-you-reply', mockAttempt(false, 1))
    state = recordAttempt(state, 'before-you-reply', mockAttempt(true, 2))
    expect(state.sections['before-you-reply'].attempts).toHaveLength(2)
  })

  it('preserves passed status on retake after passing', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    state = recordAttempt(state, 'before-you-reply', mockAttempt(true, 1))
    state = recordAttempt(state, 'before-you-reply', mockAttempt(true, 2))
    expect(state.sections['before-you-reply'].status).toBe('passed')
    // Retake with a failed run — should not un-pass the section
    state = recordAttempt(state, 'before-you-reply', mockAttempt(false, 3))
    expect(state.sections['before-you-reply'].status).toBe('passed')
  })
})

describe('isSectionUnlocked', () => {
  it('unlocks the first section always', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    expect(isSectionUnlocked(state, SECTION_ORDER[0])).toBe(true)
  })

  it('locks second section if first is not passed', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    expect(isSectionUnlocked(state, SECTION_ORDER[1])).toBe(false)
  })

  it('unlocks second section when first is passed', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    state = recordAttempt(state, SECTION_ORDER[0], mockAttempt(true, 1))
    state = recordAttempt(state, SECTION_ORDER[0], mockAttempt(true, 2))
    expect(isSectionUnlocked(state, SECTION_ORDER[1])).toBe(true)
  })
})

describe('initState', () => {
  it('returns state with given name and empty sections', () => {
    const state = initState('Jordan')
    expect(state.traineeName).toBe('Jordan')
    expect(state.sections).toEqual({})
  })
})

describe('markQuickReferenceDone', () => {
  it('marks quick-reference as passed', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    const updated = markQuickReferenceDone(state)
    expect(updated.sections['quick-reference'].status).toBe('passed')
  })

  it('does not affect other sections', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    state = recordAttempt(state, 'before-you-reply', mockAttempt(true, 1))
    state = recordAttempt(state, 'before-you-reply', mockAttempt(true, 2))
    const updated = markQuickReferenceDone(state)
    expect(updated.sections['before-you-reply'].status).toBe('passed')
  })
})

describe('isAppComplete', () => {
  it('returns false when no sections are passed', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    expect(isAppComplete(state)).toBe(false)
  })

  it('returns false when all 6 sections passed but final-test not passed', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    for (const id of SECTION_ORDER) {
      state = recordAttempt(state, id, mockAttempt(true, 1))
      state = recordAttempt(state, id, mockAttempt(true, 2))
    }
    expect(isAppComplete(state)).toBe(false)
  })

  it('returns true when all 6 sections and final-test are passed', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    for (const id of [...SECTION_ORDER, FINAL_TEST_ID]) {
      state = recordAttempt(state, id, mockAttempt(true, 1))
      state = recordAttempt(state, id, mockAttempt(true, 2))
    }
    expect(isAppComplete(state)).toBe(true)
  })
})

describe('isSectionUnlocked — final test', () => {
  it('locks final-test when not all sections are passed', () => {
    const state: AppState = { traineeName: 'Jordan', sections: {} }
    expect(isSectionUnlocked(state, FINAL_TEST_ID)).toBe(false)
  })

  it('unlocks final-test when all 6 sections are passed', () => {
    let state: AppState = { traineeName: 'Jordan', sections: {} }
    for (const id of SECTION_ORDER) {
      state = recordAttempt(state, id, mockAttempt(true, 1))
      state = recordAttempt(state, id, mockAttempt(true, 2))
    }
    expect(isSectionUnlocked(state, FINAL_TEST_ID)).toBe(true)
  })
})
