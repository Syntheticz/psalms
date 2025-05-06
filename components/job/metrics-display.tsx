import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, FileCheck, Save, UserCheck } from "lucide-react"

type Metrics = {
  views: number
  applications: number
  saved: number
  qualified: number
}

export default function MetricsDisplay({ metrics }: { metrics: Metrics }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <MetricCard icon={<Eye className="h-4 w-4" />} label="Views" value={metrics.views} />
      <MetricCard icon={<FileCheck className="h-4 w-4" />} label="Applications" value={metrics.applications} />
      <MetricCard icon={<Save className="h-4 w-4" />} label="Saved" value={metrics.saved} />
      <MetricCard icon={<UserCheck className="h-4 w-4" />} label="Qualified" value={metrics.qualified} />
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 flex flex-col items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          {icon}
          <span>{label}</span>
        </div>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
