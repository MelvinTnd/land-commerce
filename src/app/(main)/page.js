import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import ProduitsSection from '@/components/home/ProduitsSection'
import VendeursSection from '@/components/home/VendeursSection'
import PromotionsSection from '@/components/home/PromotionsSection'
import ReassuranceSection from '@/components/home/ReassuranceSection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <VendeursSection />
      <PromotionsSection />
      <ProduitsSection />
      <ReassuranceSection />
    </div>
  )
}

