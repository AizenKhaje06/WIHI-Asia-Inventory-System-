"use client"

import { useState, useEffect } from "react"
import { LogService } from "@/lib/services/log-service"
import type { LogEntry } from "@/lib/api/google-sheets-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RefreshCw, Info, AlertTriangle, XCircle, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LogsList() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [operationFilter, setOperationFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>("")

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await LogService.getAll(500) // Increased limit for better filtering
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch logs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const getLevelIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO":
        return <Info className="h-3 w-3" />
      case "WARN":
        return <AlertTriangle className="h-3 w-3" />
      case "ERROR":
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO":
        return "default"
      case "WARN":
        return "secondary"
      case "ERROR":
        return "destructive"
      default:
        return "default"
    }
  }

  const filteredLogs = logs.filter((log) => {
    // Operation filter
    if (operationFilter !== "all" && log.operation !== operationFilter) {
      return false
    }

    // Search filter (searches in message and details)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesMessage = log.message.toLowerCase().includes(query)
      const matchesDetails = log.details?.toLowerCase().includes(query)
      const matchesOperation = log.operation.toLowerCase().includes(query)
      if (!matchesMessage && !matchesDetails && !matchesOperation) {
        return false
      }
    }

    // Date filter
    if (dateFilter) {
      const logDate = new Date(log.timestamp).toISOString().split("T")[0]
      if (logDate !== dateFilter) {
        return false
      }
    }

    return true
  })

  const infoLogs = filteredLogs.filter((l) => l.level === "INFO")
  const warnLogs = filteredLogs.filter((l) => l.level === "WARN")
  const errorLogs = filteredLogs.filter((l) => l.level === "ERROR")

  const uniqueOperations = Array.from(new Set(logs.map((log) => log.operation))).sort()

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

  const LogTable = ({ logs: displayLogs }: { logs: LogEntry[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead className="w-[100px]">Level</TableHead>
            <TableHead className="w-[150px]">Operation</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="w-[120px]">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                No logs found matching filters
              </TableCell>
            </TableRow>
          ) : (
            displayLogs.map((log, index) => (
              <TableRow key={`${log.timestamp}-${index}`}>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getLevelColor(log.level)} className="gap-1">
                    {getLevelIcon(log.level)}
                    {log.level}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-sm">{log.operation}</TableCell>
                <TableCell className="max-w-xs">{log.message}</TableCell>
                <TableCell>
                  {log.details && (
                    <details className="cursor-pointer">
                      <summary className="text-xs text-muted-foreground hover:text-foreground">View</summary>
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto max-w-md whitespace-pre-wrap">
                        {log.details}
                      </pre>
                    </details>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Logs</CardDescription>
            <CardTitle className="text-3xl">{filteredLogs.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Info</CardDescription>
            <CardTitle className="text-3xl">{infoLogs.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Warnings</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{warnLogs.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className={errorLogs.length > 0 ? "border-destructive" : ""}>
          <CardHeader className="pb-3">
            <CardDescription>Errors</CardDescription>
            <CardTitle className="text-3xl text-destructive">{errorLogs.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Error Alert */}
      {errorLogs.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorLogs.length} {errorLogs.length === 1 ? "error" : "errors"} detected in system logs. Review
            immediately.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search and filter audit logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Operation</label>
              <Select value={operationFilter} onValueChange={setOperationFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Operations</SelectItem>
                  {uniqueOperations.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setOperationFilter("all")
                setDateFilter("")
              }}
            >
              Clear Filters
            </Button>
            <Button variant="outline" size="sm" onClick={fetchLogs}>
              <RefreshCw className="h-3 w-3 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>Immutable system activity records for compliance and debugging</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({filteredLogs.length})</TabsTrigger>
              <TabsTrigger value="info">Info ({infoLogs.length})</TabsTrigger>
              <TabsTrigger value="warn">Warnings ({warnLogs.length})</TabsTrigger>
              <TabsTrigger value="error">Errors ({errorLogs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <LogTable logs={filteredLogs} />
            </TabsContent>

            <TabsContent value="info" className="mt-4">
              <LogTable logs={infoLogs} />
            </TabsContent>

            <TabsContent value="warn" className="mt-4">
              <LogTable logs={warnLogs} />
            </TabsContent>

            <TabsContent value="error" className="mt-4">
              <LogTable logs={errorLogs} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
