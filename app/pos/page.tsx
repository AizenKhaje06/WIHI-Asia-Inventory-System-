"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useInventory } from "@/lib/hooks/use-inventory"
import { usePos } from "@/lib/hooks/use-pos"
import { PosService } from "@/lib/services/pos-service"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ShoppingCart, DollarSign, TrendingUp, Package, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PosPage() {
  const { items, loading: inventoryLoading, fetchInventory } = useInventory()
  const { processSale, loading: saleLoading } = usePos()
  const { toast } = useToast()

  const [selectedItemId, setSelectedItemId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [department, setDepartment] = useState<string>("")
  const [profitPreview, setProfitPreview] = useState<{
    totalCost: number
    totalRevenue: number
    profit: number
    profitMargin: number
  } | null>(null)

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  const selectedItem = items.find((item) => item.id === selectedItemId)

  // Calculate profit preview whenever inputs change
  useEffect(() => {
    if (selectedItem && quantity > 0 && sellingPrice > 0) {
      const costPrice = 0 // Default to 0 if not available
      const preview = PosService.calculateProfit(quantity, costPrice, sellingPrice)
      setProfitPreview(preview)
    } else {
      setProfitPreview(null)
    }
  }, [selectedItem, quantity, sellingPrice])

  const handleSale = async () => {
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "Please select an item",
        variant: "destructive",
      })
      return
    }

    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      })
      return
    }

    if (sellingPrice <= 0) {
      toast({
        title: "Error",
        description: "Selling price must be greater than 0",
        variant: "destructive",
      })
      return
    }

    if (!department) {
      toast({
        title: "Error",
        description: "Please select a department",
        variant: "destructive",
      })
      return
    }

    const result = await processSale({
      inventoryId: selectedItem.id,
      quantity,
      costPrice: 0, // Default to 0 if not tracked
      sellingPrice,
      department,
      user: "cashier",
    })

    if (result.success) {
      toast({
        title: "Sale Completed",
        description: `Successfully sold ${quantity} ${selectedItem.unit} of ${selectedItem.name}`,
      })

      // Reset form
      setSelectedItemId("")
      setQuantity(1)
      setSellingPrice(0)
      setDepartment("")
      setProfitPreview(null)

      // Refresh inventory
      fetchInventory()
    } else {
      toast({
        title: "Sale Failed",
        description: result.error || "An error occurred",
        variant: "destructive",
      })
    }
  }

  const availableStock = selectedItem ? selectedItem.quantity : 0
  const isStockInsufficient = selectedItem && quantity > availableStock

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Point of Sale</h1>
              <p className="text-sm text-muted-foreground">Process sales transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main POS Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>New Sale</CardTitle>
                <CardDescription>Select an item and enter sale details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Item Selection */}
                <div className="space-y-2">
                  <Label htmlFor="item">Item</Label>
                  <Select value={selectedItemId} onValueChange={setSelectedItemId} disabled={inventoryLoading}>
                    <SelectTrigger id="item">
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{item.name}</span>
                            <span className="text-sm text-muted-foreground ml-4">
                              ({item.quantity} {item.unit} available)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedItem && (
                    <p className="text-sm text-muted-foreground">
                      SKU: {selectedItem.sku} • Available: {selectedItem.quantity} {selectedItem.unit}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    disabled={!selectedItem}
                  />
                  {isStockInsufficient && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Insufficient stock. Available: {availableStock} {selectedItem?.unit}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Selling Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (per unit)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number.parseFloat(e.target.value) || 0)}
                    disabled={!selectedItem}
                    placeholder="0.00"
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment} disabled={!selectedItem}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Wholesale">Wholesale</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Counter">Counter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSale}
                  disabled={!selectedItem || isStockInsufficient || saleLoading || !department}
                  className="w-full"
                  size="lg"
                >
                  {saleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Complete Sale
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Live Profit Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sale Summary</CardTitle>
                <CardDescription>Live calculation preview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profitPreview ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span className="text-sm">Total Revenue</span>
                      </div>
                      <span className="font-semibold text-foreground">${profitPreview.totalRevenue.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">Total Cost</span>
                      </div>
                      <span className="font-semibold text-foreground">${profitPreview.totalCost.toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">Profit</span>
                        </div>
                        <span
                          className={`font-bold text-lg ${profitPreview.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ${profitPreview.profit.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Margin: {profitPreview.profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Enter sale details to see profit preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Item Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{selectedItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="font-medium">{selectedItem.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{selectedItem.category || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Stock:</span>
                    <span className="font-medium">
                      {selectedItem.quantity} {selectedItem.unit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
