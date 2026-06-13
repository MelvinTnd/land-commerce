'use client'
import { useState } from 'react'

export default function ProduitsPagination({ total = 12 }) {
  const [pageActive, setPageActive] = useState(1)

  const pages = total <= 5
    ? Array.from({ length: total }, (_, i) => i + 1)
    : [1, 2, 3, '...', total]

  return (
    <div className="flex items-center justify-center gap-1 mt-12 pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>

      {/* Précédent */}
      <button
        onClick={() => setPageActive(p => Math.max(1, p - 1))}
        disabled={pageActive === 1}
        className="flex items-center gap-1.5 px-4 py-2 border text-[11px] font-black uppercase tracking-widest transition-colors"
        style={{
          borderColor: '#E5E7EB',
          color: pageActive === 1 ? '#D1D5DB' : '#0D0D0D',
          cursor: pageActive === 1 ? 'not-allowed' : 'pointer',
        }}>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Préc.
      </button>

      {/* Pages */}
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && setPageActive(page)}
          className="w-9 h-9 flex items-center justify-center text-[12px] font-black border transition-colors"
          style={{
            background: pageActive === page ? '#0D0D0D' : 'white',
            color: pageActive === page ? 'white' : page === '...' ? '#9CA3AF' : '#0D0D0D',
            borderColor: pageActive === page ? '#0D0D0D' : '#E5E7EB',
            cursor: page === '...' ? 'default' : 'pointer',
          }}>
          {page}
        </button>
      ))}

      {/* Suivant */}
      <button
        onClick={() => setPageActive(p => Math.min(total, p + 1))}
        disabled={pageActive === total}
        className="flex items-center gap-1.5 px-4 py-2 border text-[11px] font-black uppercase tracking-widest transition-colors"
        style={{
          borderColor: '#E5E7EB',
          color: pageActive === total ? '#D1D5DB' : '#0D0D0D',
          cursor: pageActive === total ? 'not-allowed' : 'pointer',
        }}>
        Suiv.
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

    </div>
  )
}