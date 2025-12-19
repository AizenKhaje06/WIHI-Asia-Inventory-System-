"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TransactionService } from "@/lib/services/transaction-service"
import { PosService } from "@/lib/services/pos-service"
import { useInventory } from "@/lib/hooks/use-inventory"
import type { Transaction, Sale } from "@/lib/api/google-sheets-client"
import { AlertCircle, RefreshCw, TrendingUp, TrendingDown, RotateCcw, Plus, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { items: inventoryItems } = useInventory()

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch both transactions and sales in parallel
      const [txData, salesResult] = await Promise.all([TransactionService.getAll(), PosService.getSales()])

      setTransactions(txData)
      if (salesResult.success) {
        setSales(salesResult.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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

  // Filter transactions by search query
  const filteredTransactions = transactions.filter((t) => {
    const itemName = getInventoryName(t.inventoryId).toLowerCase()
    const reference = t.reference.toLowerCase()
    const type = t.type.toLowerCase()
    const query = searchQuery.toLowerCase()

    return itemName.includes(query) || reference.includes(query) || type.includes(query)
  })

  // Filter sales by search query
  const filteredSales = sales.filter((s) => {
    const query = searchQuery.toLowerCase()
    return (
      s.itemName.toLowerCase().includes(query) ||
      s.itemSku.toLowerCase().includes(query) ||
      s.department.toLowerCase().includes(query)
    )
  })

  const addTransactions = transactions.filter((t) => t.type === "add")
  const removeTransactions = transactions.filter((t) => t.type === "remove")
  const restockTransactions = transactions.filter((t) => t.type === "restock")

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
              <p className="text-sm text-muted-foreground">Complete audit trail of inventory and sales activity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Transactions</CardDescription>
              <CardTitle className="text-3xl">{transactions.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Sales</CardDescription>
              <CardTitle className="text-3xl">{sales.length}</CardTitle>
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
              <CardTitle className="text-3xl">{removeTransactions.length + addTransactions.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Refresh */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="inventory">Inventory Transactions</TabsTrigger>
            <TabsTrigger value="sales">Sales Records</TabsTrigger>
          </TabsList>

          {/* Inventory Transactions */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Transaction History</CardTitle>
                <CardDescription>All inventory movements and operations</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchQuery ? "No matching transactions found" : "No transactions yet"}
                  </div>
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
                        {filteredTransactions.map((transaction) => (
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
                            <TableCell className="text-sm text-muted-foreground">
                              {transaction.reference || "-"}
                            </TableCell>
                            <TableCell className="text-sm">{transaction.user}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Records */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales Transaction History</CardTitle>
                <CardDescription>Complete record of all POS sales with financial details</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredSales.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchQuery ? "No matching sales found" : "No sales yet"}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead className="text-right">Profit</TableHead>
                          <TableHead>Department</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-mono text-xs">
                              {new Date(sale.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-medium">{sale.itemName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{sale.itemSku}</TableCell>
                            <TableCell className="text-right font-mono">{sale.quantity}</TableCell>
                            <TableCell className="text-right font-mono">${sale.sellingPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono font-medium">
                              ${sale.totalRevenue.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-muted-foreground">
                              ${sale.totalCost.toFixed(2)}
                            </TableCell>
                            <TableCell
                              className={`text-right font-mono font-medium ${sale.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              ${sale.profit.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{sale.department}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
