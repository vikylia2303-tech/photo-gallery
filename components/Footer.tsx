import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-serif mb-4">About</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-serif mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Portraits
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Weddings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Events
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-serif mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="mailto:hello@example.com" className="hover:text-white">
                  Email
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Photo Gallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
