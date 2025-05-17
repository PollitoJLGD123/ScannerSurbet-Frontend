import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-8">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              ARBISURE
            </span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            © {new Date().getFullYear()} Arbisure. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8">
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
