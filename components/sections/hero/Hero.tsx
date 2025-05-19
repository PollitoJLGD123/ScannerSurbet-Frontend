import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  return (
    <section id="home" className="w-full py-12 md:py-24 lg:pt-24 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                Software de Surebets en Tiempo Real
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Maximiza tus ganancias con nosotros, aprende a invertir y genera dinero de forma segura y confiable.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
              <Button size="lg" className="bg-gradient-to-r from-green-700 to-green-900 hover:from-green-900 hover:to-green-950 text-white shadow-md">
                Regístrate Ahora
              </Button>
              <Button size="lg" variant="outline" className="border-2 shadow-sm">Saber más</Button>
            </div>
          </div>
          <div className="justify-self-center flex">
            <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden">
              <Image
                src="/earn_money.PNG"
                alt="Arbisure Dashboard"
                width={800}
                height={500}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Genera ganancias con surebets en tiempo real</h2>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-green-700 to-green-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
