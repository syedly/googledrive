import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!apiKey || !apiSecret || !cloudName) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    const timestamp = Math.floor(Date.now() / 1000)
    // Sign using SHA-1 per Cloudinary docs
    const toSign = `timestamp=${timestamp}`
    const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex')

    return NextResponse.json(
      { signature, timestamp, apiKey, cloudName },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache'
        }
      }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
