'use client'
import { SessionProvider } from 'next-auth/react'

/**
 * Wraps children with NextAuth SessionProvider.
 * Must be a Client Component since SessionProvider uses React context.
 */
export function AuthProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
