'use client'

import { useState, useEffect, useCallback } from 'react'

type Photo = { id: string; url: string }

declare global {
  interface Window {
    JSZip?: new () => {
      file: (name: string, data: Blob) => void
      generateAsync: (opts: { type: 'blob' }) => Promise<Blob>
    }
  }
}

function loadJSZip(): Promise<NonNullable<Window['JSZip']>> {
  if (window.JSZip) return Promise.resolve(window.JSZip)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    s.onload = () => (window.JSZip ? resolve(window.JSZip) : reject(new Error('jszip')))
    s.onerror = () => reject(new Error('jszip'))
    document.head.appendChild(s)
  })
}

function extFromUrl(url: string): string {
  const clean = url.split('?')[0]
  const m = clean.match(/\.([a-zA-Z0-9]{2,5})$/)
  return m ? m[1].toLowerCase() : 'jpg'
}

export default function AlbumGallery({
  photos,
  title,
  downloadUrl,
}: {
  photos: Photo[]
  title: string
  downloadUrl?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [dl, setDl] = useState('')

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  )
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [openIndex, close, prev, next])

  async function downloadAll() {
    if (dl) return
    try {
      const JSZip = await loadJSZip()
      const zip = new JSZip()
      for (let i = 0; i < photos.length; i++) {
        setDl(`Скачиваю ${i + 1} / ${photos.length}…`)
        const res = await fetch(photos[i].url)
        const blob = await res.blob()
        const num = String(i + 1).padStart(2, '0')
        zip.file(`${title}-${num}.${extFromUrl(photos[i].url)}`, blob)
      }
      setDl('Собираю архив…')
      const out = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(out)
      a.download = `${title}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(a.href)
      setDl('')
    } catch {
      setDl('')
      alert('Не удалось скачать архив. Попробуйте ещё раз.')
    }
  }

  if (!photos.length) {
    return (
      <p className="text-center text-gray-500 py-16">В этом альбоме пока нет фотографий.</p>
    )
  }

  return (
    <>
      <div className="flex justify-center mb-10">
        {downloadUrl ? (
          <a className="btn" href={downloadUrl} target="_blank" rel="noreferrer">
            Скачать все фото в хорошем качестве
          </a>
        ) : (
          <button className="btn" onClick={downloadAll} disabled={!!dl}>
            {dl || 'Скачать все фото'}
          </button>
        )}
      </div>

      <div className="gallery-masonry">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            className="ph"
            onClick={() => setOpenIndex(i)}
            aria-label={`Открыть фото ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={`${title} ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          <button
            className="absolute top-5 right-6 text-white/80 hover:text-white text-3xl leading-none"
            onClick={close}
            aria-label="Закрыть"
          >
            ×
          </button>
          {photos.length > 1 && (
            <button
              className="absolute left-4 md:left-8 text-white/70 hover:text-white text-4xl px-3"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Предыдущее"
            >
              ‹
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[openIndex].url}
            alt={`${title} ${openIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {photos.length > 1 && (
            <button
              className="absolute right-4 md:right-8 text-white/70 hover:text-white text-4xl px-3"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Следующее"
            >
              ›
            </button>
          )}
          <div className="absolute bottom-5 left-0 right-0 text-center text-white/60 text-sm tracking-widest">
            {openIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
