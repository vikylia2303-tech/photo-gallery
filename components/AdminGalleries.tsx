'use client'

import { useState } from 'react'

interface Photo {
  id: string
  name: string
  order: number
}

interface Gallery {
  id: string
  name: string
  photos: Photo[]
}

export default function AdminGalleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([
    {
      id: '1',
      name: 'Portraits',
      photos: [
        { id: '1', name: 'portrait-1.jpg', order: 1 },
        { id: '2', name: 'portrait-2.jpg', order: 2 },
        { id: '3', name: 'portrait-3.jpg', order: 3 },
      ],
    },
    {
      id: '2',
      name: 'Weddings',
      photos: [
        { id: '4', name: 'wedding-1.jpg', order: 1 },
        { id: '5', name: 'wedding-2.jpg', order: 2 },
      ],
    },
  ])

  const [selectedGallery, setSelectedGallery] = useState(galleries[0]?.id || '')
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const currentGallery = galleries.find((g) => g.id === selectedGallery)

  const handleDragStart = (photoId: string) => {
    setDraggedItem(photoId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetPhotoId: string) => {
    if (!draggedItem || draggedItem === targetPhotoId || !currentGallery) return

    const draggedIndex = currentGallery.photos.findIndex((p) => p.id === draggedItem)
    const targetIndex = currentGallery.photos.findIndex((p) => p.id === targetPhotoId)

    const newPhotos = [...currentGallery.photos]
    ;[newPhotos[draggedIndex], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[draggedIndex]]

    setGalleries((prev) =>
      prev.map((g) => (g.id === selectedGallery ? { ...g, photos: newPhotos } : g))
    )

    setDraggedItem(null)
  }

  const handleMoveUp = (photoId: string) => {
    if (!currentGallery) return

    const index = currentGallery.photos.findIndex((p) => p.id === photoId)
    if (index <= 0) return

    const newPhotos = [...currentGallery.photos]
    ;[newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]]

    setGalleries((prev) =>
      prev.map((g) => (g.id === selectedGallery ? { ...g, photos: newPhotos } : g))
    )
  }

  const handleMoveDown = (photoId: string) => {
    if (!currentGallery) return

    const index = currentGallery.photos.findIndex((p) => p.id === photoId)
    if (index >= currentGallery.photos.length - 1) return

    const newPhotos = [...currentGallery.photos]
    ;[newPhotos[index + 1], newPhotos[index]] = [newPhotos[index], newPhotos[index + 1]]

    setGalleries((prev) =>
      prev.map((g) => (g.id === selectedGallery ? { ...g, photos: newPhotos } : g))
    )
  }

  const handleDelete = (photoId: string) => {
    setGalleries((prev) =>
      prev.map((g) =>
        g.id === selectedGallery
          ? { ...g, photos: g.photos.filter((p) => p.id !== photoId) }
          : g
      )
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-lg font-semibold mb-2">Select Gallery</label>
        <select
          value={selectedGallery}
          onChange={(e) => setSelectedGallery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          {galleries.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {currentGallery && (
        <div>
          <h3 className="text-2xl font-serif mb-4">{currentGallery.name}</h3>
          <p className="text-gray-600 mb-6">
            Drag photos to reorder or use buttons below each photo
          </p>

          <div className="space-y-2">
            {currentGallery.photos.map((photo, index) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => handleDragStart(photo.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(photo.id)}
                className={`p-4 border rounded-lg flex items-center justify-between cursor-move transition ${
                  draggedItem === photo.id
                    ? 'bg-gray-100 border-blue-500'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-gray-500 font-semibold min-w-8">{index + 1}.</span>
                  <span className="font-medium">{photo.name}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveUp(photo.id)}
                    disabled={index === 0}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(photo.id)}
                    disabled={index === currentGallery.photos.length - 1}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="px-3 py-1 text-sm bg-red-200 hover:bg-red-300 rounded text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
