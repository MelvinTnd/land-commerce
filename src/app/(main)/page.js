import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import ProduitsSection from '@/components/home/ProduitsSection'
import VendeursSection from '@/components/home/VendeursSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import PromotionsSection from '@/components/home/PromotionsSection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <VendeursSection />
      <PromotionsSection />
      <ProduitsSection />
      <FeaturesSection />
    </div>
  )
}

