import { Building2, Activity, Calculator, PenToolIcon as Tool } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "More than 20 betting houses available",
    description: "We have more than 20 betting houses so you can carry out your operations in the best way.",
    icon: Building2,
  },
  {
    title: "12 different sports to bet on",
    description:
      "We have more than 12 sports so you can carry out your operations and obtain the highest profitability.",
    icon: Activity,
  },
  {
    title: "Smart surebet calculator",
    description: "We have an intelligent calculator to facilitate operations when it comes to making a profit.",
    icon: Calculator,
  },
  {
    title: "Productivity tools for betting",
    description: "We have various tools that will help improve your productivity and efficiency.",
    icon: Tool,
  },
]

export default function Services() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Services</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We have a wide range of services so you can invest and generate money safely and reliably.
            </p>
          </div>
        </div>
        <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch mt-12">
          {services.map((service, index) => (
            <Card key={index} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto p-6 rounded-lg bg-card border shadow-sm">
            <p className="italic text-muted-foreground">
              &quot;This software is an interactive platform that will allow you to manage and visualize surebets in real
              time and prior to the event, customizing your experience through specific filters and configurations. It
              is designed to offer an intuitive and adaptable interface, focused on efficiency and ease of use.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
