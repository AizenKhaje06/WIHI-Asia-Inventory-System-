"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRestock } from "@/lib/hooks/use-restock"
import { useInventory } from "@/lib/hooks/use-inventory"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddRestockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRestockDialog({ open, onOpenChange }: AddRestockDialogProps) {
  const { createOrder } = useRestock()
  const { items: inventoryItems } = useInventory()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    inventoryId: "",
    quantity: "1",
    costPrice: "0",
    status: "pending" as "pending" | "ordered",
    notes: "",
  })

  const totalCost = useMemo(() => {
    const qty = Number(formData.quantity) || 0
    const cost = Number(formData.costPrice) || 0
    return qty * cost
  }, [formData.quantity, formData.costPrice])

  const selectedItem = useMemo(() => {
    return inventoryItems.find((i) => i.id === formData.inventoryId)
  }, [inventoryItems, formData.inventoryId])

  const newQuantity = useMemo(() => {
    if (!selectedItem) return 0
    return selectedItem.quantity + (Number(formData.quantity) || 0)
  }, [selectedItem, formData.quantity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.inventoryId) {
      toast({
        title: "Validation Error",
        description: "Please select an inventory item",
        variant: "destructive",
      })
      return
    }

    if (Number(formData.quantity) <= 0) {
      toast({
        title: "Validation Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await createOrder({
        inventoryId: formData.inventoryId,
        quantity: Number(formData.quantity),
        costPrice: Number(formData.costPrice),
        totalCost: totalCost,
        status: formData.status,
        orderedDate: new Date().toISOString(),
        receivedDate: "",
        notes: formData.notes,
      })

      toast({
        title: "Order created",
        description: `Restock order for ${selectedItem?.name} has been created successfully`,
      })

      // Reset form
      setFormData({
        inventoryId: "",
        quantity: "1",
        costPrice: "0",
        status: "pending",
        notes: "",
      })
      onOpenChange(false)
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create restock order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Restock Order</DialogTitle>
            <DialogDescription>Add stock to an existing inventory item</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="inventoryId">Inventory Item *</Label>
              <Select
                value={formData.inventoryId}
                onValueChange={(value) => setFormData({ ...formData, inventoryId: value })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select an item..." />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.sku}) - Current: {item.quantity} {item.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedItem && (
                <p className="text-xs text-muted-foreground">
                  Current stock: {selectedItem.quantity} {selectedItem.unit} | Reorder point:{" "}
                  {selectedItem.reorderPoint}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="costPrice">Cost per Unit</Label>
                <Input
                  id="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  placeholder="0.00"
                  className="bg-background border-border"
                />
              </div>
            </div>

            {selectedItem && Number(formData.quantity) > 0 && (
              <Alert className="border-border bg-muted/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Cost:</span>
                      <span className="font-semibold">${totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Quantity:</span>
                      <span className="font-semibold">
                        {newQuantity} {selectedItem.unit}
                      </span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "ordered") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Reason / Notes</Label>
              <Textarea
                id="notes"
                placeholder="e.g., Low stock replenishment, supplier XYZ order #12345"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-background border-border resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Document the reason for restocking and any relevant supplier information
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-border"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.inventoryId}>
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
