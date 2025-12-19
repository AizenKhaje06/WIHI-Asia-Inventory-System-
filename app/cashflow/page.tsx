"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PosService } from "@/lib/services/pos-service"
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CashFlowPage() {
  const [summary, setSummary] = useState<{
    totalRevenue: number
    totalCost: number
    totalProfit: number
    salesCount: number
  } | null>(null)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const fetchCashFlow = async () => {
    setLoading(true)
    const dateRange =
      startDate || endDate
        ? {
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          }
        : undefined

    const result = await PosService.getCashFlow(dateRange)

    if (result.success && result.data) {
      setSummary(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCashFlow()
  }, [])

  const handleFilter = () => {
    fetchCashFlow()
  }

  const handleClearFilter = () => {
    setStartDate("")
    setEndDate("")
    fetchCashFlow()
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
              <h1 className="text-2xl font-semibold text-foreground">Cash Flow</h1>
              <p className="text-sm text-muted-foreground">Financial summary and analytics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Date Range Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Date Range Filter</CardTitle>
            <CardDescription>Filter financial data by date range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleFilter} disabled={loading}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Apply
                </Button>
                <Button onClick={handleClearFilter} variant="outline" disabled={loading}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        {summary && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${summary.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">From {summary.salesCount} sales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${summary.totalCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Cost of goods sold</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summary.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${summary.totalProfit.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Margin:{" "}
                  {summary.totalRevenue > 0 ? ((summary.totalProfit / summary.totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{summary.salesCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: ${summary.salesCount > 0 ? (summary.totalRevenue / summary.salesCount).toFixed(2) : "0.00"}/sale
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>View Details</CardTitle>
              <CardDescription>Access detailed transaction records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/transactions">
                <Button className="w-full bg-transparent" variant="outline">
                  View All Transactions
                </Button>
              </Link>
              <Link href="/pos">
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Make a Sale
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Insights</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profit Margin:</span>
                    <span className="font-medium">
                      {summary.totalRevenue > 0 ? ((summary.totalProfit / summary.totalRevenue) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Sale Value:</span>
                    <span className="font-medium">
                      ${summary.salesCount > 0 ? (summary.totalRevenue / summary.salesCount).toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cost Ratio:</span>
                    <span className="font-medium">
                      {summary.totalRevenue > 0 ? ((summary.totalCost / summary.totalRevenue) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
