import React from 'react'
import { useRecoveryStore } from '../../store/recoveryStore'
import { AlertTriangle } from 'lucide-react'

export const RiskFlagBanner: React.FC = () => {
  const { transactions } = useRecoveryStore()
  
  const flaggedTxns = transactions.filter(t => t.riskFlag)

  if (flaggedTxns.length === 0) return null

  return (
    <div className="bg-danger-red/10 border border-danger-red/30 rounded-xl p-4 mb-6 flex items-start sm:items-center gap-4 animate-pulse">
      <div className="bg-danger-red/20 p-2 rounded-full flex-shrink-0">
        <AlertTriangle className="w-6 h-6 text-danger-red" />
      </div>
      <div>
        <h4 className="text-danger-red font-bold text-sm">
          {flaggedTxns.length} transaction{flaggedTxns.length > 1 ? 's' : ''} require{flaggedTxns.length === 1 ? 's' : ''} human review
        </h4>
        <p className="text-danger-red/80 text-xs mt-1">
          The agent has detected high-risk signals and paused automated recovery for these items.
        </p>
      </div>
      <div className="ml-auto hidden sm:flex flex-wrap gap-2 justify-end">
        {flaggedTxns.slice(0, 3).map(t => (
          <span key={t.id} className="bg-danger-red/20 text-danger-red text-xs px-2 py-1 rounded font-mono border border-danger-red/30">
            {t.id}
          </span>
        ))}
        {flaggedTxns.length > 3 && (
          <span className="text-danger-red text-xs px-2 py-1">+{flaggedTxns.length - 3} more</span>
        )}
      </div>
    </div>
  )
}
