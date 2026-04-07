'use client'
import { useState } from 'react'

export default function ProduitsPagination({ total = 12 }) {
  const [pageActive, setPageActive] = useState(1)

  const pages = [1, 2, 3, '...', total]

  return (
    <div className="flex items-center justify-center gap-2 mt-12">

      {/* Précédent */}
      <button
        onClick={() => setPageActive((p) => Math.max(1, p - 1))}
        disabled={pageActive === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{
          background: 'white',
          border: '1px solid #E5E7EB',
          color: pageActive === 1 ? '#D1D5DB' : '#374151',
          cursor: pageActive === 1 ? 'not-allowed' : 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Pages */}
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && setPageActive(page)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
          style={{
            background: pageActive === page ? '#1B6B3A' : 'white',
            color: pageActive === page ? 'white' : page === '...' ? '#9CA3AF' : '#374151',
            border: pageActive === page ? 'none' : '1px solid #E5E7EB',
            cursor: page === '...' ? 'default' : 'pointer',
            boxShadow: pageActive === page ? '0 4px 12px rgba(27,107,58,0.3)' : '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          {page}
        </button>
      ))}

      {/* Suivant */}
      <button
        onClick={() => setPageActive((p) => Math.min(total, p + 1))}
        disabled={pageActive === total}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{
          background: 'white',
          border: '1px solid #E5E7EB',
          color: pageActive === total ? '#D1D5DB' : '#374151',
          cursor: pageActive === total ? 'not-allowed' : 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

    </div>
  )
}