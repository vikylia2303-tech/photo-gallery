import { NextRequest, NextResponse } from 'next/server'
import { uploadPhotoToSession, getSession } from '@/lib/yandex-disk'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params

    // Проверить что сессия существует
    const session = await getSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadedPhotos = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue // Пропустить не-изображения
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const filename = `${Date.now()}-${file.name}`

      const photo = await uploadPhotoToSession(sessionId, filename, buffer)
      uploadedPhotos.push(photo)
    }

    return NextResponse.json(
      {
        message: 'Photos uploaded successfully',
        photos: uploadedPhotos,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading photos:', error)
    return NextResponse.json({ error: 'Failed to upload photos' }, { status: 500 })
  }
}
