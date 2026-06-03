'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  filename: string
  order: number
}

interface PhotoSession {
  id: string
  name: string
  description?: string
  photosCount: number
  photos: Photo[]
}

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [paramsResolved, setParamsResolved] = useState<{ id: string } | null>(null)
  const [session, setSession] = useState<PhotoSession | null>(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(setParamsResolved)
  }, [params])

  useEffect(() => {
    if (!paramsResolved) return

    async function fetchSession() {
      try {
        const response = await fetch(`/api/sessions/${paramsResolved.id}`)
        if (response.ok) {
          const data = await response.json()
          setSession(data)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [paramsResolved])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Фотосессия не найдена</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-100 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">{session.name}</h1>
          {session.description && (
            <p className="text-xl text-gray-600">{session.description}</p>
          )}
          <div className="mt-4 text-gray-500">
            {session.photosCount} фотографий
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {session.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {session.photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                  Фото #{index + 1}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded">
                    Просмотр
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            В этой сессии еще нет фотографий
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
          >
            ×
          </button>

          <div className="flex items-center justify-center w-full h-full">
            <button
              onClick={() =>
                setSelectedPhotoIndex(
                  selectedPhotoIndex === 0
                    ? session.photos.length - 1
                    : selectedPhotoIndex - 1
                )
              }
              className="absolute left-4 text-white text-4xl hover:text-gray-300"
            >
              ‹
            </button>

            <div className="flex flex-col items-center max-w-4xl max-h-[90vh]">
              <div className="w-full h-[80vh] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                <div className="text-white text-center">
                  <div className="text-lg mb-4">
                    Фото #{selectedPhotoIndex + 1}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedPhotoIndex + 1} из {session.photos.length}
                  </div>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex gap-2 flex-wrap justify-center mb-4 max-w-2xl">
                {session.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === selectedPhotoIndex
                        ? 'bg-white'
                        : 'bg-gray-600 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Info */}
              <div className="text-white text-center text-sm text-gray-400">
                Используйте стрелки для навигации или нажмите на точки выше
              </div>
            </div>

            <button
              onClick={() =>
                setSelectedPhotoIndex(
                  selectedPhotoIndex === session.photos.length - 1
                    ? 0
                    : selectedPhotoIndex + 1
                )
              }
              className="absolute right-4 text-white text-4xl hover:text-gray-300"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
