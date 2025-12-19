import { RestockList } from "@/components/restock/restock-list"
import { RestockHeader } from "@/components/restock/restock-header"

export const metadata = {
  title: "Restock Orders | IMS",
  description: "Manage restock orders and supplier purchases",
}

export default function RestockPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <RestockHeader />
        <RestockList />
      </div>
    </div>
  )
}
