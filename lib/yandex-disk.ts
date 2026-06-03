import axios from 'axios'

const YANDEX_LOGIN = process.env.YANDEX_LOGIN
const YANDEX_PASSWORD = process.env.YANDEX_DISK_PASSWORD

if (!YANDEX_LOGIN || !YANDEX_PASSWORD) {
  console.warn('Yandex Disk credentials not configured')
}

const BASE_URL = 'https://webdav.yandex.ru'
const PHOTO_GALLERY_PATH = '/photo-gallery'

const client = axios.create({
  baseURL: BASE_URL,
  auth: {
    username: YANDEX_LOGIN || '',
    password: YANDEX_PASSWORD || '',
  },
})

export interface PhotoSession {
  id: string
  name: string
  description?: string
  createdAt: string
  photosCount: number
  photos: Array<{
    id: string
    filename: string
    order: number
    createdAt: string
  }>
}

interface SessionsMetadata {
  sessions: Array<{
    id: string
    name: string
    description?: string
    createdAt: string
  }>
}

// Убедимся что папка существует
async function ensureDirectory(path: string) {
  try {
    await client.request({
      method: 'MKCOL',
      url: path,
    })
  } catch (error: any) {
    if (error.response?.status !== 405) {
      // 405 = уже существует
      throw error
    }
  }
}

// Получить метаданные всех сессий
export async function getSessions(): Promise<PhotoSession[]> {
  try {
    await ensureDirectory(PHOTO_GALLERY_PATH)
    const metadataPath = `${PHOTO_GALLERY_PATH}/sessions.json`

    try {
      const response = await client.get(metadataPath)
      const metadata = JSON.parse(response.data) as SessionsMetadata

      // Получить информацию о каждой сессии (количество фото)
      const sessions = await Promise.all(
        metadata.sessions.map(async (session) => {
          try {
            const photosPath = `${PHOTO_GALLERY_PATH}/sessions/${session.id}/photos.json`
            const photosResponse = await client.get(photosPath)
            const photos = JSON.parse(photosResponse.data)
            return {
              ...session,
              photosCount: photos.length,
              photos,
            } as PhotoSession
          } catch {
            return {
              ...session,
              photosCount: 0,
              photos: [],
            } as PhotoSession
          }
        })
      )
      return sessions
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  } catch (error) {
    console.error('Error getting sessions:', error)
    throw error
  }
}

// Создать новую сессию
export async function createSession(
  id: string,
  name: string,
  description?: string
): Promise<PhotoSession> {
  try {
    await ensureDirectory(PHOTO_GALLERY_PATH)
    const sessionPath = `${PHOTO_GALLERY_PATH}/sessions/${id}`
    await ensureDirectory(sessionPath)

    // Создать пустой photos.json
    const photosData = JSON.stringify([])
    await client.put(`${sessionPath}/photos.json`, photosData)

    // Обновить sessions.json
    let metadata: SessionsMetadata = { sessions: [] }
    try {
      const response = await client.get(`${PHOTO_GALLERY_PATH}/sessions.json`)
      metadata = JSON.parse(response.data)
    } catch {
      // Файл не существует, создадим с нуля
    }

    metadata.sessions.push({
      id,
      name,
      description,
      createdAt: new Date().toISOString(),
    })

    await client.put(
      `${PHOTO_GALLERY_PATH}/sessions.json`,
      JSON.stringify(metadata, null, 2)
    )

    return {
      id,
      name,
      description,
      createdAt: new Date().toISOString(),
      photosCount: 0,
      photos: [],
    }
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

// Загрузить фото в сессию
export async function uploadPhotoToSession(
  sessionId: string,
  filename: string,
  fileBuffer: Buffer
): Promise<{ id: string; filename: string; order: number }> {
  try {
    const sessionPath = `${PHOTO_GALLERY_PATH}/sessions/${sessionId}`
    const photoPath = `${sessionPath}/${filename}`

    // Загрузить файл
    await client.put(photoPath, fileBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    })

    // Обновить photos.json
    const photosPath = `${sessionPath}/photos.json`
    let photos: Array<{
      id: string
      filename: string
      order: number
      createdAt: string
    }> = []

    try {
      const response = await client.get(photosPath)
      photos = JSON.parse(response.data)
    } catch {
      // Файл не существует
    }

    const photo = {
      id: `photo-${Date.now()}`,
      filename,
      order: photos.length,
      createdAt: new Date().toISOString(),
    }

    photos.push(photo)
    await client.put(photosPath, JSON.stringify(photos, null, 2))

    return photo
  } catch (error) {
    console.error('Error uploading photo:', error)
    throw error
  }
}

// Получить сессию с фото
export async function getSession(sessionId: string): Promise<PhotoSession | null> {
  try {
    const sessions = await getSessions()
    return sessions.find((s) => s.id === sessionId) || null
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Переупорядочить фото
export async function reorderPhotos(
  sessionId: string,
  photos: Array<{ id: string; order: number }>
): Promise<void> {
  try {
    const sessionPath = `${PHOTO_GALLERY_PATH}/sessions/${sessionId}`
    const photosPath = `${sessionPath}/photos.json`

    const response = await client.get(photosPath)
    const allPhotos = JSON.parse(response.data)

    // Обновить порядок
    const updatedPhotos = allPhotos.map((photo: any) => {
      const newOrder = photos.find((p) => p.id === photo.id)?.order
      return newOrder !== undefined ? { ...photo, order: newOrder } : photo
    })

    // Отсортировать по порядку
    updatedPhotos.sort((a: any, b: any) => a.order - b.order)

    await client.put(photosPath, JSON.stringify(updatedPhotos, null, 2))
  } catch (error) {
    console.error('Error reordering photos:', error)
    throw error
  }
}

// Удалить фото
export async function deletePhoto(
  sessionId: string,
  filename: string
): Promise<void> {
  try {
    const sessionPath = `${PHOTO_GALLERY_PATH}/sessions/${sessionId}`
    const photoPath = `${sessionPath}/${filename}`

    // Удалить файл
    await client.delete(photoPath)

    // Обновить photos.json
    const photosPath = `${sessionPath}/photos.json`
    const response = await client.get(photosPath)
    let photos = JSON.parse(response.data)

    photos = photos.filter((p: any) => p.filename !== filename)

    // Переупорядочить
    photos = photos.map((p: any, index: number) => ({
      ...p,
      order: index,
    }))

    await client.put(photosPath, JSON.stringify(photos, null, 2))
  } catch (error) {
    console.error('Error deleting photo:', error)
    throw error
  }
}

// Получить URL для скачивания фото
export function getPhotoUrl(sessionId: string, filename: string): string {
  const login = YANDEX_LOGIN || 'user'
  return `https://disk.yandex.ru/d/download/${PHOTO_GALLERY_PATH}/sessions/${sessionId}/${filename}`
}
