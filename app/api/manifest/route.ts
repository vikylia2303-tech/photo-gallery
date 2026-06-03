import { NextRequest, NextResponse } from 'next/server'
import { getManifest, saveManifest, type Manifest } from '@/lib/manifest'

export const dynamic = 'force-dynamic'

export async function GET() {
  const manifest = await getManifest()
  return NextResponse.json(manifest)
}

export async function POST(req: NextRequest) {
  const pwd = req.headers.get('x-admin-password')
  if (!process.env.ADMIN_PASSWORD || pwd !== process.env.ADMIN_PASSWORD) {
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
