"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Package,
  RefreshCw,
  Activity,
  FileText,
  ShoppingCart,
  DollarSign,
  LayoutDashboard,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Restock", href: "/restock", icon: RefreshCw },
  { name: "POS", href: "/pos", icon: ShoppingCart },
  { name: "Transactions", href: "/transactions", icon: Activity },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Cash Flow", href: "/cashflow", icon: DollarSign },
]

export function Sidebar() {
  const pathname = usePathname()
  const isDashboard = pathname === "/"

  // Desktop: collapsed state (icons only by default)
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Mobile: overlay state
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Persist collapsed state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) {
      setIsCollapsed(saved === "true")
    }
  }, [])

  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Don't render sidebar on dashboard
  if (isDashboard) {
    return null
  }

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        const showText = mobile || !isCollapsed

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "hover:bg-slate-100",
              isActive ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "text-slate-700 hover:text-slate-900",
              !showText && "justify-center",
            )}
            title={!showText ? item.name : undefined}
          >
            <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-blue-600")} />
            {showText && <span className="truncate">{item.name}</span>}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile Header + Hamburger Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h1 className="text-base font-semibold text-slate-900">Inventory System</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="text-slate-700">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Overlay Sidebar */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar Panel */}
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-semibold text-slate-900">Menu</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)} className="text-slate-500">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <NavLinks mobile />
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white lg:shadow-sm lg:transition-all lg:duration-200",
          isCollapsed ? "lg:w-16" : "lg:w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with Logo + Toggle */}
          <div
            className={cn(
              "flex items-center border-b border-slate-200 px-3 py-4",
              isCollapsed ? "justify-center" : "justify-between",
            )}
          >
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <h1 className="text-base font-semibold text-slate-900">Inventory System</h1>
              </div>
            )}
            {isCollapsed && <Package className="h-5 w-5 text-blue-600" />}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className={cn("text-slate-500 hover:text-slate-900 h-8 w-8", isCollapsed && "absolute right-0 top-4")}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} sidebar</span>
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <NavLinks />
          </div>
        </div>
      </aside>
    </>
  )
}
