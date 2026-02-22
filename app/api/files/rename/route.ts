import { NextResponse } from 'next/server'
import { renameFile } from '../../../../lib/fileService'

export async function POST(req: Request) {
  try {
    const { fileId, name } = await req.json()
    if (!fileId || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const updated = await renameFile(fileId, name)
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
