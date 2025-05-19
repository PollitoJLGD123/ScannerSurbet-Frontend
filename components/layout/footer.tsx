import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
              ARBISURE
            </span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            © {new Date().getFullYear()} Arbisure. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Términos de Servicio
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Política de Privacidad
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  )
}
