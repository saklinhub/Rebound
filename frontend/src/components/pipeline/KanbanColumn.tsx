import React from 'react'
import { useRecoveryStore } from '../../store/recoveryStore'
import { TransactionCard } from './TransactionCard'
import { TransactionStatus } from '../../types'

interface KanbanColumnProps {
  status: TransactionStatus
  title: string
  color: string
  border: string
  isWip?: boolean
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, color, border, isWip = false }) => {
  const { transactions } = useRecoveryStore()
  
  // Combine FAILED inside ESCALATED column visually
  const filteredTxns = transactions.filter(t => 
    status === 'ESCALATED' ? (t.status === 'ESCALATED' || t.status === 'FAILED') : t.status === status
  )
  
  const totalAmount = filteredTxns.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className={`flex flex-col w-[320px] flex-shrink-0 bg-surface-elevated/50 rounded-xl border ${border} overflow-hidden`}>
      {isWip && (
        <div className="h-1 bg-accent-blue w-full animate-[pulse_2s_ease-in-out_infinite]" />
      )}
      <div className={`p-4 border-b ${border} bg-surface-elevated flex justify-between items-center sticky top-0 z-10`}>
        <div>
          <h3 className={`font-semibold text-sm ${color}`}>{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono font-bold text-text-primary">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
              {filteredTxns.length}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
        {filteredTxns.map(txn => (
          <TransactionCard key={txn.id} transaction={txn} />
        ))}
        {filteredTxns.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted py-8 text-center px-4 border-2 border-dashed border-border/50 rounded-lg">
            <span className="text-sm">No transactions here</span>
          </div>
        )}
      </div>
    </div>
  )
}
