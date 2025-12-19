import { googleSheetsClient, type InventoryItem } from "@/lib/api/google-sheets-client"

export class InventoryService {
  static async getAll() {
    const response = await googleSheetsClient.getInventory()

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data || []
  }

  static async getById(id: string) {
    const response = await googleSheetsClient.getInventoryItem(id)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  }

  static async create(item: Omit<InventoryItem, "id" | "deleted" | "lastModified">) {
    const response = await googleSheetsClient.createInventoryItem(item)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  }

  static async update(id: string, updates: Partial<InventoryItem>) {
    const response = await googleSheetsClient.updateInventoryItem(id, updates)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  }

  static async delete(id: string) {
    const response = await googleSheetsClient.deleteInventoryItem(id)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  }

  static async getLowStock() {
    const items = await this.getAll()
    return items.filter((item) => item.quantity <= item.reorderPoint)
  }

  static async getByCategory(category: string) {
    const items = await this.getAll()
    return items.filter((item) => item.category === category)
  }

  static async search(query: string) {
    const items = await this.getAll()
    const lowerQuery = query.toLowerCase()

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.sku.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery),
    )
  }
}
