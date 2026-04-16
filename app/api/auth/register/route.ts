import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password, country, state } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password is required!' },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    })

    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        country,
        state,
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 }) // 201 表示 Created 创建成功
  } catch (error) {
    console.error('注册过程中发生了意料外的崩溃:', error)

    // 给前端返回一个体面的 500
    return NextResponse.json(
      { error: '对不起，服务器开小差了，请稍后再试' },
      { status: 500 },
    )
  }
}
