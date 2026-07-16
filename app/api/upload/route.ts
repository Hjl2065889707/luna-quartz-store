import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

// 允许的图片类型
const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
} as const
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

type AllowedImageType = keyof typeof ALLOWED_TYPES

const isAllowedImageType = (type: string): type is AllowedImageType =>
  type in ALLOWED_TYPES

const hasValidImageSignature = (buffer: Buffer, type: AllowedImageType) => {
  if (type === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  }

  if (type === 'image/png') {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  }

  if (type === 'image/webp') {
    return (
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    )
  }

  if (type === 'image/avif') {
    return (
      buffer.toString('ascii', 4, 8) === 'ftyp' &&
      buffer.toString('ascii', 8, 32).includes('avif')
    )
  }

  return false
}

export async function POST(req: NextRequest) {
  // 1. 权限校验
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (process.env.ENABLE_LOCAL_UPLOADS !== 'true') {
    return NextResponse.json(
      {
        error:
          'Image uploads are disabled in this deployment. Use static demo images or configure object storage for production uploads.',
      },
      { status: 501 },
    )
  }

  // 2. 解析 FormData
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Please choose a file' }, { status: 400 })
  }

  // 3. 校验文件类型和大小
  if (!isAllowedImageType(file.type)) {
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

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  if (!hasValidImageSignature(buffer, file.type)) {
    return NextResponse.json(
      { error: 'The uploaded file is not a valid image' },
      { status: 400 },
    )
  }

  // 4. 生成唯一文件名。扩展名来自服务端校验过的 MIME type，不信任用户原始文件名。
  const ext = ALLOWED_TYPES[file.type]
  const fileName = `${Date.now()}-${randomUUID()}.${ext}`

  // 5. 写入 public/uploads/
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, fileName)
  await writeFile(filePath, buffer)

  // 6. 返回可访问的 URL
  return NextResponse.json({ url: `/uploads/${fileName}` })
}
