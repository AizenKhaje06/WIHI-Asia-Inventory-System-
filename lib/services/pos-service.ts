import { googleSheetsClient, type Sale } from "@/lib/api/google-sheets-client"

export class PosService {
  /**
   * Process a POS sale transaction
   */
  static async processSale(data: {
    inventoryId: string
    quantity: number
    costPrice: number
    sellingPrice: number
    department: string
    user?: string
  }): Promise<{ success: boolean; data?: Sale; error?: string; details?: string[] }> {
    try {
      const response = await googleSheetsClient.createSale(data)

      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: response.details,
        }
      }

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process sale",
      }
    }
  }

  /**
   * Get all sales with optional filters
   */
  static async getSales(filters?: {
    inventoryId?: string
    startDate?: string
    endDate?: string
  }): Promise<{ success: boolean; data?: Sale[]; error?: string }> {
    try {
      const response = await googleSheetsClient.getSales(filters)

      if (response.error) {
        return {
          success: false,
          error: response.error,
        }
      }

      return {
        success: true,
        data: response.data || [],
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch sales",
      }
    }
  }

  /**
   * Get cash flow summary
   */
  static async getCashFlow(dateRange?: { startDate?: string; endDate?: string }) {
    try {
      const response = await googleSheetsClient.getCashFlow(dateRange)

      if (response.error) {
        return {
          success: false,
          error: response.error,
        }
      }

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch cash flow",
      }
    }
  }

  /**
   * Calculate profit preview before sale
   */
  static calculateProfit(quantity: number, costPrice: number, sellingPrice: number) {
    const totalCost = Math.round(costPrice * quantity * 100) / 100
    const totalRevenue = Math.round(sellingPrice * quantity * 100) / 100
    const profit = Math.round((totalRevenue - totalCost) * 100) / 100
    const profitMargin = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100 * 100) / 100 : 0

    return {
      totalCost,
      totalRevenue,
      profit,
      profitMargin,
    }
  }
}
