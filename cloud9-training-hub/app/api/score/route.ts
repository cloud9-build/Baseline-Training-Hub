import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { ScoreRequest, ScoreResponse } from '@/lib/types'

let client: Anthropic | null = null
function getClient(): Anthropic {
  if (!client) client = new Anthropic()
  return client
}

const SYSTEM_PROMPT = `You are evaluating a CS trainee at Cloud9, a short-term rental hospitality company in Chicago. Your job is to determine whether their answer covers all the required criteria completely. Be specific and honest — if they missed any required element, it is a fail. Do not be lenient. Partial coverage is a fail. Reply ONLY with a valid JSON object in this exact format, no other text:
{"pass": true, "feedback": "specific feedback on what they covered well"}
or
{"pass": false, "feedback": "specific feedback explaining exactly what was covered and exactly what was missing"}
Your feedback must be specific and reference the actual content of their answer. Do not mention AI, Claude, or automated scoring in your feedback. Write feedback as if you are an experienced CS lead reviewing their work.`

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ScoreRequest

    const userMessage = [
      `Question: ${body.questionText}`,
      body.contextText ? `Context shown to trainee: ${body.contextText}` : '',
      `Trainee's answer: ${body.answer}`,
      `Required criteria: ${body.criteria}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const message = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text) as ScoreResponse

    if (typeof parsed.pass !== 'boolean' || typeof parsed.feedback !== 'string') {
      throw new Error('Invalid response shape')
    }

    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(
      { error: 'Scoring failed. Please try submitting again.' },
      { status: 500 }
    )
  }
}
