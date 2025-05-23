"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, SquareDashedBottomCode, ChevronDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
  const pathname = usePathname()
  const [openItem, setOpenItem] = useState<string | null>(null)

  // Auto-open the collapsible item if a child route is active
  useEffect(() => {
    const activeParent = navItems.find((item) => item.children?.some((child) => isExactPathMatch(pathname, child.href)))

    if (activeParent) {
      setOpenItem(activeParent.title)
    }
  }, [pathname])

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
            {navItems.map((item) =>
              item.children ? (
                <CollapsibleNavItem
                  key={item.title}
                  item={item}
                  isOpen={openItem === item.title}
                  onToggle={() => toggleItem(item.title)}
                  currentPath={pathname}
                />
              ) : (
                <NavLink key={item.href} item={item} currentPath={pathname} />
              ),
            )}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Sidebar para escritorio */}
      <div className="hidden border-r bg-background md:block w-64">
        <nav className="grid gap-1 p-4 text-sm font-medium">
          {navItems.map((item) =>
            item.children ? (
              <CollapsibleNavItem
                key={item.title}
                item={item}
                isOpen={openItem === item.title}
                onToggle={() => toggleItem(item.title)}
                currentPath={pathname}
              />
            ) : (
              <NavLink key={item.href} item={item} currentPath={pathname} />
            ),
          )}
        </nav>
      </div>
    </>
  )
}

// Helper function for exact path matching
function isExactPathMatch(currentPath: string, itemPath: string): boolean {
  // For root paths like /dashboard, we need exact matching
  if (itemPath === "/dashboard") {
    return currentPath === "/dashboard"
  }

  // For other paths, we check if the current path exactly matches or is a direct child
  // This prevents /dashboard/surebets/live from matching /dashboard
  const itemPathParts = itemPath.split("/").filter(Boolean)
  const currentPathParts = currentPath.split("/").filter(Boolean)

  // If item path has more parts than current path, it can't be a match
  if (itemPathParts.length > currentPathParts.length) return false

  // Check if all parts of the item path match the beginning of the current path
  for (let i = 0; i < itemPathParts.length; i++) {
    if (itemPathParts[i] !== currentPathParts[i]) return false
  }

  // For non-root paths, we want to ensure we're not matching partial segments
  // e.g., /dashboard/sure should not match /dashboard/surebets
  if (itemPathParts.length < currentPathParts.length) {
    return itemPath.endsWith("/") || currentPath.includes(`${itemPath}/`)
  }

  return true
}

function NavLink({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive = isExactPathMatch(currentPath, item.href) && item.href !== "#"

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
  onToggle,
  currentPath,
}: {
  item: NavItem
  isOpen: boolean
  onToggle: () => void
  currentPath: string
}) {
  // Only highlight the parent if no specific child is selected
  const hasActiveChild = item.children?.some((child) => isExactPathMatch(currentPath, child.href))

  // Don't highlight the parent when a child is active
  const isActive = false

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : hasActiveChild
                ? "text-primary font-medium"
                : "hover:bg-muted",
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
          {item.children?.map((child) => {
            const childIsActive = isExactPathMatch(currentPath, child.href)

            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 transition-colors",
                  childIsActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <span>{child.title}</span>
              </Link>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
