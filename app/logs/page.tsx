import { LogsList } from "@/components/logs/logs-list"
import { LogsHeader } from "@/components/logs/logs-header"

export const metadata = {
  title: "System Logs | IMS",
  description: "Audit-grade system logs and operational records",
}

export default function LogsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <LogsHeader />
        <LogsList />
      </div>
    </div>
  )
}
