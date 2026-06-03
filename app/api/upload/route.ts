import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const pwd = req.headers.get('x-admin-password')
  if (!process.env.ADMIN_PASSWORD || pwd !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file')
  const album = (form.get('album') as string) || 'misc'
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'no file' }, { status: 400 })
  }

  const safeAlbum = album.replace(/[^a-z0-9-]/gi, '-').toLowerCase() || 'misc'
  const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, '_')
  const blob = await put(`photos/${safeAlbum}/${Date.now()}-${safeName}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url })
}
