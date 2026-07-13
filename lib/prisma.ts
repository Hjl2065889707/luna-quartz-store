import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

const adapter = new PrismaBetterSqlite3({ url: databaseUrl })

// 第一大件：数据库的长链接保持点 (Singleton)
// 这个代码的唯一作用是：保证在写代码（热更新重新编译）时，
// 我们的 Node.js 不会疯狂创建几百次数据库连接导致系统崩溃报错：Too many connections。
// 它就像在说：“如果之前在这个全局里连过数据库了，就用旧连接复用好吗？”
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 如果之前没有，就在这里 new PrismaClient() 真正建立一次连接
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // 如果想要看底层具体查询了什么原本的 SQL 语句，可以把 "query" 写进这行里
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

// 把建立好的连接挂载到 Node.js 的全局对象上（仅限开发环境）
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
