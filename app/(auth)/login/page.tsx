'use client' // 因为我们在这个页面上要收集用户的点击和输入事件，所以必须是客户端组件

import { useState } from 'react'
import { signIn } from 'next-auth/react' // 这是 NextAuth 专门为前端提供的一键登录方法
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  // 两个用于收集输入框文字的箱子
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('') // 如果密码错了，用来显示红字的箱子

  // 重点！当用户点击“登录按钮”时触发的函数
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault() // 阻止网页傻乎乎地自动刷新

    // signIn 就等同于之前去敲保安大门的动作
    const res = await signIn('credentials', {
      redirect: false, // 告诉系统：万一登出了错也别乱跳页，我自己在这处理
      email: email,
      password: password,
    })

    if (res?.error) {
      // 如果保安 return null 了，就会走到这里
      setErrorText('邮箱或密码不正确，请重新输入！')
    } else {
      // 登录成功了！强行把用户引航重定向回商城主页！
      router.push('/')
    }
  }

  return (
    // 用极美的背景渐变和居中对齐包裹
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* 玻璃拟态高雅白底卡片 */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mt-4 mb-2 text-center text-3xl font-extrabold tracking-tight text-gray-800">
          Welcome Back
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Please enter your details to sign in.
        </p>

        {/* 表单一定要套在 form 里，这样按回车键也能触发表单的 onSubmit */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // 只要一打字，就把字装进 email 箱子里
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="••••••••"
            />
          </div>

          {/* 如果报错箱子里有文字，就立刻爆出红色警报区 */}
          {errorText && (
            <div className="flex items-center rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
              ⚠️ {errorText}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white shadow-lg shadow-gray-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-gray-900/40 active:translate-y-0"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
