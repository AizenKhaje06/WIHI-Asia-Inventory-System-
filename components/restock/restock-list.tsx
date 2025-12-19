"use client"

import { useState } from "react"
import { useRestock } from "@/lib/hooks/use-restock"
import { useInventory } from "@/lib/hooks/use-inventory"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Package, RefreshCw, Check, Clock, XCircle, Truck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RestockOrder } from "@/lib/api/google-sheets-client"
import { useToast } from "@/hooks/use-toast"

export function RestockList() {
  const { orders, loading, error, refetch, updateOrder, markAsReceived } = useRestock()
  const { items: inventoryItems } = useInventory()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { toast } = useToast()

  const getInventoryName = (inventoryId: string) => {
    const item = inventoryItems.find((i) => i.id === inventoryId)
    return item ? `${item.name} (${item.sku})` : inventoryId
  }

  const handleStatusChange = async (order: RestockOrder, newStatus: RestockOrder["status"]) => {
    setProcessingId(order.id)
    try {
      if (newStatus === "received") {
        await markAsReceived(order.id)
        toast({
          title: "Order received",
          description: "Inventory has been updated automatically",
        })
      } else {
        await updateOrder(order.id, { status: newStatus })
        toast({
          title: "Status updated",
          description: `Order marked as ${newStatus}`,
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update order",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusColor = (status: RestockOrder["status"]) => {
    switch (status) {
      case "pending":
        return "default"
      case "ordered":
        return "secondary"
      case "received":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: RestockOrder["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />
      case "ordered":
        return <Truck className="h-3 w-3" />
      case "received":
        return <Check className="h-3 w-3" />
      case "cancelled":
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const pendingOrders = orders.filter((o) => o.status === "pending")
  const orderedOrders = orders.filter((o) => o.status === "ordered")
  const receivedOrders = orders.filter((o) => o.status === "received")
  const cancelledOrders = orders.filter((o) => o.status === "cancelled")

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
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

  const OrderCard = ({ order }: { order: RestockOrder }) => (
    <Card key={order.id} className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base mb-1.5 truncate">{getInventoryName(order.inventoryId)}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Ordered: {new Date(order.orderedDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant={getStatusColor(order.status)} className="shrink-0 gap-1.5">
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-semibold text-foreground">{order.quantity}</span>
          </div>

          {order.costPrice !== undefined && order.costPrice > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost per Unit</span>
                <span className="font-medium text-foreground">${Number(order.costPrice).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-semibold text-foreground">${Number(order.totalCost || 0).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {order.notes && (
          <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md border border-border">
            <span className="font-medium text-foreground">Notes:</span> {order.notes}
          </div>
        )}

        {order.receivedDate && (
          <div className="text-xs text-muted-foreground">
            Received: {new Date(order.receivedDate).toLocaleDateString()}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {order.status === "pending" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-border bg-transparent"
                onClick={() => handleStatusChange(order, "ordered")}
                disabled={processingId === order.id}
              >
                <Truck className="mr-2 h-3.5 w-3.5" />
                Mark as Ordered
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 border-border bg-transparent"
                onClick={() => handleStatusChange(order, "cancelled")}
                disabled={processingId === order.id}
              >
                Cancel
              </Button>
            </>
          )}

          {order.status === "ordered" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-border bg-transparent"
                onClick={() => handleStatusChange(order, "received")}
                disabled={processingId === order.id}
              >
                <Check className="mr-2 h-3.5 w-3.5" />
                {processingId === order.id ? "Processing..." : "Mark as Received"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 border-border bg-transparent"
                onClick={() => handleStatusChange(order, "cancelled")}
                disabled={processingId === order.id}
              >
                Cancel
              </Button>
            </>
          )}

          {(order.status === "received" || order.status === "cancelled") && (
            <div className="flex-1 text-center text-sm text-muted-foreground py-2">Order complete</div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardDescription className="text-muted-foreground">Pending</CardDescription>
            <CardTitle className="text-3xl font-semibold">{pendingOrders.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardDescription className="text-muted-foreground">Ordered</CardDescription>
            <CardTitle className="text-3xl font-semibold">{orderedOrders.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardDescription className="text-muted-foreground">Received</CardDescription>
            <CardTitle className="text-3xl font-semibold">{receivedOrders.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardDescription className="text-muted-foreground">Cancelled</CardDescription>
            <CardTitle className="text-3xl font-semibold">{cancelledOrders.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="icon" onClick={refetch} className="border-border bg-transparent">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted border border-border">
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="ordered">Ordered ({orderedOrders.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {orders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No restock orders yet</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingOrders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No pending orders</p>
              </CardContent>
            </Card>
          ) : (
            pendingOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="ordered" className="space-y-4 mt-6">
          {orderedOrders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Truck className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No orders in transit</p>
              </CardContent>
            </Card>
          ) : (
            orderedOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4 mt-6">
          {receivedOrders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Check className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No received orders</p>
              </CardContent>
            </Card>
          ) : (
            receivedOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-6">
          {cancelledOrders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No cancelled orders</p>
              </CardContent>
            </Card>
          ) : (
            cancelledOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
