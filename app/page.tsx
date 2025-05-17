import Hero from "@/components/sections/hero/Hero"
import Services from "@/components/sections/services/Services"
import Plans from "@/components/sections/plans/Plans"
import Faq from "@/components/sections/faq/Faq"
import CTA from "@/components/sections/cta/CTA"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero />
      <Services />
      <Plans />
      <Faq />
      <CTA />
    </main>
  )
}
