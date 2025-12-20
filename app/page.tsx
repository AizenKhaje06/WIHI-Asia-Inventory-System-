import Link from "next/link"
import { Package, RefreshCw, Activity, FileText, ArrowRight, ShoppingCart, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">Inventory Management System</h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Enterprise-grade inventory tracking and POS system with real-time financial analytics
          </p>
        </div>

        {/* Quick Actions - Primary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary/40 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Point of Sale</CardTitle>
                  <CardDescription>Process sales transactions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sell products with real-time profit calculation and automatic inventory updates. Optimized for speed and
                accuracy.
              </p>
              <Link href="/pos">
                <Button className="w-full" size="lg">
                  Open POS
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Cash Flow Analytics</CardTitle>
                  <CardDescription>Financial performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track revenue, costs, and profit with comprehensive financial summaries and trend analysis.
              </p>
              <Link href="/cashflow">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  View Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link href="/inventory" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-blue-500/10 rounded">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">Inventory</CardTitle>
                </div>
                <CardDescription>Manage stock levels</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/restock" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-orange-500/10 rounded">
                    <RefreshCw className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-base">Restock Orders</CardTitle>
                </div>
                <CardDescription>Purchase orders</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/transactions" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-purple-500/10 rounded">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-base">Transactions</CardTitle>
                </div>
                <CardDescription>Activity history</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/logs" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-slate-500/10 rounded">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <CardTitle className="text-base">System Logs</CardTitle>
                </div>
                <CardDescription>Audit records</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* System Features */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Features</CardTitle>
            <CardDescription>Built for production use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Audit-Grade Logging</p>
                  <p className="text-xs text-muted-foreground">Immutable records of all system operations</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Real-Time Profit Tracking</p>
                  <p className="text-xs text-muted-foreground">Live calculations with financial accuracy</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Stock Validation</p>
                  <p className="text-xs text-muted-foreground">Prevents overselling with atomic transactions</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Comprehensive Reporting</p>
                  <p className="text-xs text-muted-foreground">Filter logs by operation, date, and item</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
