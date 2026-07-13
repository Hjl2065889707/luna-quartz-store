'use client'

import { useSession } from 'next-auth/react'
import UserMenu from './UserMenu'
import { Button } from './ui/Button'

export default function AuthNav() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="h-10 w-24" aria-hidden="true" />
  }

  if (session?.user) {
    return (
      <UserMenu
        name={session.user.name || 'User'}
        email={session.user.email || ''}
      />
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button href="/login" variant="ghost" size="sm" className="hidden md:flex">
        Log in
      </Button>
      <Button
        href="/signup"
        variant="primary"
        size="sm"
        className="hidden md:flex"
      >
        Sign Up
      </Button>
    </div>
  )
}
