import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  return (
    <section id="home" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Real-Time Surebets Software
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Maximize your profits with us, learn to invest and generate money safely and reliably.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white">
                Register Now
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=500&width=800"
                alt="Arbisure Dashboard"
                width={800}
                height={500}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Generate profits with real-time surebets</h2>
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
