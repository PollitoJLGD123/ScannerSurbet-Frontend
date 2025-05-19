"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../mode-toggle"
import { Menu, X } from "lucide-react"
import Image from "next/image"

const navItems = [
  { name: "Inicio", href: "#home" },
  { name: "Servicios", href: "#services" },
  { name: "Planes", href: "#plans" },
  { name: "Faq", href: "#faq" },
]

export default function Header() {
  const [activeSection, setActiveSection] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute("id") || ""

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId.replace("#", ""))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image 
              src="/arbisure-logo.png"
              alt="Arbisure Logo"
              width={140} 
              height={25} 
              className="h-auto" 
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === item.href.replace("#", "") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" size="sm">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-green-700 to-green-900 hover:from-green-900 hover:to-green-950 text-white"
          >
            <Link href="/register">Registrarse</Link>
            
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <span className="sr-only">Abrir menú principal</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-2 px-4 pb-4 pt-2 border-t">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  activeSection === item.href.replace("#", "")
                    ? "bg-gradient-to-r from-teal-500/10 to-blue-600/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="flex flex-col gap-3 mt-6 px-1">
              <Button variant="outline" size="lg" className="w-full border-2">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-700 to-green-900 hover:from-green-900 hover:to-green-950 text-white shadow-md"
              >
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
