import React from 'react'
import { useRecoveryStore } from '../../store/recoveryStore'
import { Filter, Search } from 'lucide-react'
import { WorkflowType, TransactionStatus } from '../../types'

export const AuditFilters: React.FC = () => {
  const { filters, setFilters, transactions } = useRecoveryStore()

  // Derive available options
  const workflows: WorkflowType[] = ['PAYMENT_DEGRADATION', 'CHECKOUT_RECOVERY', 'SUBSCRIPTION_RECOVERY', 'RECEIVABLES_CHASER']
  const statuses: TransactionStatus[] = ['AT_RISK', 'DIAGNOSING', 'INTERVENING', 'RECOVERED', 'FAILED', 'ESCALATED']
  
  const riskCount = transactions.filter(t => t.riskFlag).length

  return (
    <div className="bg-surface-elevated border border-border p-4 rounded-xl flex flex-wrap gap-4 items-center mb-6 shadow-sm">
      <div className="flex items-center gap-2 text-text-secondary mr-2">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <select
        value={filters.workflow}
        onChange={(e) => setFilters({ ...filters, workflow: e.target.value })}
        className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue min-w-[180px]"
      >
        <option value="">All Workflows</option>
        {workflows.map(wf => (
          <option key={wf} value={wf}>{wf}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue min-w-[150px]"
      >
        <option value="">All Statuses</option>
        {statuses.map(s => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>

      <label className="flex items-center gap-2 cursor-pointer ml-auto sm:ml-0 group border border-border px-3 py-2 rounded-lg hover:bg-surface transition-colors">
        <input
          type="checkbox"
          checked={filters.riskFlag}
          onChange={(e) => setFilters({ ...filters, riskFlag: e.target.checked })}
          className="rounded border-border bg-surface text-danger-red focus:ring-danger-red/50 focus:ring-offset-background"
        />
        <span className="text-sm font-medium text-text-primary group-hover:text-danger-red transition-colors flex items-center gap-1">
          ⚠ Flagged Only <span className="text-xs text-text-muted bg-background px-1.5 rounded">{riskCount}</span>
        </span>
      </label>

      {/* Demo Search (mostly visual for this mockup) */}
      <div className="relative ml-auto flex-1 min-w-[200px] max-w-[300px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search TXN ID..." 
          className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue"
        />
      </div>
    </div>
  )
}
