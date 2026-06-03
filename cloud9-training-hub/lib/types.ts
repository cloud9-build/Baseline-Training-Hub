export interface QuestionResult {
  questionText: string
  contextText?: string
  answer: string
  pass: boolean
  feedback: string
}

export interface Attempt {
  runNumber: number
  isCleanRun: boolean
  timestamp: string
  questions: QuestionResult[]
}

export interface SectionProgress {
  status: 'not-started' | 'in-progress' | 'passed'
  attempts: Attempt[]
  consecutiveCleanRuns: number
}

export interface AppState {
  traineeName: string
  sections: Record<string, SectionProgress>
}

export interface Question {
  id: string
  questionText: string
  contextText?: string
  criteria: string
}

export interface SectionDef {
  id: string
  number: number
  title: string
  hasTest: boolean
  questions: Question[]
}

export interface ScoreRequest {
  sectionId: string
  questionText: string
  contextText?: string
  answer: string
  criteria: string
}

export interface ScoreResponse {
  pass: boolean
  feedback: string
}

export interface SendResultsRequest {
  traineeName: string
  sectionName: string
  attempts: Attempt[]
  passed: boolean
  consecutiveCleanRuns: number
}
