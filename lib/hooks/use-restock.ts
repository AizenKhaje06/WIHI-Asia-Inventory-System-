"use client"

import { useState, useEffect } from "react"
import { RestockService } from "@/lib/services/restock-service"
import type { RestockOrder } from "@/lib/api/google-sheets-client"

export function useRestock() {
  const [orders, setOrders] = useState<RestockOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await RestockService.getAll()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch restock orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const createOrder = async (order: Omit<RestockOrder, "id" | "deleted" | "lastModified">) => {
    try {
      const newOrder = await RestockService.create(order)
      setOrders((prev) => [...prev, newOrder!])
      return newOrder
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create order")
    }
  }

  const updateOrder = async (id: string, updates: Partial<RestockOrder>) => {
    try {
      const updatedOrder = await RestockService.update(id, updates)
      setOrders((prev) => prev.map((order) => (order.id === id ? updatedOrder! : order)))
      return updatedOrder
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update order")
    }
  }

  const markAsReceived = async (id: string) => {
    try {
      const updatedOrder = await RestockService.markAsReceived(id)
      setOrders((prev) => prev.map((order) => (order.id === id ? updatedOrder! : order)))
      return updatedOrder
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to mark as received")
    }
  }

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
    markAsReceived,
  }
}
