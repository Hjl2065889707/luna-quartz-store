import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: string // ← 扩展 User 类型
  }
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}
