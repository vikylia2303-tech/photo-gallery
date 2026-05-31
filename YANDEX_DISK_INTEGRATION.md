# Интеграция с Яндекс Диском - Полный гайд

## Архитектура

```
Админка → Загрузка фото → Next.js API → Яндекс Диск
                              ↓
                        Sharp (обработка)
                        ├── Версия для соцсетей
                        └── Оригинал
```

## Шаг 1: Получить доступ к Яндекс Диску

### Способ 1: OAuth (рекомендуется)

1. Перейдите на https://oauth.yandex.ru/
2. Зарегистрируйте приложение:
   - Тип: "Веб-сервис"
   - Разрешения: "Доступ к Яндекс.Диску"
3. Получите:
   - `Client ID`
   - `Client Secret`

### Способ 2: App Password (проще для начала)

1. Перейдите https://passport.yandex.ru/account/security/app-passwords
2. Создайте пароль для приложения
3. Используйте как `YANDEX_DISK_PASSWORD`

## Шаг 2: Установите зависимости

```bash
npm install axios sharp archiver dotenv
```

## Шаг 3: Переменные окружения

`.env.local`:

```env
# Для OAuth
YANDEX_CLIENT_ID=xxxxx
YANDEX_CLIENT_SECRET=xxxxx

# Или для App Password
YANDEX_LOGIN=your@email.com
YANDEX_DISK_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Директория на Диске
YANDEX_DISK_FOLDER=/Photo Gallery/
```

## Шаг 4: Обновите API

### `app/api/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import axios from 'axios'
import FormData from 'form-data'

const YANDEX_LOGIN = process.env.YANDEX_LOGIN
const YANDEX_PASSWORD = process.env.YANDEX_DISK_PASSWORD
const DISK_FOLDER = process.env.YANDEX_DISK_FOLDER || '/Photo Gallery/'

async function getYandexDiskAuth() {
  // Базовая авторизация для API
  const credentials = Buffer.from(
    `${YANDEX_LOGIN}:${YANDEX_PASSWORD}`
  ).toString('base64')
  
  return `Basic ${credentials}`
}

async function uploadToDisk(
  fileBuffer: Buffer,
  fileName: string,
  folderPath: string
) {
  const auth = await getYandexDiskAuth()
  const uploadPath = `${DISK_FOLDER}${folderPath}/${fileName}`

  try {
    const response = await axios.post(
      'https://webdav.yandex.com' + uploadPath,
      fileBuffer,
      {
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/octet-stream',
        },
      }
    )
    return true
  } catch (error) {
    console.error(`Upload error: ${error}`)
    return false
  }
}

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

    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Получить имя файла без расширения
    const fileName = file.name.replace(/\.[^/.]+$/, '')
    const ext = file.name.split('.').pop() || 'jpg'

    // Версия для соцсетей: 1080x1080, качество 80
    const socialBuffer = await sharp(uint8Array)
      .resize(1080, 1080, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer()

    const socialFileName = `${fileName}-social.${ext}`

    // Оригинал: просто сжимаем качество
    const originalBuffer = await sharp(uint8Array)
      .jpeg({ quality: 95 })
      .toBuffer()

    const originalFileName = `${fileName}-original.${ext}`

    // Загружаем обе версии на Яндекс Диск
    const folderPath = gallery

    const uploadSocial = await uploadToDisk(socialBuffer, socialFileName, folderPath)
    const uploadOriginal = await uploadToDisk(originalBuffer, originalFileName, folderPath)

    if (!uploadSocial || !uploadOriginal) {
      return NextResponse.json(
        { error: 'Failed to upload to Yandex Disk' },
        { status: 500 }
      )
    }

    // Сохраняем метаданные в БД (позже)
    // const photo = await db.photo.create({
    //   gallery,
    //   originalName: file.name,
    //   socialFile: socialFileName,
    //   originalFile: originalFileName,
    //   uploadedAt: new Date(),
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
        files: {
          social: socialFileName,
          original: originalFileName,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    )
  }
}
```

## Шаг 5: API для скачивания

### `app/api/download/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import archiver from 'archiver'

async function getYandexDiskAuth() {
  const credentials = Buffer.from(
    `${process.env.YANDEX_LOGIN}:${process.env.YANDEX_DISK_PASSWORD}`
  ).toString('base64')
  return `Basic ${credentials}`
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const gallery = searchParams.get('gallery')
  const fileType = searchParams.get('type') || 'all' // 'all', 'social', 'original'

  if (!gallery) {
    return NextResponse.json(
      { error: 'Gallery parameter required' },
      { status: 400 }
    )
  }

  try {
    const auth = await getYandexDiskAuth()
    const folderPath = `${process.env.YANDEX_DISK_FOLDER}${gallery}/`

    // Получить список файлов из папки
    const response = await axios.get(
      `https://webdav.yandex.com${folderPath}`,
      {
        headers: { Authorization: auth },
        method: 'PROPFIND',
      }
    )

    // Создать архив
    const archive = archiver('zip', { zlib: { level: 9 } })

    // Скачать файлы и добавить в архив
    // ... логика скачивания и добавления в архив

    return new NextResponse(archive, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${gallery}-photos.zip"`,
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    )
  }
}
```

## Шаг 6: Протестируйте

```bash
npm run dev
```

1. Перейдите на http://localhost:3000/admin
2. Выберите галерею
3. Загрузите фото
4. Проверьте Яндекс Диск (должны быть две версии каждого фото)

## Проблемы и решения

### "401 Unauthorized"
- Проверьте `YANDEX_LOGIN` и `YANDEX_DISK_PASSWORD`
- Убедитесь, что App Password создано правильно

### Файлы загружаются, но не видны
- Проверьте путь папки на Диске
- Убедитесь, что папка существует или создастся автоматически

### Ошибка при загрузке через браузер
- Проверьте размер файла (лимит 4GB на WebDAV)
- Убедитесь, что расширение файла поддерживается

## Улучшения для production

1. **Использовать OAuth вместо пароля** (безопаснее)
2. **Кэширование** файлов на сервере
3. **Thumbnails** для превью
4. **CDN** для раздачи файлов
5. **Rate limiting** на API
6. **Логирование** всех операций
7. **Резервные копии** метаданных
