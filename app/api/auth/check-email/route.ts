import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ exists: false })
    }

    // 极致的轻量化查询，只取 ID，避免把隐私数据拉到内存里
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    // 用双感叹号将对象强行转化为布尔值 (如果有 user 返回 true，如果是 null 返回 false)
    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error('Email checking error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
