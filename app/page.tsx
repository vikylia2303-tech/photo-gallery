import Link from 'next/link'

const heroPhotos = [
  'https://picsum.photos/seed/ls-living1/700/900',
  'https://picsum.photos/seed/ls-living2/700/900',
  'https://picsum.photos/seed/ls-living3/700/900',
  'https://picsum.photos/seed/ls-living4/700/900',
  'https://picsum.photos/seed/ls-living5/700/900',
]

const categories = [
  { href: '/portfolio/portraits', label: 'Портреты', img: 'https://picsum.photos/seed/cat-portraits/800/1000' },
  { href: '/portfolio/weddings', label: 'Свадьбы', img: 'https://picsum.photos/seed/cat-weddings/800/1000' },
  { href: '/portfolio/events', label: 'События', img: 'https://picsum.photos/seed/cat-events/800/1000' },
]

export default function Home() {
  return (
    <div>
      {/* Hero signature */}
      <section className="pt-16 pb-12 text-center">
        <h1 className="signature text-6xl md:text-7xl text-black">Photo Gallery</h1>
        <p className="overline mt-3">photographer</p>
      </section>

      {/* Hero photo strip */}
      <section className="pb-24">
        <div className="photo-strip max-w-[1600px] mx-auto">
          {heroPhotos.map((src, i) => (
            <div key={i} className="w-[300px] md:w-[420px] aspect-[7/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover bw" />
            </div>
          ))}
        </div>
      </section>

      {/* About / philosophy */}
      <section className="py-20 border-t border-gray-100">
        <div className="container-narrow text-center">
          <p className="overline mb-6">Обо мне</p>
          <h2 className="section-title text-4xl md:text-5xl mb-10">Привет! Меня зовут Юлия</h2>
          <div className="space-y-6 text-[17px] leading-relaxed text-gray-600 text-left">
            <p>
              Я фотограф в стиле живой фотографии — Lifestyle. Снимаю в Волгограде, Москве
              и Санкт-Петербурге. В профессиональной фотографии с 2019 года.
            </p>
            <p>
              Я не причисляю себя к какому-то конкретному жанру — я люблю фиксировать ЖИЗНЬ,
              и не важно, кто у меня в кадре: семья, один герой, пара, танцор или музыкальная группа.
            </p>
            <p>
              Главная ценность — живые эмоции, настоящие неподдельные чувства, моменты жизни,
              которые я ловлю и сохраняю вместе с Вами. Для меня всегда в приоритете человек,
              а пространство вокруг лишь дополняет картинку.
            </p>
          </div>
        </div>
      </section>

      {/* Full-bleed image */}
      <section className="my-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/lifestyle-wide/1920/900"
          alt=""
          className="w-full h-[60vh] object-cover bw"
        />
      </section>

      {/* Portfolio */}
      <section className="py-24" id="portfolio">
        <div className="container">
          <div className="text-center mb-14">
            <p className="overline mb-4">Работы</p>
            <h2 className="section-title text-4xl md:text-5xl">Портфолио</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <Link key={c.href} href={c.href} className="photo-item group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.label} />
                <div className="absolute inset-0 flex items-end justify-center pb-8 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500">
                  <span className="text-white tracking-[0.25em] uppercase text-sm">{c.label}</span>
                </div>
                <h3 className="absolute bottom-5 left-0 right-0 text-center text-2xl text-white drop-shadow group-hover:opacity-0 transition">{c.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
