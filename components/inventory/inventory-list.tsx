"use client"

import { useState } from "react"
import { useInventory } from "@/lib/hooks/use-inventory"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Package, Search, RefreshCw, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { InventoryItem } from "@/lib/api/google-sheets-client"
import { EditInventoryDialog } from "./edit-inventory-dialog"
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 12

export function InventoryList() {
  const { items, loading, error, refetch, deleteItem } = useInventory()
  const [searchQuery, setSearchQuery] = useState("")
  const [editItem, setEditItem] = useState<InventoryItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleDelete = async (item: InventoryItem) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteItem(item.id)
        toast({
          title: "Item deleted",
          description: `${item.name} has been removed from inventory`,
        })
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete item",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const lowStockItems = items.filter((item) => item.quantity <= item.reorderPoint)

  return (
    <>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">Total Items</CardDescription>
              <CardTitle className="text-3xl font-semibold">{items.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">Total Stock</CardDescription>
              <CardTitle className="text-3xl font-semibold">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className={lowStockItems.length > 0 ? "border-destructive bg-card" : "border-border bg-card"}>
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">Low Stock Items</CardDescription>
              <CardTitle className="text-3xl font-semibold text-destructive">{lowStockItems.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button variant="outline" size="icon" onClick={refetch} className="border-border bg-transparent">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-foreground">
              {lowStockItems.length} {lowStockItems.length === 1 ? "item is" : "items are"} running low on stock
            </AlertDescription>
          </Alert>
        )}

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchQuery ? "No items found matching your search" : "No inventory items yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedItems.map((item) => (
                <Card
                  key={item.id}
                  className={
                    item.quantity <= item.reorderPoint ? "border-destructive bg-card" : "border-border bg-card"
                  }
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1.5 truncate">{item.name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">SKU: {item.sku}</CardDescription>
                      </div>
                      <Badge variant={item.category ? "secondary" : "outline"} className="shrink-0 text-xs">
                        {item.category || "Uncategorized"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Stock Level</span>
                        <span className="font-semibold text-foreground">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Reorder Point</span>
                        <span className="text-sm text-foreground">{item.reorderPoint}</span>
                      </div>
                    </div>

                    {item.quantity <= item.reorderPoint && (
                      <Alert variant="destructive" className="py-2.5 border-destructive/50 bg-destructive/10">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <AlertDescription className="text-xs font-medium">Low stock warning</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-border bg-transparent"
                        onClick={() => setEditItem(item)}
                      >
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 border-border bg-transparent"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-border"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? "" : "border-border"}
                          >
                            {page}
                          </Button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-border"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {editItem && <EditInventoryDialog item={editItem} open={!!editItem} onOpenChange={() => setEditItem(null)} />}
    </>
  )
}
