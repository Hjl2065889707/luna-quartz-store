import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { writeFile } from 'fs/promises'
import path from 'path'

// 允许的图片类型
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  // 1. 权限校验
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. 解析 FormData
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Please choose a file' }, { status: 400 })
  }

  // 3. 校验文件类型和大小
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Only JPG, PNG, WebP and AVIF files are supported' },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File size must be under 5MB' },
      { status: 400 },
    )
  }

  // 4. 生成唯一文件名（时间戳 + 随机数 + 扩展名）
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  // 5. 写入 public/uploads/
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
  await writeFile(filePath, buffer)

  // 6. 返回可访问的 URL
  return NextResponse.json({ url: `/uploads/${fileName}` })
}
