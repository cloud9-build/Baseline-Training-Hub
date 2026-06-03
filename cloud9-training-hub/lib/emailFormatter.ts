import { SendResultsRequest } from './types'

export function formatResultsEmail(data: SendResultsRequest): string {
  const { traineeName, sectionName, attempts, passed, consecutiveCleanRuns } = data

  const status = passed
    ? 'Passed'
    : `In Progress — ${consecutiveCleanRuns} of 2 consecutive clean runs achieved`

  const lines: string[] = [
    `Trainee: ${traineeName}`,
    `Section: ${sectionName}`,
    `Date: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`,
    `Status: ${status}`,
    `Total attempts: ${attempts.length}`,
    '',
  ]

  for (const attempt of attempts) {
    lines.push('---')
    lines.push(`ATTEMPT ${attempt.runNumber} — ${attempt.isCleanRun ? 'Clean run ✓' : 'Failed ✗'}`)
    lines.push('')

    attempt.questions.forEach((q, i) => {
      lines.push(`Q${i + 1}: ${q.questionText}`)
      if (q.contextText) {
        lines.push(`Context: ${q.contextText}`)
      }
      lines.push(`Answer: ${q.answer}`)
      lines.push(`Result: ${q.pass ? 'Pass' : 'Fail'}`)
      lines.push(`Feedback: ${q.feedback}`)
      lines.push('')
    })
  }

  return lines.join('\n')
}
