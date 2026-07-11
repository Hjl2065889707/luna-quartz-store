'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gem } from 'lucide-react'
import { siteConfig } from '@/lib/site'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('')

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setErrorText('Invalid email or password. Please try again.')
      return
    }

    router.push('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF7F1] px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-[#E8E1D8] bg-white p-8 shadow-[0_24px_70px_rgba(74,50,39,0.12)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#B76E79] text-white">
          <Gem size={22} />
        </div>
        <h1 className="mt-6 text-center text-3xl font-black tracking-tight text-[#2F2523]">
          Welcome back
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-[#7B6D66]">
          Sign in to manage your {siteConfig.name} demo account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2F2523]">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[#E8E1D8] bg-white px-4 py-3 text-[#2F2523] outline-none transition focus:border-[#B76E79] focus:ring-2 focus:ring-[#E9D8DC]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2F2523]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[#E8E1D8] bg-white px-4 py-3 text-[#2F2523] outline-none transition focus:border-[#B76E79] focus:ring-2 focus:ring-[#E9D8DC]"
              placeholder="Enter your password"
            />
          </div>

          {errorText && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              {errorText}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-[#2F2523] px-4 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(74,50,39,0.18)] transition hover:bg-[#4A3732] active:scale-[0.98]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7B6D66]">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-[#8F4F5B]">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
