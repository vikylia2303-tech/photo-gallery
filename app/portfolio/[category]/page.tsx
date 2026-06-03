import Link from 'next/link'
import { getManifest } from '@/lib/manifest'
import AlbumGallery from '@/components/AlbumGallery'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export default async function AlbumPage({ params }: PageProps) {
  const { category } = await params
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

  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <p className="overline mb-4">Фотосессия</p>
          <h1 className="section-title text-5xl md:text-6xl">{album.title}</h1>
        </div>

        <AlbumGallery photos={album.photos} title={album.title} />

        <div className="text-center mt-16">
          <a href="/#contact" className="btn">Записаться на съёмку</a>
        </div>
      </div>
    </div>
  )
}
