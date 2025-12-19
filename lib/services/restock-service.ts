import { googleSheetsClient, type RestockOrder } from "@/lib/api/google-sheets-client"

export class RestockService {
  static async getAll() {
    const response = await googleSheetsClient.getRestockOrders()

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data || []
  }

  static async getById(id: string) {
    const response = await googleSheetsClient.getRestockOrder(id)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  }

  static async create(order: Omit<RestockOrder, "id" | "deleted" | "lastModified">) {
    const response = await googleSheetsClient.createRestockOrder(order)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  }

  static async update(id: string, updates: Partial<RestockOrder>) {
    const response = await googleSheetsClient.updateRestockOrder(id, updates)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  }

  static async markAsReceived(id: string) {
    return this.update(id, {
      status: "received",
      receivedDate: new Date().toISOString(),
    })
  }

  static async getByStatus(status: RestockOrder["status"]) {
    const orders = await this.getAll()
    return orders.filter((order) => order.status === status)
  }

  static async getPending() {
    return this.getByStatus("pending")
  }

  static async getOrdered() {
    return this.getByStatus("ordered")
  }
}
