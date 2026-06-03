import Link from 'next/link'
import { getManifest } from '@/lib/manifest'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const manifest = await getManifest()
  const albums = manifest.albums.filter((a) => a.photos.length > 0 && a.public)
  const order = manifest.homeOrder || []
  const chosen = manifest.albums
    .flatMap((a) => a.photos)
    .filter((p) => p.featured)
    .sort((a, b) => {
      const ia = order.indexOf(a.id)
      const ib = order.indexOf(b.id)
      if (ia === -1 && ib === -1) return 0
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
  const heroPhotos = chosen.length > 0 ? chosen : albums.flatMap((a) => a.photos).slice(0, 8)

  return (
    <div>
      {/* Hero signature */}
      <section className="pt-16 pb-12 text-center">
        <h1 className="signature text-5xl md:text-6xl text-black">Victoria Ustyuzhanina</h1>
        <p className="overline mt-3">photographer</p>
      </section>

      {/* Hero photo strip */}
      {heroPhotos.length > 0 && (
        <section className="pb-24">
          <div className="photo-strip max-w-[1600px] mx-auto">
            {heroPhotos.map((photo) => (
              <div key={photo.id} className="w-[300px] md:w-[420px] aspect-[7/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="w-full h-full object-cover bw" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About / philosophy */}
      <section className="py-20 border-t border-gray-100">
        <div className="container-narrow text-center">
          <p className="overline mb-6">Обо мне</p>
          <h2 className="section-title text-4xl md:text-5xl mb-10">Живая фотография</h2>
          <div className="space-y-6 text-[17px] leading-relaxed text-gray-600 text-left">
            <p>
              Я снимаю в стиле живой фотографии — Lifestyle. Главная ценность — настоящие эмоции
              и моменты жизни, которые я ловлю и сохраняю вместе с Вами.
            </p>
            <p>
              Для меня всегда в приоритете человек, а пространство вокруг лишь дополняет картинку.
              Ниже — мои фотосессии: загляните и почувствуйте, какой результат получите после нашей встречи.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio — albums */}
      <section className="py-24" id="portfolio">
        <div className="container">
          <div className="text-center mb-14">
            <p className="overline mb-4">Работы</p>
            <h2 className="section-title text-4xl md:text-5xl">Портфолио</h2>
          </div>

          {albums.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Фотосессии скоро появятся.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {albums.map((album) => {
                const cover =
                  album.photos.find((p) => p.id === album.coverId) || album.photos[0]
                return (
                <Link key={album.slug} href={`/portfolio/${album.slug}`} className="photo-item group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover.url} alt={album.title} />
                  <div className="absolute inset-0 flex items-end justify-center pb-8 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-500">
                    <span className="text-white tracking-[0.25em] uppercase text-sm">Смотреть</span>
                  </div>
                  <h3 className="absolute bottom-5 left-0 right-0 text-center text-2xl text-white drop-shadow group-hover:opacity-0 transition">
                    {album.title}
                  </h3>
                </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
