import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const gallery = formData.get('gallery') as string

    if (!file || !gallery) {
      return NextResponse.json(
        { error: 'Missing file or gallery' },
        { status: 400 }
      )
    }

    // TODO: Интегрировать с Яндекс Диском
    // Здесь будет логика загрузки файла на Яндекс Диск
    // и создание двух версий (для соцсетей и оригинал)

    console.log(`Uploading ${file.name} to gallery ${gallery}`)

    return NextResponse.json(
      { success: true, message: 'File uploaded' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
