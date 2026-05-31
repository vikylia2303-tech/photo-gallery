'use client'

import { useState, useRef } from 'react'

interface Gallery {
  id: string
  name: string
}

export default function AdminUpload() {
  const [selectedGallery, setSelectedGallery] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [galleries, setGalleries] = useState<Gallery[]>([
    { id: '1', name: 'Portraits' },
    { id: '2', name: 'Weddings' },
    { id: '3', name: 'Events' },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!selectedGallery || files.length === 0) {
      alert('Please select a gallery and files')
      return
    }

    setUploading(true)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('gallery', selectedGallery)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }
      }

      alert('Photos uploaded successfully!')
      setFiles([])
      setSelectedGallery('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      alert('Error uploading photos')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-lg font-semibold mb-2">Select Gallery</label>
        <select
          value={selectedGallery}
          onChange={(e) => setSelectedGallery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Choose a gallery...</option>
          {galleries.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2">Select Photos</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Click to select or drag and drop
          </button>
          <p className="text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Selected files: {files.length}</p>
            <ul className="space-y-1 text-sm text-gray-600">
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !selectedGallery || files.length === 0}
        className="btn btn-primary w-full disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>
    </div>
  )
}
