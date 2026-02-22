import { NextResponse } from 'next/server'
import { toggleStar } from '../../../../lib/fileService'

export async function POST(req: Request) {
  try {
    const { fileId, value } = await req.json()
    if (!fileId || typeof value !== 'boolean') return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const updated = await toggleStar(fileId, value)
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
