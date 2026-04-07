export default function ReviewsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-[24px] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Customer Reviews</h3>
            <p className="text-xs text-gray-500 mt-1">See what buyers are saying about your crafts.</p>
          </div>
          <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px]">star</span>
            4.9 / 5.0 Average
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { name: "Sarah M.", date: "2 days ago", rating: 5, product: "Queen Mother Bronze Bust", text: "Absolutely stunning piece. The craftsmanship is incredible and shipping was very fast to Dakar!" },
            { name: "John K.", date: "1 week ago", rating: 5, product: "Fon Dynasty Bronze Mask", text: "Looks exactly like the photos, the weight and quality feels extremely premium. Great artisan." },
            { name: "Aminata", date: "2 weeks ago", rating: 4, product: "Indigo Ceremonial Wrap", text: "The fabric is amazing. Just took a bit longer to arrive than I initially expected, but totally worth it." }
          ].map((review, i) => (
            <div key={i} className="p-5 border border-gray-100 rounded-[16px] bg-gray-50/30 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 text-sm">
                {review.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-gray-900">{review.name}</h4>
                    <span className="text-[10px] text-gray-400 font-medium">• {review.date}</span>
                  </div>
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="material-symbols-outlined text-[12px]">{j < review.rating ? 'star' : 'star_outline'}</span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">Purchased: <span className="text-green-800 font-extrabold">{review.product}</span></p>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">"{review.text}"</p>
                
                <button className="text-[11px] font-bold text-[#1B6B3A] hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">reply</span> Reply to customer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
