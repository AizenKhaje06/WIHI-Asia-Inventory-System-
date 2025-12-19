"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { useEffect, useState } from "react"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname === "/"

  // Track sidebar collapsed state for layout adjustment
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) {
      setIsCollapsed(saved === "true")
    }

    // Listen for storage changes (when sidebar is toggled)
    const handleStorage = () => {
      const saved = localStorage.getItem("sidebar-collapsed")
      if (saved !== null) {
        setIsCollapsed(saved === "true")
      }
    }

    window.addEventListener("storage", handleStorage)

    // Custom event for same-window updates
    const handleSidebarToggle = () => {
      const saved = localStorage.getItem("sidebar-collapsed")
      if (saved !== null) {
        setIsCollapsed(saved === "true")
      }
    }

    window.addEventListener("sidebar-toggle", handleSidebarToggle)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("sidebar-toggle", handleSidebarToggle)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div
        className={
          isDashboard
            ? "" // No padding on dashboard
            : isCollapsed
              ? "lg:pl-16 pt-14 lg:pt-0" // Collapsed sidebar width + mobile header
              : "lg:pl-64 pt-14 lg:pt-0" // Expanded sidebar width + mobile header
        }
      >
        <main className={isDashboard ? "" : "p-4 lg:p-6"}>{children}</main>
      </div>
    </div>
  )
}
