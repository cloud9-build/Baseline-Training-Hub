import { formatResultsEmail } from '../emailFormatter'
import { Attempt } from '../types'

const attempt: Attempt = {
  runNumber: 1,
  isCleanRun: false,
  timestamp: '2026-06-03T10:00:00.000Z',
  questions: [
    {
      questionText: 'Walk me through everything you check.',
      contextText: undefined,
      answer: 'I check the dates and guest count.',
      pass: false,
      feedback: 'Missing payout check and message type logic.',
    },
  ],
}

it('includes trainee name and section in output', () => {
  const result = formatResultsEmail({
    traineeName: 'Jordan',
    sectionName: 'Before You Reply',
    attempts: [attempt],
    passed: false,
    consecutiveCleanRuns: 0,
  })
  expect(result).toContain('Jordan')
  expect(result).toContain('Before You Reply')
})

it('marks failed attempt correctly', () => {
  const result = formatResultsEmail({
    traineeName: 'Jordan',
    sectionName: 'Before You Reply',
    attempts: [attempt],
    passed: false,
    consecutiveCleanRuns: 0,
  })
  expect(result).toContain('Failed ✗')
})

it('includes question text and answer', () => {
  const result = formatResultsEmail({
    traineeName: 'Jordan',
    sectionName: 'Before You Reply',
    attempts: [attempt],
    passed: false,
    consecutiveCleanRuns: 0,
  })
  expect(result).toContain('Walk me through everything you check.')
  expect(result).toContain('I check the dates and guest count.')
})

it('includes context text when present', () => {
  const attemptWithContext: Attempt = {
    ...attempt,
    questions: [
      {
        ...attempt.questions[0],
        contextText: 'Guest message: Hi, is parking available?',
      },
    ],
  }
  const result = formatResultsEmail({
    traineeName: 'Jordan',
    sectionName: 'Before You Reply',
    attempts: [attemptWithContext],
    passed: false,
    consecutiveCleanRuns: 0,
  })
  expect(result).toContain('Guest message: Hi, is parking available?')
})
