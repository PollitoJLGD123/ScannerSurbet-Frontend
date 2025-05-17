import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const plans = [
  {
    name: "Live",
    price: "$89.90",
    description: "Perfect for live events",
    features: ["Live events", "Surebet calculator", "Custom filters", "Currency exchange", "User-friendly interface"],
    popular: false,
  },
  {
    name: "Full",
    price: "$99.90",
    description: "Complete access to all features",
    features: [
      "Live and prematch events",
      "Surebet calculator",
      "Custom filters",
      "Currency exchange",
      "User-friendly interface",
    ],
    popular: true,
  },
  {
    name: "Prematch",
    price: "$59.90",
    description: "For prematch events only",
    features: [
      "Prematch events",
      "Surebet calculator",
      "Custom filters",
      "Currency exchange",
      "User-friendly interface",
    ],
    popular: false,
  },
]

export default function Plans() {
  return (
    <section id="plans" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Plans</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We have various plans to adapt to your needs.
            </p>
          </div>
        </div>

        <Tabs defaultValue="30days" className="w-full max-w-md mx-auto mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="15days">15 days</TabsTrigger>
            <TabsTrigger value="30days">30 days</TabsTrigger>
          </TabsList>
          <TabsContent value="15days" className="mt-2 text-center text-sm text-muted-foreground">
            Contact us for 15-day pricing options
          </TabsContent>
          <TabsContent value="30days">
            <div className="grid gap-6 md:grid-cols-3 lg:gap-8 mt-8">
              {plans.map((plan, index) => (
                <Card key={index} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
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
                      <span className="ml-1 text-muted-foreground">/ 30 days</span>
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
                      className={`w-full ${plan.popular ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700" : ""}`}
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
