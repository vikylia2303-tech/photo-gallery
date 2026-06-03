import { NextRequest, NextResponse } from 'next/server'
import { getManifest, saveManifest, type Manifest } from '@/lib/manifest'

export const dynamic = 'force-dynamic'

export async function GET() {
  const manifest = await getManifest()
  return NextResponse.json({ ...manifest, hasAdminPwd: !!process.env.ADMIN_PASSWORD })
}

export async function POST(req: NextRequest) {
  const pwd = (req.headers.get('x-admin-password') || '').trim()
  const expected = (process.env.ADMIN_PASSWORD || '').trim()
  if (!expected || pwd !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  let body: Manifest
  try {
    body = (await req.json()) as Manifest
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }
  if (!body || !Array.isArray(body.albums)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  await saveManifest(body)
  return NextResponse.json({ ok: true })
}
