'use client'

import { useState, useEffect, useCallback } from 'react'

type Photo = { id: string; url: string }

export default function AlbumGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

  if (!photos.length) {
    return (
      <p className="text-center text-gray-500 py-16">В этом альбоме пока нет фотографий.</p>
    )
  }

  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            className="photo-item"
            onClick={() => setOpenIndex(i)}
            aria-label={`Открыть фото ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={`${title} ${i + 1}`} />
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
