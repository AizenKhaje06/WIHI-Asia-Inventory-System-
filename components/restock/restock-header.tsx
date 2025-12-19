"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddRestockDialog } from "./add-restock-dialog"

export function RestockHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Restock Orders</h1>
            <p className="text-muted-foreground">Manage purchase orders and supplier restocks</p>
          </div>
        </div>

        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <AddRestockDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </>
  )
}
