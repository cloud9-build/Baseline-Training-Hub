import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { SendResultsRequest } from '@/lib/types'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[send-results] Supabase is not configured')
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
  }

  try {
    const body = (await req.json()) as SendResultsRequest
    const { traineeName, sectionName, passed, consecutiveCleanRuns, attempts } = body

    const { error } = await getSupabase().from('attempts').insert({
      trainee_name: traineeName,
      section_name: sectionName,
      passed,
      consecutive_clean_runs: consecutiveCleanRuns,
      questions: attempts[attempts.length - 1]?.questions ?? [],
    })

    if (error) {
      console.error('[send-results] Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[send-results] Error:', err)
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
  }
}
