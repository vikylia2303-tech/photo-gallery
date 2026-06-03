'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PhotoSession {
  id: string
  name: string
  description?: string
  photosCount: number
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<PhotoSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch('/api/sessions')
        const data = await response.json()
        setSessions(data)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-100 to-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Фотосессии</h1>
          <p className="text-xl text-gray-600">
            Бережно сохраненные моменты ваших самых важных дней
          </p>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="group"
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition aspect-square flex flex-col items-center justify-center p-6 cursor-pointer">
                  <div className="text-gray-400 text-5xl mb-4">📸</div>
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {session.name}
                  </h2>
                  {session.description && (
                    <p className="text-gray-600 text-center text-sm mb-4 line-clamp-2">
                      {session.description}
                    </p>
                  )}
                  <div className="text-gray-500 text-sm">
                    {session.photosCount} фотографий
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">📷</div>
            <div className="text-xl">Фотосессий еще нет</div>
          </div>
        )}
      </div>
    </div>
  )
}
