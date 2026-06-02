'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import { useEffect } from 'react'

function SyncToken() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.apiToken) {
      localStorage.setItem('auth_token', session.user.apiToken)
    }
  }, [session])

  return null
}

export function AuthProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      <SyncToken />
      {children}
    </SessionProvider>
  )
}
