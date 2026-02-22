import mongoose from 'mongoose'

const FileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    parentFolderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isStarred: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.File || mongoose.model('File', FileSchema)
