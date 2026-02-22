'use client'

import React, { useRef, useState } from 'react'

type FileWithProgress = {
  file: File
  progress: number
  status: 'idle' | 'uploading' | 'done' | 'error'
  url?: string
  error?: string
}

export default function UploadButton() {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files
    if (!list) return
    const newFiles: FileWithProgress[] = Array.from(list).map(f => ({ file: f, progress: 0, status: 'idle' }))
    setFiles(prev => [...prev, ...newFiles])
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const list = e.dataTransfer.files
    if (!list) return
    const newFiles: FileWithProgress[] = Array.from(list).map(f => ({ file: f, progress: 0, status: 'idle' }))
    setFiles(prev => [...prev, ...newFiles])
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function removeFile(idx: number) {
    setFiles(s => s.filter((_, i) => i !== idx))
  }

  async function uploadAll() {
    if (files.length === 0) return

    setUploading(true)
    const updated = [...files]

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i]
      try {
        item.status = 'uploading'
        setFiles([...updated])

        // Upload to our server (server will upload to Cloudinary)
        const formData = new FormData()
        formData.append('file', item.file)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!uploadRes.ok) {
          const errData = await uploadRes.json()
          throw new Error(errData?.error || `Upload failed: ${uploadRes.status}`)
        }

        const cloudData = await uploadRes.json()

        item.status = 'done'
        item.url = cloudData.secure_url
        item.progress = 100
        setFiles([...updated])

        // Save metadata to server
        await fetch('/api/files', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.file.name,
            type: item.file.type,
            size: item.file.size,
            url: cloudData.secure_url
          })
        })
      } catch (err: any) {
        item.status = 'error'
        item.error = err?.message || 'Upload error'
        setFiles([...updated])
      }
    }

    setUploading(false)
  }

  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-3 py-2 bg-emerald-500 text-black rounded">
        Upload
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="w-full max-w-2xl bg-slate-900 p-6 rounded"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <button
                onClick={() => {
                  setOpen(false)
                  setFiles([])
                }}
                className="px-3 py-1 rounded bg-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600"
                >
                  Choose files
                </button>
                <div className="text-sm text-slate-400">
                  or drag &amp; drop files into this window
                </div>
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                onChange={onFilesSelected}
                accept="*/*"
                className="sr-only"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-auto mb-4">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-800 rounded flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium">{f.file.name}</div>
                    <div className="text-xs text-slate-400">
                      {Math.round(f.file.size / 1024)} KB — {f.status}
                    </div>
                    {f.error && (
                      <div className="text-xs text-red-400">{f.error}</div>
                    )}
                    {f.progress > 0 && f.progress < 100 && (
                      <div className="text-xs text-slate-400 mt-1">
                        {f.progress}%
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="px-2 py-1 rounded bg-slate-700 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={uploadAll}
                disabled={uploading || files.length === 0}
                className="px-4 py-2 bg-emerald-500 text-black rounded disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload all'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
