"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, SquareDashedBottomCode, ChevronDown, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Surebets",
    href: "#",
    icon: SquareDashedBottomCode,
    children: [
      { title: "Live", href: "/dashboard/surebets/live" },
      { title: "Prematch", href: "/dashboard/surebets/prematch" },
    ],
  },
  {
    title: "Nomenclaturas",
    href: "/dashboard/nomenclaturas",
    icon: FileText,
  },
]

export function DashboardSidebar() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  
  const toggleItem = (title: string) => {
    setOpenItem(openItem === title ? null : title)
  }

  return (
    <>
      {/* Sidebar para móvil */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-3 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="grid gap-1 p-4 text-sm font-medium">
            {navItems.map((item) => (
              item.children ? (
                <CollapsibleNavItem 
                  key={item.title} 
                  item={item} 
                  isOpen={openItem === item.title}
                  onToggle={() => toggleItem(item.title)}
                />
              ) : (
                <NavLink key={item.href} item={item} />
              )
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Sidebar para escritorio */}
      <div className="hidden border-r bg-background md:block w-64">
        <nav className="grid gap-1 p-4 text-sm font-medium">
          {navItems.map((item) => (
            item.children ? (
              <CollapsibleNavItem 
                key={item.title} 
                item={item} 
                isOpen={openItem === item.title}
                onToggle={() => toggleItem(item.title)}
              />
            ) : (
              <NavLink key={item.href} item={item} />
            )
          ))}
        </nav>
      </div>
    </>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
      )}
    >
      <item.icon className={cn("h-4 w-4")} />
      <span>{item.title}</span>
    </Link>
  )
}

function CollapsibleNavItem({ 
  item, 
  isOpen, 
  onToggle 
}: { 
  item: NavItem; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  const pathname = usePathname()
  const isActive = item.children?.some(child => 
    pathname === child.href || pathname.startsWith(`${child.href}/`)
  )

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors",
            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className={cn("h-4 w-4")} />
            <span>{item.title}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-6 mt-1 space-y-1">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 transition-colors",
                pathname === child.href || pathname.startsWith(`${child.href}/`)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <span>{child.title}</span>
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
