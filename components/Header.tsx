'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-gray-200">
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="text-2xl font-serif">
          Photo Gallery
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:opacity-60">
            Home
          </Link>
          <div className="group relative">
            <button className="hover:opacity-60">Portfolio ▼</button>
            <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block py-2 min-w-48">
              <Link href="/portfolio/portraits" className="block px-4 py-2 hover:bg-gray-100">
                Portraits
              </Link>
              <Link href="/portfolio/weddings" className="block px-4 py-2 hover:bg-gray-100">
                Weddings
              </Link>
              <Link href="/portfolio/events" className="block px-4 py-2 hover:bg-gray-100">
                Events
              </Link>
            </div>
          </div>
          <Link href="/about" className="hover:opacity-60">
            About
          </Link>
          <Link href="/admin" className="btn btn-primary">
            Admin
          </Link>
        </nav>

        <button
          className="md:hidden text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden border-t border-gray-200 py-4">
          <div className="container flex flex-col gap-4">
            <Link href="/" className="hover:opacity-60">
              Home
            </Link>
            <Link href="/portfolio/portraits" className="hover:opacity-60">
              Portraits
            </Link>
            <Link href="/portfolio/weddings" className="hover:opacity-60">
              Weddings
            </Link>
            <Link href="/portfolio/events" className="hover:opacity-60">
              Events
            </Link>
            <Link href="/about" className="hover:opacity-60">
              About
            </Link>
            <Link href="/admin" className="btn btn-primary">
              Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
