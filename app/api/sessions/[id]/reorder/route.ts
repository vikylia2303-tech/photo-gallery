import { NextRequest, NextResponse } from 'next/server'
import { reorderPhotos, getSession } from '@/lib/yandex-disk'

export async function PUT(
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

    const body = await request.json()
    const { photos } = body

    if (!Array.isArray(photos)) {
      return NextResponse.json(
        { error: 'Invalid photos format' },
        { status: 400 }
      )
    }

    await reorderPhotos(sessionId, photos)

    return NextResponse.json({ message: 'Photos reordered successfully' })
  } catch (error) {
    console.error('Error reordering photos:', error)
    return NextResponse.json({ error: 'Failed to reorder photos' }, { status: 500 })
  }
}
