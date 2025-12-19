import { googleSheetsClient } from "@/lib/api/google-sheets-client"

export class LogService {
  static async getAll(limit?: number) {
    const response = await googleSheetsClient.getLogs(undefined, limit)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data || []
  }

  static async getByLevel(level: "INFO" | "WARN" | "ERROR", limit?: number) {
    const response = await googleSheetsClient.getLogs(level, limit)

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data || []
  }

  static async getErrors(limit?: number) {
    return this.getByLevel("ERROR", limit)
  }

  static async getWarnings(limit?: number) {
    return this.getByLevel("WARN", limit)
  }
}
