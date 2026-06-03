import Link from 'next/link'
import { getManifest } from '@/lib/manifest'
import AlbumGallery from '@/components/AlbumGallery'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{ key?: string }>
}

export default async function AlbumPage({ params, searchParams }: PageProps) {
  const { category } = await params
  const { key } = await searchParams
  const manifest = await getManifest()
  const album = manifest.albums.find((a) => a.slug === category)

  if (!album) {
    return (
      <div className="py-32 container text-center">
        <p className="overline mb-4">Альбом</p>
        <h1 className="section-title text-4xl md:text-5xl mb-8">Альбом не найден</h1>
        <Link href="/#portfolio" className="btn">Все альбомы</Link>
      </div>
    )
  }

  const isPrivate = !!album.privateKey && key === album.privateKey
  const photos = isPrivate ? album.photos : album.photos.filter((p) => !p.hidden)

  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <p className="overline mb-4">Фотосессия</p>
          <h1 className="section-title text-5xl md:text-6xl">{album.title}</h1>
          {isPrivate && (
            <p className="text-xs text-gray-400 mt-3">Личная ссылка — показаны все фото</p>
          )}
        </div>

        <AlbumGallery photos={photos} title={album.title} downloadUrl={album.downloadUrl} />

        <div className="text-center mt-16">
          <a href="/#contact" className="btn">Записаться на съёмку</a>
        </div>
      </div>
    </div>
  )
}
