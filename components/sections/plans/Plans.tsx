import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const plans30days = [
  {
    name: "En vivo",
    price: "$89.90",
    description: "Perfecto para eventos en vivo",
    features: [
      "Eventos en vivo",
      "Calculadora de surebets",
      "Filtros personalizados",
      "Cambio de divisa",
      "Interfaz amigable",
    ],
    popular: false,
  },
  {
    name: "Completo",
    price: "$99.90",
    description: "Acceso completo a todas las funciones",
    features: [
      "Eventos en vivo y prematch",
      "Calculadora de surebets",
      "Filtros personalizados",
      "Cambio de divisa",
      "Interfaz amigable",
    ],
    popular: true,
  },
  {
    name: "Prematch",
    price: "$59.90",
    description: "Solo para eventos prematch",
    features: [
      "Eventos prematch",
      "Calculadora de surebets",
      "Filtros personalizados",
      "Cambio de divisa",
      "Interfaz amigable",
    ],
    popular: false,
  },
]

// Nuevos planes de 15 días
const plans15days = [
  {
    name: "En vivo",
    price: "$79.90",
    description: "Eventos en vivo",
    features: [
      "Calculadora de surebets",
      "Filtros personalizados",
      "Cambio de divisa",
      "Interfaz amigable",
    ],
    popular: false,
  },
  {
    name: "Completo",
    price: "$89.90",
    description: "Eventos en vivo y prematch",
    features: [
      "Calculadora de surebets",
      "Filtros personalizados",
      "Cambio de divisa",
      "Interfaz amigable",
    ],
    popular: true,
  },
  {
    name: "Prematch",
    price: "$49.90",
    description: "Eventos prematch",
    features: [
      "Calculadora de surebets",
      "Filtros personalizados",
      "Cambio de divisa",
      "Interfaz amigable",
    ],
    popular: false,
  },
]

export default function Plans() {
  return (
    <section id="plans" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Planes
            </h2>
            <div className="flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"></div>
            </div>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Tenemos varios planes para adaptarnos a tus necesidades.
            </p>
          </div>
        </div>

        <Tabs defaultValue="30days" className="w-full max-w-5xl mx-auto mt-10">
          <TabsList className="grid w-full grid-cols-2 shadow-sm">
            <TabsTrigger value="15days">15 días</TabsTrigger>
            <TabsTrigger value="30days">30 días</TabsTrigger>
          </TabsList>
          
          {/* Contenido para los planes de 15 días */}
          <TabsContent value="15days">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {plans15days.map((plan, index) => (
                <Card
                  key={index}
                  className={`flex flex-col ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                        Más Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="ml-1 text-muted-foreground">
                        / 15 días
                      </span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                          : ""
                      }`}
                    >
                      Comprar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Contenido para los planes de 30 días */}
          <TabsContent value="30days">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {plans30days.map((plan, index) => (
                <Card
                  key={index}
                  className={`flex flex-col ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="ml-1 text-muted-foreground">
                        / 30 days
                      </span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                          : ""
                      }`}
                    >
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}