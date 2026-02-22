import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connect } from '../../../../lib/mongoose'
import UserModel from '../../../../lib/models/user'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    await connect()
    const user = await UserModel.findOne({ email })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = bcrypt.compareSync(password, (user as any).password)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const res = NextResponse.json({ ok: true })
    res.headers.append('Set-Cookie', `session=${user._id.toString()}; Path=/; HttpOnly; SameSite=Lax`)
    return res
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
