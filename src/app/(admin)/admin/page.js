'use client'
import { useEffect } from 'react'

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/admin/login`
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F5F0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #1B6B3A', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#6B7280', fontFamily: 'sans-serif' }}>Redirection vers l'espace administrateur...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
