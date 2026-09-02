import React from 'react'
import { KanbanColumn } from './KanbanColumn'

export const KanbanBoard: React.FC = () => {
  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] overflow-hidden">
      <div className="flex h-full gap-4 overflow-x-auto pb-4 custom-scrollbar">
        <KanbanColumn status="AT_RISK" title="Pipeline / At Risk" color="text-danger-red" border="border-danger-red/20" />
        <KanbanColumn status="DIAGNOSING" title="Agent Diagnosing" color="text-text-primary" border="border-border" isWip={true} />
        <KanbanColumn status="INTERVENING" title="Intervention in Progress" color="text-text-primary" border="border-border" isWip={true} />
        <KanbanColumn status="RECOVERED" title="Recovered Revenue" color="text-success-green" border="border-success-green/20" />
        <KanbanColumn status="ESCALATED" title="Escalated / Failed" color="text-escalated-orange" border="border-escalated-orange/20" />
      </div>
    </div>
  )
}
