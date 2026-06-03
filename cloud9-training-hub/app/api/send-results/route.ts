import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { SendResultsRequest } from '@/lib/types'
import { formatResultsEmail } from '@/lib/emailFormatter'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as SendResultsRequest
    const { traineeName, sectionName, passed } = body

    const subject = `${traineeName} — ${sectionName} — ${passed ? 'Passed' : 'In Progress'}`
    const text = formatResultsEmail(body)

    await resend.emails.send({
      from: 'training@yourdomain.com',
      to: process.env.SEND_TO_EMAIL!,
      subject,
      text,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send results' }, { status: 500 })
  }
}
