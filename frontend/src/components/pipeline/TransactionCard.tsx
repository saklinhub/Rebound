import React from 'react'
import { Transaction } from '../../types'
import { AlertTriangle, Building2, CheckCircle2 } from 'lucide-react'

// Same map as WorkflowCards for consistency
const WORKFLOW_COLORS = {
  PAYMENT_DEGRADATION: 'bg-accent-blue',
  CHECKOUT_RECOVERY: 'bg-accent-purple',
  SUBSCRIPTION_RECOVERY: 'bg-accent-teal',
  RECEIVABLES_CHASER: 'bg-accent-amber',
}

interface TransactionCardProps {
  transaction: Transaction
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction: t }) => {
  const accentColorClass = WORKFLOW_COLORS[t.workflow]

  return (
    <div className="bg-surface rounded-lg p-3 border border-border shadow-sm transform transition-all duration-300 relative overflow-hidden group hover:border-border-subtle">
      {/* Accent left border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColorClass}`} />
      
      <div className="pl-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-sm font-semibold text-text-primary truncate max-w-[150px]" title={t.customerName}>
              {t.customerName}
            </div>
            <div className="text-[10px] text-text-muted font-mono">{t.id}</div>
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            ₹{t.amount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="px-1.5 py-0.5 bg-surface-elevated text-text-secondary text-[10px] uppercase font-semibold rounded border border-border">
            {t.workflow.split('_')[0]}
          </span>
          <span className="px-1.5 py-0.5 bg-danger-red/10 text-danger-red text-[10px] rounded border border-danger-red/20 truncate max-w-full">
            {t.failureReason}
          </span>
        </div>

        {(t.agentIntervention || t.agentDiagnosis) && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            
            {t.riskFlag && (
              <div className="flex items-center gap-1 text-[10px] text-danger-red font-medium bg-danger-red/10 px-1.5 py-0.5 rounded border border-danger-red/20 w-fit">
                <AlertTriangle className="w-3 h-3" /> Flagged for Review
              </div>
            )}
            
            {t.agentIntervention && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-text-muted uppercase">Action:</span>
                <span className="text-xs font-medium text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">
                  {t.agentIntervention}
                </span>
              </div>
            )}
            
            {t.agentConfidence && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-surface-elevated rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${t.agentConfidence > 80 ? 'bg-success-green' : t.agentConfidence > 50 ? 'bg-warning-amber' : 'bg-danger-red'}`} 
                    style={{ width: `${t.agentConfidence}%` }} 
                  />
                </div>
                <span className="text-[10px] text-text-muted font-mono">{t.agentConfidence}%</span>
              </div>
            )}
          </div>
        )}

        {/* B2B / Recurring tags */}
        <div className="absolute right-2 bottom-2 flex gap-1">
          {t.status === 'RECOVERED' && <CheckCircle2 className="w-4 h-4 text-success-green" />}
          {t.b2b && <Building2 className="w-4 h-4 text-text-muted" />}
        </div>
      </div>
    </div>
  )
}
