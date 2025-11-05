import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';

export default function HomePage() {
  return (
    // Kita hapus div .container dari layout, jadi kita bungkus di sini
    <div className="container">
      <HeroSection />
      <CategoriesSection />
    </div>
  );
}