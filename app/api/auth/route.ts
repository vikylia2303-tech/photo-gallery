import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const pwd = (req.headers.get('x-admin-password') || '').trim()
  const expected = (process.env.ADMIN_PASSWORD || '').trim()
  if (!expected || pwd !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
