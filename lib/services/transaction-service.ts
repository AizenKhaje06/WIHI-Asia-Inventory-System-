import { googleSheetsClient, type Transaction } from "@/lib/api/google-sheets-client"

export class TransactionService {
  static async getAll() {
    const response = await googleSheetsClient.getTransactions()

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data || []
  }

  static async getByInventoryId(inventoryId: string) {
    const response = await googleSheetsClient.getTransactions(inventoryId)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data || []
  }

  static async getRecent(limit = 50) {
    const transactions = await this.getAll()
    return transactions.slice(0, limit)
  }

  static async getByType(type: Transaction["type"]) {
    const transactions = await this.getAll()
    return transactions.filter((t) => t.type === type)
  }
}
