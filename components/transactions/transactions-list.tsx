"use client"

import { useState, useEffect } from "react"
import { TransactionService } from "@/lib/services/transaction-service"
import { useInventory } from "@/lib/hooks/use-inventory"
import type { Transaction } from "@/lib/api/google-sheets-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RefreshCw, TrendingUp, TrendingDown, RotateCcw, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { items: inventoryItems } = useInventory()

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TransactionService.getAll()
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const getInventoryName = (inventoryId: string) => {
    const item = inventoryItems.find((i) => i.id === inventoryId)
    return item ? `${item.name} (${item.sku})` : inventoryId
  }

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "add":
        return <Plus className="h-3 w-3" />
      case "remove":
        return <TrendingDown className="h-3 w-3" />
      case "restock":
        return <TrendingUp className="h-3 w-3" />
      case "adjust":
        return <RotateCcw className="h-3 w-3" />
      default:
        return null
    }
  }

  const getTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "add":
        return "default"
      case "remove":
        return "destructive"
      case "restock":
        return "secondary"
      case "adjust":
        return "outline"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const addTransactions = transactions.filter((t) => t.type === "add")
  const removeTransactions = transactions.filter((t) => t.type === "remove")
  const restockTransactions = transactions.filter((t) => t.type === "restock")
  const adjustTransactions = transactions.filter((t) => t.type === "adjust")

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-3xl">{transactions.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Additions</CardDescription>
            <CardTitle className="text-3xl">{addTransactions.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Restocks</CardDescription>
            <CardTitle className="text-3xl">{restockTransactions.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Adjustments</CardDescription>
            <CardTitle className="text-3xl">{adjustTransactions.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="icon" onClick={fetchTransactions}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All inventory movements and operations</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No transactions yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">{getInventoryName(transaction.inventoryId)}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(transaction.type)} className="gap-1">
                          {getTypeIcon(transaction.type)}
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {transaction.quantity > 0 ? "+" : ""}
                        {transaction.quantity}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.reference || "-"}</TableCell>
                      <TableCell className="text-sm">{transaction.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
