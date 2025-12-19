"use client"

import { useState, useEffect } from "react"
import { InventoryService } from "@/lib/services/inventory-service"
import type { InventoryItem } from "@/lib/api/google-sheets-client"

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await InventoryService.getAll()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch inventory")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const createItem = async (item: Omit<InventoryItem, "id" | "deleted" | "lastModified">) => {
    try {
      const newItem = await InventoryService.create(item)
      setItems((prev) => [...prev, newItem!])
      return newItem
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create item")
    }
  }

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const updatedItem = await InventoryService.update(id, updates)
      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem! : item)))
      return updatedItem
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update item")
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await InventoryService.delete(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete item")
    }
  }

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
  }
}
