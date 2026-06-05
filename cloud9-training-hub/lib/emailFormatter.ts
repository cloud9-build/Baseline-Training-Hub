import { SendResultsRequest } from './types'

export function formatResultsEmail(data: SendResultsRequest): string {
  const { traineeName, sectionName, attempts, passed, consecutiveCleanRuns } = data

  const status = passed
    ? 'Passed'
    : `In Progress — ${consecutiveCleanRuns > 0 ? '1 clean run achieved' : '0 clean runs achieved'}`

  const latestTimestamp = attempts[attempts.length - 1]?.timestamp
  const dateStr = latestTimestamp
    ? new Date(latestTimestamp).toLocaleString('en-US', { timeZone: 'America/Chicago' })
    : new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })

  const lines: string[] = [
    `Trainee: ${traineeName}`,
    `Section: ${sectionName}`,
    `Date: ${dateStr}`,
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
