export default function AboutPage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-serif mb-12">About Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg leading-relaxed">
              Welcome to my photography studio. I specialize in portrait and event photography,
              capturing authentic moments that tell your story. With over 10 years of experience,
              I've had the privilege of documenting countless weddings, celebrations, and intimate portraits.
            </p>

            <h2 className="text-2xl font-serif mt-12">My Style</h2>
            <p className="text-lg leading-relaxed">
              I believe photography is about capturing the essence of a moment — the genuine emotions,
              the connections between people, and the beauty in everyday life. My work is characterized
              by natural lighting, authentic poses, and timeless compositions.
            </p>

            <h2 className="text-2xl font-serif mt-12">Services</h2>
            <ul className="space-y-3 text-lg">
              <li>✓ Portrait Sessions</li>
              <li>✓ Wedding Photography</li>
              <li>✓ Event Coverage</li>
              <li>✓ Family Shoots</li>
              <li>✓ Commercial Photography</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-gray-300 h-80 rounded-lg flex items-center justify-center text-gray-500">
            Profile Photo
          </div>

          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Email:</strong>
                <br />
                <a href="mailto:hello@example.com" className="text-blue-600 hover:underline">
                  hello@example.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>
                <br />
                <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                  +1 (234) 567-890
                </a>
              </p>
              <p>
                <strong>Location:</strong>
                <br />
                New York, USA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
