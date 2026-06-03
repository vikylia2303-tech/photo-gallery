import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const expected = (process.env.ADMIN_PASSWORD || '').trim()
        if (!expected || (clientPayload || '').trim() !== expected) {
          throw new Error('unauthorized')
        }
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif',
            'image/heic',
            'image/heif',
          ],
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(json)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'upload error' },
      { status: 400 }
    )
  }
}
