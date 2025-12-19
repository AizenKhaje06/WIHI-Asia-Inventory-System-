"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TransactionsHeader() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link href="/">
        <Button variant="ghost" size="icon">
          <Home className="h-5 w-5" />
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Complete audit trail of inventory activity</p>
      </div>
    </div>
  )
}
