import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero слайдер */}
      <section className="h-[600px] bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-serif mb-4">Your Photo Gallery</h1>
          <p className="text-xl text-gray-700">Professional photography portfolio</p>
        </div>
      </section>

      {/* Портфолио */}
      <section className="container py-20">
        <h2 className="text-4xl font-serif mb-12 text-center">Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/portfolio/portraits" className="group cursor-pointer">
            <div className="h-80 bg-gray-300 overflow-hidden rounded-lg group-hover:opacity-75 transition">
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                Portraits
              </div>
            </div>
            <h3 className="text-2xl font-serif mt-4">Portraits</h3>
          </Link>
          <Link href="/portfolio/weddings" className="group cursor-pointer">
            <div className="h-80 bg-gray-300 overflow-hidden rounded-lg group-hover:opacity-75 transition">
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                Weddings
              </div>
            </div>
            <h3 className="text-2xl font-serif mt-4">Weddings</h3>
          </Link>
        </div>
      </section>

      {/* Про мене */}
      <section className="container py-20">
        <h2 className="text-4xl font-serif mb-8">About Me</h2>
        <p className="text-lg leading-relaxed max-w-3xl">
          Welcome to my photography studio. I specialize in portrait and event photography.
          With over 10 years of experience, I capture authentic moments and create timeless memories.
        </p>
      </section>
    </div>
  )
}
