import mongoose from 'mongoose'

const MONGO_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/cloudvault'

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn?: typeof mongoose | null; promise?: Promise<typeof mongoose> | null }
}

if (!global._mongoose) global._mongoose = { conn: null, promise: null }

export async function connect() {
  if (global._mongoose.conn) return global._mongoose.conn
  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose.connect(MONGO_URL).then(m => m)
  }
  global._mongoose.conn = await global._mongoose.promise
  return global._mongoose.conn
}

export default mongoose
