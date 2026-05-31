import Image from 'next/image'

interface PageProps {
    params: Promise<{
          category: string
    }>
}

export default async function PortfolioCategory({ params }: PageProps) {
    const resolvedParams = await params
    const categoryName = resolvedParams.category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  // Mock photos - в реальном приложении это будет из БД
  const photos = [
    { id: '1', name: 'photo-1.jpg', full: 'photo-1-full.jpg' },
    { id: '2', name: 'photo-2.jpg', full: 'photo-2-full.jpg' },
    { id: '3', name: 'photo-3.jpg', full: 'photo-3-full.jpg' },
    { id: '4', name: 'photo-4.jpg', full: 'photo-4-full.jpg' },
      ]

  return (
        <div className="container py-12">
              <h1 className="text-4xl font-serif mb-12">{categoryName}</h1>h1>
        
              <div className="gallery-grid">
                {photos.map((photo) => (
                    <div key={photo.id} className="photo-item group relative">
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                              <span className="text-gray-500">Photo placeholder</span>span>
                                </div>div>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                              <button className="bg-white text-dark px-6 py-2 rounded font-semibold">
                                                              Download
                                              </button>button>
                                </div>div>
                    </div>div>
                  ))}
              </div>div>
        
              <div className="mt-12 flex gap-4">
                      <button className="btn btn-primary">Download All as ZIP</button>button>
                      <button className="btn btn-secondary">Download Selected</button>button>
              </div>div>
        </div>div>
      )
}</div>
