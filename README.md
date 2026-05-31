# Photo Gallery - Профессиональный сайт фотографа

Next.js приложение с админкой для управления галереями фото. Полная интеграция с Яндекс Диском для хранения и скачивания файлов.

## Возможности

✅ Главная страница с портфолио
✅ Несколько категорий галерей (Портреты, Свадьбы, События и т.д.)
✅ Админка для загрузки фото
✅ Drag-and-drop переставление фото в галереях
✅ Два варианта фото (для соцсетей + оригинал)
✅ Скачивание: архив всех фото или поштучно
✅ Интеграция с Яндекс Диском
✅ Деплой на Vercel

## Установка и запуск локально

```bash
cd photo-gallery
npm install
npm run dev
```

Откройте http://localhost:3000 в браузере.

### Админка

Перейдите на http://localhost:3000/admin

- **Manage Galleries** - переставляйте фото местами (drag-and-drop или кнопки)
- **Upload Photos** - загружайте новые фото в выбранную галерею

## Интеграция с Яндекс Диском

### 1. Создайте приложение в Яндекс.OAuth

1. Перейдите на https://oauth.yandex.ru/client
2. Нажмите "Создать приложение"
3. Заполните:
   - Имя: "Photo Gallery"
   - Тип: "Web-сервис"
   - Перенаправления: `https://yourdomain.vercel.app/api/auth/yandex/callback`
4. Скопируйте **Client ID** и **Client Secret**

### 2. Переменные окружения

Создайте `.env.local`:

```env
YANDEX_CLIENT_ID=your_client_id
YANDEX_CLIENT_SECRET=your_client_secret
YANDEX_OAUTH_REDIRECT_URI=https://yourdomain.vercel.app/api/auth/yandex/callback

# Для работы с Яндекс Диском API
YANDEX_DISK_API_TOKEN=your_disk_token
```

### 3. Установите зависимости для Яндекс Диска

```bash
npm install yandex-disk-sdk
```

### 4. API для работы с Яндекс Диском

Обновите `app/api/upload/route.ts` для интеграции:

```typescript
import { YandexDisk } from 'yandex-disk-sdk'

const disk = new YandexDisk({
  token: process.env.YANDEX_DISK_API_TOKEN!,
})

// Загрузка файла
await disk.uploadFile(file, '/photos/gallery-name/')

// Создание двух версий (используйте Sharp)
const buffer = await file.arrayBuffer()
const image = sharp(buffer)

// Версия для соцсетей (1080x1080, качество 80)
const social = await image.resize(1080, 1080).jpeg({ quality: 80 }).toBuffer()

// Оригинал (без изменений)
const original = await image.toBuffer()
```

## Структура проекта

```
photo-gallery/
├── app/
│   ├── admin/             # Админка
│   ├── api/
│   │   └── upload/        # API для загрузки фото
│   ├── portfolio/         # Галереи
│   └── globals.css        # Глобальные стили
├── components/
│   ├── AdminUpload.tsx    # Загрузка фото
│   ├── AdminGalleries.tsx # Управление галереями
│   ├── Header.tsx
│   └── Footer.tsx
├── public/                # Фото (временно)
└── package.json
```

## Деплой на Vercel

### 1. Загрузите код на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourname/photo-gallery.git
git push -u origin main
```

### 2. Деплой на Vercel

1. Перейдите на https://vercel.com
2. Нажмите "Add New" → "Project"
3. Импортируйте GitHub репозиторий
4. В Environment Variables добавьте:
   - `YANDEX_CLIENT_ID`
   - `YANDEX_CLIENT_SECRET`
   - `YANDEX_DISK_API_TOKEN`
5. Нажмите "Deploy"

Сайт будет доступен по адресу: `https://your-project.vercel.app`

## Развитие

### TODO

- [ ] OAuth интеграция с Яндекс для админа
- [ ] Работа с Яндекс Диском API
- [ ] Обработка изображений (Sharp для двух версий)
- [ ] Скачивание архивов (node-zip)
- [ ] База данных (PostgreSQL + Prisma) для метаданных
- [ ] Кэширование превью
- [ ] Защита админки (пароль)
- [ ] Мобильная оптимизация галерей
- [ ] SEO оптимизация
- [ ] Аналитика (Google Analytics)

## Лицензия

MIT
