'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function DetailGalerie({ produit }) {
  const [imageActive, setImageActive] = useState(0)

  if (!produit) return null

  // Fallback to multiple images if only one is provided, just for UI demonstration
  const images = [
    produit.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQWt3NsHUOOcKgwDibsPPLilYMKO3ygaYWDdvHdsDg4LCV8TJwv0kSw5EGxRz7o_NoxtE39htKAzNOxFGDp8W7asYbM-Txolc1fRRmELgtKN-uGOi83rb0agNO706CIkerjUB4zKOMWpk7o6y6n1j30_lGgaxXcWLNJU38_Gf36l2xgHxgk9E65T8yx1xkIlN5pBnGaqj_mQWuEuzF-xXWpPd6aBEsJh6a-N9i44F-1H2mNrddeHLM_TUvy7dHjVida3nsiXz3e9E',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuArFSaPLLYoQ2B9geElveMg62mhBDu-oY0qqMtyZb84vbbJiT8TjxvMRUlBWDe-5S229uLCTRp0lpRp4RKrgR474X653n_ZAC6ogOb96KdjomYMR92phme4pYG9n9tTt1ppg1YHBgl61KhKCMLW48AxsMCB5rZxcG-dADp6wXy2m3TEwOyhCR9JKzMq1bGV9G52m0JkXeRUs3HaqxzXUWIhEHyG4D7HhQBAJnJncOKKbIgcf1xPMwXfXhjjwooj4saRxcuebT3eeLw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDpCuM1raMH_d0yZ4seMOYQeSAXkpCLTGp8PSjBJEqnwjEtefivizDw7wYqIvFGMkRu6XapStFUssIpLwIuedznmegaIr4w4KEIqtoNOrQLpn4bGQLIxwOamAloySaxm2v_62WszW4vc0yj0Pl6AWHxoYIoNM-VgUZzsHhHQ5ASSqF05kBhhq1jZ-Y65gzhmZOuDkPpzO93rYFQAWghChe6Y_UTJrfKlJcZWYf9fwC59HtPheOUIUoZSWVvjKAPot5Fm4RfR71iOZE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC7B24TvrRqFzQ4U1tMmw0Q4p0zw9T0_KcB6dCw4dtViRhK13O-XXtDqmwmbe7wvL7le1IzIMMA02Ev4f8LqR6HtY8UKdx3jBtyAfNwkaeI2_IiBvgrea-JKH5fbtPYFKNv7_-Zw-AQk-DQ-ej_Y9II5vuJUZegm02TEPnDZAlKnETp88NsvbFucp8oLsbBXJDqh0aBElMD83Vq-OGZExkZki4_1MzSJKRrbW_trJm0dce9yDNbD_8HTb7Y_DKsUImnf1MAt2W-kTA',
  ]

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
        style={{ height: '480px', background: '#F0EDE8' }}
      >
        <Image
          src={images[imageActive]}
          alt="Produit"
          fill
          className="object-cover transition-all duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setImageActive(i)}
            className="rounded-2xl overflow-hidden transition-all"
            style={{
              height: '80px',
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
            />
          </div>
          </button>
        ))}
      </div>

    </div>
  )
}