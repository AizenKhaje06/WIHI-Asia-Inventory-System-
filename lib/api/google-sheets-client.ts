/**
 * Google Sheets API Client
 * Handles all HTTP communication with the Google Apps Script backend
 */

export interface ApiResponse<T = any> {
  statusCode: number
  data?: T
  count?: number
  error?: string
  details?: string[]
  message?: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  reorderPoint: number
  category: string
  unit: string
  deleted: boolean
  lastModified: Date | string
}

export interface RestockOrder {
  id: string
  inventoryId: string
  quantity: number
  costPrice?: number
  totalCost?: number
  status: "pending" | "ordered" | "received" | "cancelled"
  orderedDate: Date | string
  receivedDate: Date | string
  notes: string
  deleted: boolean
  lastModified: Date | string
}

export interface Transaction {
  id: string
  inventoryId: string
  type: "add" | "remove" | "restock" | "adjust"
  quantity: number
  reference: string
  timestamp: Date | string
  user: string
}

export interface Sale {
  id: string
  inventoryId: string
  itemName: string
  itemSku: string
  quantity: number
  costPrice: number
  sellingPrice: number
  totalCost: number
  totalRevenue: number
  profit: number
  department: string
  timestamp: Date | string
  user: string
}

export interface CashFlowSummary {
  totalRevenue: number
  totalCost: number
  totalProfit: number
  salesCount: number
  dateRange: {
    start: string | null
    end: string | null
  }
}

export interface LogEntry {
  timestamp: Date | string
  level: "INFO" | "WARN" | "ERROR"
  operation: string
  message: string
  details: string
}

class GoogleSheetsClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL || ""

    if (!this.baseUrl) {
      console.warn("NEXT_PUBLIC_GOOGLE_SHEETS_API_URL is not set")
    }
  }

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    params?: Record<string, any>,
    body?: any,
  ): Promise<ApiResponse<T>> {
    try {
      let url = `${this.baseUrl}?path=${path}`

      if (method === "GET" && params) {
        Object.keys(params).forEach((key) => {
          url += `&${key}=${encodeURIComponent(params[key])}`
        })
      }

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (method === "POST" && body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)
      const data = await response.json()

      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Inventory Methods
  async getInventory(): Promise<ApiResponse<InventoryItem[]>> {
    return this.request<InventoryItem[]>("GET", "inventory")
  }

  async getInventoryItem(id: string): Promise<ApiResponse<InventoryItem>> {
    return this.request<InventoryItem>("GET", "inventory", { id })
  }

  async createInventoryItem(
    item: Omit<InventoryItem, "id" | "deleted" | "lastModified">,
  ): Promise<ApiResponse<InventoryItem>> {
    return this.request<InventoryItem>("POST", "inventory", undefined, item)
  }

  async updateInventoryItem(
    id: string,
    updates: Partial<InventoryItem> & { reason?: string },
  ): Promise<ApiResponse<InventoryItem>> {
    return this.request<InventoryItem>("POST", "inventory/update", undefined, { id, ...updates })
  }

  async deleteInventoryItem(id: string): Promise<ApiResponse<InventoryItem>> {
    return this.request<InventoryItem>("POST", "inventory/delete", undefined, { id })
  }

  // Restock Methods
  async getRestockOrders(): Promise<ApiResponse<RestockOrder[]>> {
    return this.request<RestockOrder[]>("GET", "restock")
  }

  async getRestockOrder(id: string): Promise<ApiResponse<RestockOrder>> {
    return this.request<RestockOrder>("GET", "restock", { id })
  }

  async createRestockOrder(
    order: Omit<RestockOrder, "id" | "deleted" | "lastModified">,
  ): Promise<ApiResponse<RestockOrder>> {
    return this.request<RestockOrder>("POST", "restock", undefined, order)
  }

  async updateRestockOrder(id: string, updates: Partial<RestockOrder>): Promise<ApiResponse<RestockOrder>> {
    return this.request<RestockOrder>("POST", "restock/update", undefined, { id, ...updates })
  }

  // Transaction Methods
  async getTransactions(inventoryId?: string): Promise<ApiResponse<Transaction[]>> {
    const params = inventoryId ? { inventoryId } : undefined
    return this.request<Transaction[]>("GET", "transactions", params)
  }

  async createSale(sale: {
    inventoryId: string
    quantity: number
    costPrice: number
    sellingPrice: number
    department: string
    user?: string
  }): Promise<ApiResponse<Sale>> {
    return this.request<Sale>("POST", "pos/sale", undefined, sale)
  }

  async getSales(filters?: { inventoryId?: string; startDate?: string; endDate?: string }): Promise<
    ApiResponse<Sale[]>
  > {
    return this.request<Sale[]>("GET", "sales", filters)
  }

  async getCashFlow(dateRange?: { startDate?: string; endDate?: string }): Promise<ApiResponse<CashFlowSummary>> {
    return this.request<CashFlowSummary>("GET", "cashflow", dateRange)
  }

  // Log Methods
  async getLogs(level?: "INFO" | "WARN" | "ERROR", limit?: number): Promise<ApiResponse<LogEntry[]>> {
    const params: Record<string, any> = {}
    if (level) params.level = level
    if (limit) params.limit = limit
    return this.request<LogEntry[]>("GET", "logs", params)
  }
}

export const googleSheetsClient = new GoogleSheetsClient()
