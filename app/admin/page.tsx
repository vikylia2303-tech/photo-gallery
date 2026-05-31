'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminUpload from '@/components/AdminUpload'
import AdminGalleries from '@/components/AdminGalleries'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'galleries'>('galleries')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif">Admin Panel</h1>
          <Link href="/" className="btn btn-secondary">
            Back to Site
          </Link>
        </div>

        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('galleries')}
            className={`pb-4 font-semibold ${
              activeTab === 'galleries'
                ? 'border-b-2 border-dark'
                : 'text-gray-600'
            }`}
          >
            Manage Galleries
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-4 font-semibold ${
              activeTab === 'upload'
                ? 'border-b-2 border-dark'
                : 'text-gray-600'
            }`}
          >
            Upload Photos
          </button>
        </div>

        <div className="bg-white rounded-lg p-8">
          {activeTab === 'galleries' && <AdminGalleries />}
          {activeTab === 'upload' && <AdminUpload />}
        </div>
      </div>
    </div>
  )
}
