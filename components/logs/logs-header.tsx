"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogsHeader() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link href="/">
        <Button variant="ghost" size="icon">
          <Home className="h-5 w-5" />
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">Monitor system activity and debug issues</p>
      </div>
    </div>
  )
}
