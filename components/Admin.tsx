'use client'

import { useState, useEffect, useRef } from 'react'
import { upload } from '@vercel/blob/client'

async function resizeImage(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file)
    const max = 2200
    let w = bmp.width
    let h = bmp.height
    if (w > max || h > max) {
      const r = Math.min(max / w, max / h)
      w = Math.round(w * r)
      h = Math.round(h * r)
    }
    const cv = document.createElement('canvas')
    cv.width = w
    cv.height = h
    const ctx = cv.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bmp, 0, 0, w, h)
    return await new Promise<Blob>((res) =>
      cv.toBlob((b) => res(b || file), 'image/jpeg', 0.85)
    )
  } catch {
    return file
  }
}

type Photo = { id: string; url: string }
type Album = { slug: string; title: string; photos: Photo[] }
type Manifest = { albums: Album[] }

function slugify(s: string) {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return (
    s
      .toLowerCase()
      .split('')
      .map((ch) => (map[ch] !== undefined ? map[ch] : ch))
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'album-' + Date.now()
  )
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [manifest, setManifest] = useState<Manifest>({ albums: [] })
  const [selected, setSelected] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const dragIndex = useRef<number | null>(null)

  useEffect(() => {
    if (status) {
      const t = setTimeout(() => setStatus(''), 2500)
      return () => clearTimeout(t)
    }
  }, [status])

  async function save(next: Manifest) {
    setManifest(next)
    const res = await fetch('/api/manifest', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(next),
    })
    if (res.ok) {
      setStatus('Сохранено')
    } else {
      setError('Не удалось сохранить (проверьте пароль)')
    }
  }

  async function login() {
    setError('')
    const res = await fetch('/api/manifest')
    const data = (await res.json()) as Manifest
    const m: Manifest = data && Array.isArray(data.albums) ? data : { albums: [] }
    // verify password with a no-op save
    const check = await fetch('/api/manifest', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(m),
    })
    if (!check.ok) {
      setError('Неверный пароль')
      return
    }
    setManifest(m)
    setAuthed(true)
    if (m.albums[0]) setSelected(m.albums[0].slug)
  }

  function createAlbum() {
    const title = newTitle.trim()
    if (!title) return
    let slug = slugify(title)
    while (manifest.albums.some((a) => a.slug === slug)) slug = slug + '-2'
    const next = { albums: [...manifest.albums, { slug, title, photos: [] }] }
    setNewTitle('')
    setSelected(slug)
    save(next)
  }

  function deleteAlbum(slug: string) {
    if (!confirm('Удалить альбом целиком?')) return
    const next = { albums: manifest.albums.filter((a) => a.slug !== slug) }
    if (selected === slug) setSelected(next.albums[0]?.slug ?? null)
    save(next)
  }

  const current = manifest.albums.find((a) => a.slug === selected) || null

  function updateCurrentPhotos(photos: Photo[]) {
    if (!current) return
    const next = {
      albums: manifest.albums.map((a) => (a.slug === current.slug ? { ...a, photos } : a)),
    }
    save(next)
  }

  async function onFiles(files: FileList | null) {
    if (!files || !current) return
    setUploading(true)
    setError('')
    const added: Photo[] = []
    for (const file of Array.from(files)) {
      try {
        const data = await resizeImage(file)
        const blob = await upload(
          `photos/${current.slug}/${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`,
          data,
          {
            access: 'public',
            handleUploadUrl: '/api/upload',
            clientPayload: password,
          }
        )
        added.push({ id: (crypto as Crypto).randomUUID(), url: blob.url })
      } catch {
        setError('Ошибка загрузки файла')
      }
    }
    if (added.length) updateCurrentPhotos([...current.photos, ...added])
    setUploading(false)
  }

  function removePhoto(id: string) {
    if (!current) return
    updateCurrentPhotos(current.photos.filter((p) => p.id !== id))
  }

  function move(from: number, to: number) {
    if (!current) return
    if (to < 0 || to >= current.photos.length) return
    const arr = [...current.photos]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    updateCurrentPhotos(arr)
  }

  if (!authed) {
    return (
      <div className="container-narrow py-32">
        <h1 className="section-title text-4xl mb-8 text-center">Админ-панель</h1>
        <div className="max-w-sm mx-auto flex flex-col gap-4">
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            className="border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
          <button className="btn btn-primary" onClick={login}>Войти</button>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="section-title text-4xl">Альбомы</h1>
        {status && <span className="text-sm text-green-600">{status}</span>}
      </div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex flex-col md:flex-row gap-10">
        {/* Albums sidebar */}
        <aside className="md:w-64 shrink-0">
          <div className="flex gap-2 mb-4">
            <input
              placeholder="Новая фотосессия"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createAlbum()}
              className="border border-gray-300 px-3 py-2 w-full outline-none focus:border-black text-sm"
            />
            <button className="btn px-4 py-2" onClick={createAlbum}>+</button>
          </div>
          <ul className="space-y-1">
            {manifest.albums.map((a) => (
              <li key={a.slug}>
                <button
                  className={`w-full text-left px-3 py-2 text-sm flex justify-between items-center ${
                    selected === a.slug ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelected(a.slug)}
                >
                  <span>{a.title}</span>
                  <span className="text-gray-400 text-xs">{a.photos.length}</span>
                </button>
              </li>
            ))}
            {manifest.albums.length === 0 && (
              <li className="text-sm text-gray-400 px-3 py-2">Альбомов пока нет</li>
            )}
          </ul>
        </aside>

        {/* Album editor */}
        <div className="flex-1">
          {!current ? (
            <p className="text-gray-500">Выберите альбом или создайте новый слева.</p>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">{current.title}</h2>
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => deleteAlbum(current.slug)}
                >
                  Удалить альбом
                </button>
              </div>

              <label className="btn btn-primary inline-block mb-2 cursor-pointer">
                {uploading ? 'Загрузка…' : 'Загрузить фото'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => onFiles(e.target.files)}
                />
              </label>
              <p className="text-xs text-gray-400 mb-8">
                Можно выбрать сразу несколько. Перетаскивайте фото, чтобы менять порядок.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {current.photos.map((photo, i) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={() => (dragIndex.current = i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex.current !== null) move(dragIndex.current, i)
                      dragIndex.current = null
                    }}
                    className="relative group border border-gray-100 bg-gray-50 aspect-square overflow-hidden cursor-move"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 rounded">{i + 1}</span>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 opacity-0 group-hover:opacity-100 transition">
                      <button className="text-white px-2 py-1 text-sm" onClick={() => move(i, i - 1)} aria-label="Влево">‹</button>
                      <button className="text-white px-2 py-1 text-xs" onClick={() => removePhoto(photo.id)} aria-label="Удалить">✕</button>
                      <button className="text-white px-2 py-1 text-sm" onClick={() => move(i, i + 1)} aria-label="Вправо">›</button>
                    </div>
                  </div>
                ))}
              </div>
              {current.photos.length === 0 && (
                <p className="text-gray-400 text-sm">В альбоме пока нет фото — загрузите первые.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
