import { NextResponse } from 'next/server'
import crypto from 'crypto'

async function getCloudinaryTimestamp(cloudName: string): Promise<number> {
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}`, {
    method: 'HEAD',
  })
  const dateHeader = res.headers.get('date')
  if (dateHeader) {
    return Math.floor(new Date(dateHeader).getTime() / 1000)
  }
  return Math.floor(Date.now() / 1000)
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mime = file.type || 'application/octet-stream'
    const dataUri = `data:${mime};base64,${base64}`

    const timestamp = await getCloudinaryTimestamp(cloudName)
    const toSign = `timestamp=${timestamp}${apiSecret}`
    const signature = crypto.createHash('sha1').update(toSign).digest('hex')

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: dataUri,
          api_key: apiKey,
          timestamp,
          signature,
        }),
      }
    )

    const result = await uploadRes.json()

    if (!uploadRes.ok) {
      const message = result?.error?.message || 'Cloudinary upload failed'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    console.error('Upload error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
