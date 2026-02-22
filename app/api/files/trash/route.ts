import { NextResponse } from 'next/server'
import { moveToTrash } from '../../../../lib/fileService'

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json()
    if (!fileId) return NextResponse.json({ error: 'Missing fileId' }, { status: 400 })

    const updated = await moveToTrash(fileId)
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
