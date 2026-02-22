import { connect } from './mongoose'
import UserModel from './models/user'
import FileModel from './models/file'

type CreateFileInput = {
  name: string
  type: string
  size: number
  url: string
  parentFolderId?: string | null
  userId: string
}

export async function createFileMetadata(data: CreateFileInput) {
  await connect()

  const file = await FileModel.create({
    name: data.name,
    type: data.type,
    size: data.size,
    url: data.url,
    parentFolderId: data.parentFolderId || null,
    userId: data.userId,
  })

  await UserModel.findByIdAndUpdate(data.userId, { $inc: { usedSpace: Number(data.size) } })

  return file
}

export async function fetchFilesByParent(userId: string, parentFolderId?: string | null) {
  await connect()
  return FileModel.find({ userId, parentFolderId: parentFolderId ?? null, isTrashed: false }).sort({ createdAt: -1 }).lean()
}

export async function fetchStarredFiles(userId: string) {
  await connect()
  return FileModel.find({ userId, isStarred: true, isTrashed: false }).sort({ createdAt: -1 }).lean()
}

export async function fetchTrashedFiles(userId: string) {
  await connect()
  return FileModel.find({ userId, isTrashed: true }).sort({ createdAt: -1 }).lean()
}

export async function fetchRecentFiles(userId: string, limit = 50) {
  await connect()
  return FileModel.find({ userId, isTrashed: false }).sort({ createdAt: -1 }).limit(limit).lean()
}

export async function renameFile(fileId: string, name: string) {
  await connect()
  return FileModel.findByIdAndUpdate(fileId, { name }, { new: true }).lean()
}

export async function toggleStar(fileId: string, value: boolean) {
  await connect()
  return FileModel.findByIdAndUpdate(fileId, { isStarred: value }, { new: true }).lean()
}

export async function moveToTrash(fileId: string) {
  await connect()
  return FileModel.findByIdAndUpdate(fileId, { isTrashed: true }, { new: true }).lean()
}

export async function deletePermanently(fileId: string) {
  await connect()
  const file = await FileModel.findById(fileId)
  if (!file) return null

  await file.deleteOne()
  await UserModel.findByIdAndUpdate(file.userId, { $inc: { usedSpace: -Number(file.size) } })
  return { ok: true }
}
