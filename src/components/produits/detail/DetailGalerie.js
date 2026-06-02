'use client'
import { useState } from 'react'
import Image from 'next/image'
import { getProductImage } from '@/lib/images'

export default function DetailGalerie({ produit }) {
  const [imageActive, setImageActive] = useState(0)

  if (!produit) return null

  // Image principale avec préfixe API
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api').replace('/api', '')
  let mainImage = getProductImage(produit)
  if (mainImage && mainImage.startsWith('/storage/')) mainImage = apiBase + mainImage

  // On n'affiche que l'image principale si c'est la seule réelle
  // Les autres images étaient des fallbacks Unsplash génériques qui peuvent prêter à confusion
  const images = [mainImage]

  return (
    <div className="flex flex-col gap-4">

      {/* Badges */}
      <div className="flex gap-2">
        <span
          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{ background: '#1B6B3A', color: 'white' }}
        >
          Pièce Unique
        </span>
        <span
          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{ background: '#F0EDE8', color: '#374151' }}
        >
          Sculpté Main
        </span>
      </div>

      {/* Image principale */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ height: '380px', background: '#F0EDE8' }}
      >
        <Image
          src={images[imageActive]}
          alt="Produit"
          fill
          className="object-cover transition-all duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setImageActive(i)}
            className="rounded-2xl overflow-hidden transition-all"
            style={{
              height: '70px',
              border: imageActive === i ? '2px solid #1B6B3A' : '2px solid transparent',
              opacity: imageActive === i ? 1 : 0.6,
            }}
          >
          <div className="relative w-full h-full">
            <Image
              src={img}
              alt={`Vue ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          </div>
          </button>
        ))}
      </div>

    </div>
  )
}