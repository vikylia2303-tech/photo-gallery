# Развёртывание на Vercel

## Быстрый старт

### 1. Подготовка к деплою

```bash
# Убедитесь, что всё работает локально
npm run dev

# Создайте Git репозиторий
git init
git add .
git commit -m "Initial commit: Photo Gallery"
```

### 2. Загрузите на GitHub

```bash
# Создайте новый репозиторий на GitHub
# https://github.com/new

git remote add origin https://github.com/YOUR_USERNAME/photo-gallery.git
git branch -M main
git push -u origin main
```

### 3. Деплой на Vercel

#### Способ 1: Через веб-интерфейс

1. Перейдите на https://vercel.com/new
2. Нажмите "Add GitHub App" и авторизуйтесь
3. Выберите репозиторий `photo-gallery`
4. Vercel автоматически обнаружит Next.js проект
5. Нажмите "Deploy"

#### Способ 2: Через CLI

```bash
npm i -g vercel
vercel

# Следуйте инструкциям в терминале
```

### 4. Установите Environment Variables на Vercel

После деплоя перейдите в Settings проекта → Environment Variables

Добавьте:

```
YANDEX_LOGIN=your@email.com
YANDEX_DISK_PASSWORD=xxxx-xxxx-xxxx-xxxx
YANDEX_DISK_FOLDER=/Photo Gallery/
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

> Не забудьте удалить `.env.local` из гита!

```bash
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "chore: ignore env files"
git push
```

### 5. Переиндексируйте и запустите

```bash
# Vercel автоматически пересоберёт проект после push
# Проверьте Deployments → Activity

# После завершения, сайт доступен по адресу:
# https://photo-gallery-{random}.vercel.app
```

## Кастомный домен

### На Vercel

1. Settings → Domains
2. Добавьте домен (например, `photos.example.com`)
3. Vercel покажет DNS записи
4. На хостинге домена обновите DNS:
   - Добавьте CNAME запись
   - Или используйте nameservers от Vercel

### Примеры для популярных хостингов

**Яндекс.Домены:**
1. Перейдите в DNS
2. Добавьте CNAME на ваш Vercel домен

**Timeweb, Beget, Reg.ru:**
1. DNS → A-записи
2. Используйте IP адрес Vercel (узнайте через `nslookup`)

## Мониторинг и логирование

### Vercel Analytics

1. Settings → Analytics
2. Vercel автоматически собирает метрики:
   - Core Web Vitals
   - Response times
   - Error rates

### Яндекс.Метрика

Добавьте в `app/layout.tsx`:

```tsx
// После тега <body>
<script async src="https://mc.yandex.ru/metrica/tag.js"></script>
<script>
  ym(YOUR_COUNTER_ID, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true });
</script>
<noscript>
  <div><img src="https://mc.yandex.ru/watch/YOUR_COUNTER_ID" style={{display:'none'}} /></div>
</noscript>
```

## Обновления и переразвёртывание

После изменений кода:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

Vercel автоматически пересоберёт и переразвёртывает сайт.

## Проблемы

### Сайт недоступен после деплоя

1. Проверьте Deployments → Activity
2. Посмотрите логи (кнопка "Inspect")
3. Убедитесь, что environment variables установлены
4. Нажмите "Redeploy" если нужно пересоздать

### API ошибки (500)

1. Проверьте функции в `app/api/` папке
2. Посмотрите логи через `vercel logs`
3. Убедитесь, что Яндекс Диск credentials верные

### Медленная загрузка фото

1. Optimizе images через Sharp (уже сделано)
2. Включите Vercel Edge Caching
3. Используйте Image component вместо `<img>`

## Резервная копия и восстановление

Vercel хранит всю историю deployments:

1. Settings → Deployments
2. Выберите любой предыдущий deploy
3. Нажмите "Promote to Production"

## Стоимость

- Vercel Free: подходит для небольших сайтов (100K запросов/месяц)
- Vercel Pro: $20/месяц (неограниченные запросы)
- Яндекс Диск: бесплатно (50 ГБ) или платно

Итого: ~$20-50/месяц для production сайта.

## Дополнительные ресурсы

- https://vercel.com/docs
- https://nextjs.org/docs/deployment/vercel
- https://yandex.ru/dev/disk/api/reference/
