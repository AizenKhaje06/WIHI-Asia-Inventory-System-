"use client"

import type React from "react"

import { useState } from "react"
import { useInventory } from "@/lib/hooks/use-inventory"
import type { InventoryItem } from "@/lib/api/google-sheets-client"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface EditInventoryDialogProps {
  item: InventoryItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditInventoryDialog({ item, open, onOpenChange }: EditInventoryDialogProps) {
  const { updateItem } = useInventory()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: item.name,
    sku: item.sku,
    quantity: item.quantity.toString(),
    reorderPoint: item.reorderPoint.toString(),
    category: item.category,
    unit: item.unit,
    reason: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updates: any = {
        name: formData.name,
        sku: formData.sku,
        quantity: Number(formData.quantity),
        reorderPoint: Number(formData.reorderPoint),
        category: formData.category,
        unit: formData.unit,
      }

      if (Number(formData.quantity) !== item.quantity && formData.reason) {
        updates.reason = formData.reason
      }

      await updateItem(item.id, updates)

      toast({
        title: "Item updated",
        description: `${formData.name} has been updated successfully`,
      })

      onOpenChange(false)
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update item",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const quantityChanged = Number(formData.quantity) !== item.quantity

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>Update product information and adjust stock levels</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name *</Label>
              <Input
                id="edit-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background border-border"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-sku">SKU *</Label>
              <Input
                id="edit-sku"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="bg-background border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">Quantity *</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="bg-background border-border"
                />
                {quantityChanged && (
                  <p className="text-xs text-muted-foreground">
                    Previous: {item.quantity} {item.unit}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-reorderPoint">Reorder Point</Label>
                <Input
                  id="edit-reorderPoint"
                  type="number"
                  min="0"
                  value={formData.reorderPoint}
                  onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
            </div>

            {quantityChanged && (
              <div className="grid gap-2">
                <Label htmlFor="edit-reason">Reason for Adjustment</Label>
                <Textarea
                  id="edit-reason"
                  placeholder="e.g., Inventory correction, damaged goods, etc."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="bg-background border-border resize-none"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">Documenting adjustments helps maintain audit trails</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Electronics"
                  className="bg-background border-border"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., units, boxes"
                  className="bg-background border-border"
                />
              </div>
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
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
