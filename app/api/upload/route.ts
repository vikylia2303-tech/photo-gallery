import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const pwd = (req.headers.get('x-admin-password') || '').trim()
  const expected = (process.env.ADMIN_PASSWORD || '').trim()
  if (!expected || pwd !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file')
  const album = (form.get('album') as string) || 'misc'
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'no file' }, { status: 400 })
  }

  const safeAlbum = album.replace(/[^a-z0-9-]/gi, '-').toLowerCase() || 'misc'
  try {
    const blob = await put(`photos/${safeAlbum}/${Date.now()}.jpg`, file, {
      access: 'public',
      addRandomSuffix: true,
    })
    return NextResponse.json({ url: blob.url })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'upload error' },
      { status: 500 }
    )
  }
}
