import { list, put } from '@vercel/blob'

const MANIFEST_PATH = 'manifest.json'

export type Photo = { id: string; url: string }
export type Album = { slug: string; title: string; photos: Photo[]; public?: boolean; downloadUrl?: string }
export type Manifest = { albums: Album[] }

const EMPTY: Manifest = { albums: [] }

export async function getManifest(): Promise<Manifest> {
  try {
    const { blobs } = await list({ prefix: MANIFEST_PATH })
    const blob = blobs.find((b) => b.pathname === MANIFEST_PATH)
    if (!blob) return EMPTY
    const res = await fetch(`${blob.url}?ts=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return EMPTY
    const data = (await res.json()) as Manifest
    if (!data || !Array.isArray(data.albums)) return EMPTY
    return data
  } catch {
    return EMPTY
  }
}

export async function saveManifest(manifest: Manifest): Promise<void> {
  await put(MANIFEST_PATH, JSON.stringify(manifest), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  })
}
