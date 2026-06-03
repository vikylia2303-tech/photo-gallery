import { list, del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { getManifest } from '@/lib/manifest'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const pwd = (req.headers.get('x-admin-password') || '').trim()
  const expected = (process.env.ADMIN_PASSWORD || '').trim()
  if (!expected || pwd !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const manifest = await getManifest()
    const keep = new Set<string>()
    for (const a of manifest.albums) {
      for (const p of a.photos) keep.add(p.url)
    }

    const toDelete: string[] = []
    let cursor: string | undefined = undefined
    do {
      const res = await list({ prefix: 'photos/', cursor, limit: 1000 })
      for (const b of res.blobs) {
        if (!keep.has(b.url)) toDelete.push(b.url)
      }
      cursor = res.cursor
    } while (cursor)

    let deleted = 0
    for (let i = 0; i < toDelete.length; i += 100) {
      const batch = toDelete.slice(i, i + 100)
      await del(batch)
      deleted += batch.length
    }
    return NextResponse.json({ deleted, kept: keep.size })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'cleanup error' },
      { status: 500 }
    )
  }
}
