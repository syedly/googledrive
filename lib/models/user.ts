import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalSpace: { type: Number, default: 524288000 },
    usedSpace: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
