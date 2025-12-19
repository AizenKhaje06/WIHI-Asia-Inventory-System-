"use client"

import { useState, useCallback } from "react"
import { PosService } from "@/lib/services/pos-service"
import type { Sale } from "@/lib/api/google-sheets-client"

export function usePos() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processSale = useCallback(
    async (data: {
      inventoryId: string
      quantity: number
      costPrice: number
      sellingPrice: number
      department: string
      user?: string
    }) => {
      setLoading(true)
      setError(null)

      const result = await PosService.processSale(data)

      if (result.success && result.data) {
        setSales((prev) => [result.data!, ...prev])
        setLoading(false)
        return { success: true, data: result.data }
      } else {
        setError(result.error || "Failed to process sale")
        setLoading(false)
        return { success: false, error: result.error, details: result.details }
      }
    },
    [],
  )

  const fetchSales = useCallback(async (filters?: { inventoryId?: string; startDate?: string; endDate?: string }) => {
    setLoading(true)
    setError(null)

    const result = await PosService.getSales(filters)

    if (result.success) {
      setSales(result.data || [])
    } else {
      setError(result.error || "Failed to fetch sales")
    }

    setLoading(false)
  }, [])

  return {
    sales,
    loading,
    error,
    processSale,
    fetchSales,
  }
}
