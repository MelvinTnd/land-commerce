import BlogHero from '@/components/blog/BlogHero'
import BlogUne from '@/components/blog/BlogUne'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogForum from '@/components/blog/BlogForum'

export default function BlogPage() {
  return (
    <div className="bg-[#F9FAFA] min-h-screen font-sans">
      <BlogHero />

      {/* Une + Sidebar Container */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
          <BlogUne />
          <BlogSidebar />
        </div>
      </section>

      {/* Forum section remains untouched as requested */}
      <BlogForum />
    </div>
  )
}