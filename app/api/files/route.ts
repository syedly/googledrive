import { NextResponse } from 'next/server'
import { createFileMetadata, fetchFilesByParent, fetchStarredFiles, fetchTrashedFiles, fetchRecentFiles } from '../../../lib/fileService'

function parseCookie(cookie = '') {
  return Object.fromEntries(cookie.split(';').map(c => c.trim().split('=')))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const cookie = req.headers.get('cookie') || ''
    const parsed = parseCookie(cookie)
    const userId = parsed.session
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const payload = { ...body, userId }
    const created = await createFileMetadata(payload)

    return NextResponse.json(created)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const parsed = parseCookie(cookie)
    const userId = parsed.session
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const url = new URL(req.url)
    const parentFolderId = url.searchParams.get('parentFolderId')
    const filter = url.searchParams.get('filter')

    if (filter === 'starred') {
      const files = await fetchStarredFiles(userId)
      return NextResponse.json(files)
    }

    if (filter === 'trash') {
      const files = await fetchTrashedFiles(userId)
      return NextResponse.json(files)
    }

    if (filter === 'recent') {
      const files = await fetchRecentFiles(userId)
      return NextResponse.json(files)
    }

    const files = await fetchFilesByParent(userId, parentFolderId)
    return NextResponse.json(files)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
