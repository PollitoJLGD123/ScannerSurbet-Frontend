import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-teal-500/10 to-blue-600/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Comienza tu prueba gratuita</h2>
            <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Ofrecemos 1 día gratis para que puedas probar la funcionalidad de nuestro escáner.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Button size="lg" className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-lg">
              Solicita tu demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
