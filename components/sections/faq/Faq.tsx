import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿Tienen un período de prueba?",
    answer:
      "Sí, ofrecemos una prueba gratuita de 1 día para que puedas probar la funcionalidad de nuestro escáner. Puedes solicitar tu demo desde nuestro sitio web.",
  },
  {
    question: "¿Qué significa surebet?",
    answer:
      "Las surebets son oportunidades de apuesta que garantizan una ganancia sin importar el resultado. Ocurren cuando las casas de apuestas ofrecen diferentes cuotas para el mismo evento, permitiendo apostar a todos los resultados posibles y asegurar un beneficio.",
  },
  {
    question: "¿Qué son las surebets Prematch y Live?",
    answer:
      "Las surebets prematch son oportunidades de apuesta disponibles antes de que comience un evento, mientras que las surebets live ocurren durante el evento. Nuestra plataforma ofrece herramientas para ambos tipos, permitiéndote maximizar tus ganancias en diferentes escenarios.",
  },
  {
    question: "¿Cuánto puedo ganar?",
    answer:
      "Las ganancias varían según tu monto de inversión, la frecuencia de tus apuestas y las condiciones del mercado. Muchos de nuestros usuarios reportan beneficios constantes del 5-15% en sus inversiones, pero los resultados pueden variar.",
  },
]

export default function Faq() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Preguntas Frecuentes</h2>
            <div className="flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-green-700 to-green-900 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-10">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-1 overflow-hidden shadow-sm">
                <AccordionTrigger className="py-4 px-3 hover:bg-muted/50">{faq.question}</AccordionTrigger>
                <AccordionContent className="py-4 px-4 text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
