import { InventoryList } from "@/components/inventory/inventory-list"
import { InventoryHeader } from "@/components/inventory/inventory-header"

export const metadata = {
  title: "Inventory Management | IMS",
  description: "Manage your inventory items and stock levels",
}

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <InventoryHeader />
        <InventoryList />
      </div>
    </div>
  )
}
