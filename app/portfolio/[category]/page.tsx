interface PageProps {
  params: Promise<{
    category: string
  }>
}

const labels: Record<string, string> = {
  portraits: 'Портреты',
  weddings: 'Свадьбы',
  events: 'События',
}

export default async function PortfolioCategory({ params }: PageProps) {
  const { category } = await params
  const title = labels[category] ?? category.charAt(0).toUpperCase() + category.slice(1)

  const photos = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    src: `https://picsum.photos/seed/${category}-${i}/800/1000`,
  }))

  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <p className="overline mb-4">Портфолио</p>
          <h1 className="section-title text-5xl md:text-6xl">{title}</h1>
        </div>

        <div className="gallery-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={`${title} ${photo.id + 1}`} />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="#contact" className="btn">Записаться на съёмку</a>
        </div>
      </div>
    </div>
  )
}
