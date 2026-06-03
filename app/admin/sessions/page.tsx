'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
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

export default function SessionsAdmin() {
  const [sessions, setSessions] = useState<PhotoSession[]>([])
  const [selectedSession, setSelectedSession] = useState<PhotoSession | null>(null)
  const [newSessionName, setNewSessionName] = useState('')
  const [newSessionDescription, setNewSessionDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Загрузить сессии
  useEffect(() => {
    fetchSessions()
  }, [])

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

  // Создать новую сессию
  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault()
    if (!newSessionName.trim()) return

    try {
      const sessionId = newSessionName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sessionId,
          name: newSessionName,
          description: newSessionDescription,
        }),
      })

      if (response.ok) {
        const newSession = await response.json()
        setSessions([...sessions, newSession])
        setNewSessionName('')
        setNewSessionDescription('')
      }
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Ошибка при создании сессии')
    }
  }

  // Загрузить фото
  async function handleUploadPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedSession || !e.target.files) return

    const files = Array.from(e.target.files)
    setUploading(true)

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))

      const response = await fetch(`/api/sessions/${selectedSession.id}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Загружено ${data.photos.length} фото`)
        fetchSessions()
      } else {
        alert('Ошибка при загрузке фото')
      }
    } catch (error) {
      console.error('Error uploading photos:', error)
      alert('Ошибка при загрузке фото')
    } finally {
      setUploading(false)
    }
  }

  // Переупорядочить фото
  async function handleReorderPhotos(orderedPhotos: Photo[]) {
    if (!selectedSession) return

    try {
      const reorderedPhotos = orderedPhotos.map((photo, index) => ({
        id: photo.id,
        order: index,
      }))

      const response = await fetch(`/api/sessions/${selectedSession.id}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: reorderedPhotos }),
      })

      if (response.ok) {
        const updatedSession = {
          ...selectedSession,
          photos: orderedPhotos,
        }
        setSelectedSession(updatedSession)
        alert('Порядок фото сохранен')
      }
    } catch (error) {
      console.error('Error reordering photos:', error)
      alert('Ошибка при переупорядочивании')
    }
  }

  if (loading) return <div className="p-8">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Управление фотосессиями</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Левая колонка: Создание сессии и список */}
          <div className="col-span-1 space-y-6">
            {/* Форма создания сессии */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Создать сессию</h2>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <input
                  type="text"
                  placeholder="Название сессии"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Описание (опционально)"
                  value={newSessionDescription}
                  onChange={(e) => setNewSessionDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Создать
                </button>
              </form>
            </div>

            {/* Список сессий */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Ваши сессии</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedSession?.id === session.id
                        ? 'bg-blue-100 border-2 border-blue-600'
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-semibold">{session.name}</div>
                    <div className="text-sm text-gray-600">
                      {session.photosCount} фото
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка: Управление фото сессии */}
          <div className="col-span-2">
            {selectedSession ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-2">{selectedSession.name}</h2>
                {selectedSession.description && (
                  <p className="text-gray-600 mb-4">{selectedSession.description}</p>
                )}

                {/* Загрузка фото */}
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleUploadPhotos}
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {uploading ? 'Загрузка...' : 'Перетащите фото сюда или нажмите'}
                      </div>
                      <div className="text-sm text-gray-600">
                        JPG, PNG, WebP - до 50 МБ за раз
                      </div>
                    </div>
                  </label>
                </div>

                {/* Сортировка фото */}
                {selectedSession.photos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Фото ({selectedSession.photos.length})
                    </h3>
                    <DragDropContext
                      onDragEnd={(result) => {
                        const { source, destination } = result
                        if (!destination) return

                        const items = Array.from(selectedSession.photos)
                        const [reorderedItem] = items.splice(source.index, 1)
                        items.splice(destination.index, 0, reorderedItem)

                        handleReorderPhotos(items)
                      }}
                    >
                      <Droppable droppableId="photos" type="PHOTO">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`grid grid-cols-4 gap-4 p-4 rounded-lg ${
                              snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                            }`}
                          >
                            {selectedSession.photos.map((photo, index) => (
                              <Draggable
                                key={photo.id}
                                draggableId={photo.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`relative group aspect-square bg-gray-200 rounded-lg overflow-hidden ${
                                      snapshot.isDragging ? 'opacity-50' : ''
                                    }`}
                                  >
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                      <span className="text-sm text-gray-500">
                                        #{index + 1}
                                      </span>
                                    </div>
                                    <div className="absolute top-0 left-0 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                      #{index + 1}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}

                {selectedSession.photos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Загрузите фото для начала
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Выберите сессию для управления фото
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
