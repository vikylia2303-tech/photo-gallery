import { list } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { saveManifest, type Manifest, type Album } from '@/lib/manifest'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const TITLES: Record<string, string> = {
  'dasha-i-dima': 'Даша и Дима',
  anya: 'Аня',
  yuliya: 'Юлия',
  yulia: 'Юлия',
}

function auth(req: NextRequest) {
  const p = (req.headers.get('x-admin-password') || '').trim()
  const e = (process.env.ADMIN_PASSWORD || '').trim()
  return !!e && p === e
}

async function listAll() {
  const blobs: { pathname: string; url: string; size: number }[] = []
  let cursor: string | undefined = undefined
  do {
    const r = await list({ prefix: 'photos/', cursor, limit: 1000 })
    for (const b of r.blobs) blobs.push({ pathname: b.pathname, url: b.url, size: b.size || 0 })
    cursor = r.cursor
  } while (cursor)
  return blobs
}

function genKey() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
}

function uid() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  )
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const blobs = await listAll()
  const folders: Record<string, number> = {}
  for (const b of blobs) {
    const slug = b.pathname.split('/')[1] || '(root)'
    folders[slug] = (folders[slug] || 0) + 1
  }
  return NextResponse.json({ total: blobs.length, folders })
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    const blobs = await listAll()
    const groups: Record<string, { pathname: string; url: string }[]> = {}
    for (const b of blobs) {
      const slug = b.pathname.split('/')[1]
      if (!slug) continue
      ;(groups[slug] = groups[slug] || []).push(b)
    }
    const albums: Album[] = []
    let aboutPhoto: string | undefined
    for (const slug of Object.keys(groups)) {
      const items = groups[slug].sort((a, b) => a.pathname.localeCompare(b.pathname))
      if (slug === 'about') {
        aboutPhoto = items[items.length - 1]?.url
        continue
      }
      albums.push({
        slug,
        title: TITLES[slug] || slug.replace(/-/g, ' '),
        photos: items.map((b) => ({ id: uid(), url: b.url })),
        public: false,
        privateKey: genKey(),
      })
    }
    const manifest: Manifest = { albums }
    if (aboutPhoto) manifest.aboutPhoto = aboutPhoto
    await saveManifest(manifest)
    return NextResponse.json({
      restored: albums.map((a) => ({ slug: a.slug, title: a.title, photos: a.photos.length })),
      aboutPhoto: !!aboutPhoto,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'restore error' },
      { status: 500 }
    )
  }
}
