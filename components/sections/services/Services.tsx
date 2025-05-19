import { Building2, Activity, Calculator, PenToolIcon as Tool } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
	{
		title: "Más de 20 casas de apuestas disponibles",
		description:
			"Contamos con más de 20 casas de apuestas para que puedas realizar tus operaciones de la mejor manera.",
		icon: Building2,
	},
	{
		title: "12 deportes diferentes para apostar",
		description:
			"Contamos con más de 12 deportes para que puedas realizar tus operaciones y obtener la mayor rentabilidad.",
		icon: Activity,
	},
	{
		title: "Calculadora inteligente de surebets",
		description:
			"Disponemos de una calculadora inteligente para facilitar las operaciones al momento de obtener ganancias.",
		icon: Calculator,
	},
	{
		title: "Herramientas de productividad para apuestas",
		description:
			"Contamos con varias herramientas que te ayudarán a mejorar tu productividad y eficiencia.",
		icon: Tool,
	},
]

export default function Services() {
	return (
		<section
			id="services"
			className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center space-y-6 text-center">
					<div className="space-y-3">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							Servicios
						</h2>
						<div className="flex justify-center">
							<div className="w-16 h-1 bg-gradient-to-r from-green-700 to-green-900 rounded-full"></div>
						</div>
						<p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Tenemos una amplia gama de servicios para que puedas invertir y generar dinero de forma segura y confiable.
						</p>
					</div>
				</div>
				<div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch mt-12">
					{services.map((service, index) => (
						<Card key={index} className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="p-2.5 rounded-lg bg-gradient-to-r from-teal-500/10 to-blue-600/10">
										<service.icon className="h-6 w-6 text-primary" />
									</div>
									<CardTitle className="text-lg">{service.title}</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="flex-grow">
								<CardDescription className="text-sm">{service.description}</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
				<div className="mt-20 text-center">
					<div className="max-w-3xl mx-auto p-8 rounded-xl bg-card border shadow-md bg-gradient-to-r from-teal-500/5 to-blue-600/5">
						<p className="italic text-muted-foreground text-lg">
							&quot;Este software es una plataforma interactiva que te permitirá gestionar y visualizar surebets en tiempo real y antes del evento, personalizando tu experiencia mediante filtros y configuraciones específicas. Está diseñado para ofrecer una interfaz intuitiva y adaptable, enfocada en la eficiencia y facilidad de uso.&quot;
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
