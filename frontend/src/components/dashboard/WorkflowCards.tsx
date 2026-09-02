import React from 'react'
import { useRecoveryStore } from '../../store/recoveryStore'
import { CreditCard, ShoppingCart, Repeat, FileText } from 'lucide-react'
import { WorkflowType } from '../../types'

const WORKFLOW_CONFIG: Record<WorkflowType, { icon: any, label: string, color: string, bg: string, border: string }> = {
  PAYMENT_DEGRADATION: { icon: CreditCard, label: 'Payment Degradation', color: 'text-accent-blue', bg: 'bg-[#1e3a5f]', border: 'border-accent-blue/40' },
  CHECKOUT_RECOVERY: { icon: ShoppingCart, label: 'Checkout Recovery', color: 'text-accent-purple', bg: 'bg-[#2d1b69]', border: 'border-accent-purple/40' },
  SUBSCRIPTION_RECOVERY: { icon: Repeat, label: 'Subscription Recovery', color: 'text-accent-teal', bg: 'bg-[#0f3430]', border: 'border-accent-teal/40' },
  RECEIVABLES_CHASER: { icon: FileText, label: 'Receivables Chaser', color: 'text-accent-amber', bg: 'bg-[#3d2200]', border: 'border-accent-amber/40' },
}

export const WorkflowCards: React.FC = () => {
  const { stats } = useRecoveryStore()

  if (!stats) return null

  const workflows: WorkflowType[] = [
    'PAYMENT_DEGRADATION', 'CHECKOUT_RECOVERY', 
    'SUBSCRIPTION_RECOVERY', 'RECEIVABLES_CHASER'
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {workflows.map((wf) => {
        const config = WORKFLOW_CONFIG[wf]
        const Icon = config.icon
        const count = stats.countByWorkflow[wf] || 0
        const atRisk = stats.atRiskByWorkflow[wf] || 0
        const recovered = stats.recoveredByWorkflow[wf] || 0
        const total = atRisk + recovered
        
        let progress = 0
        
        // This is a simplified calculation for demo UI purposes
        if (total > 0) {
            progress = (recovered / total) * 100
        }

        return (
          <div key={wf} className="bg-surface-elevated rounded-xl p-5 border border-border flex flex-col shadow-sm transform transition-all hover:scale-[1.01] hover:border-border-subtle group">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${config.bg} ${config.border} border`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className={`font-semibold text-sm ${config.color}`}>{config.label}</div>
            </div>
            
            <div className="text-text-muted text-xs mb-1">{count} transactions • ₹{total.toLocaleString('en-IN')} at risk</div>
            
            <div className="mt-auto pt-4 relative">
              <div className="flex justify-between items-end mb-2">
                <div className="text-sm font-medium text-text-secondary">Recovered</div>
                <div className={`text-xl font-bold font-mono ${config.color}`}>₹{recovered.toLocaleString('en-IN')}</div>
              </div>
              <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full ${config.bg.replace('bg-', 'bg-').replace('[', '').replace(']', '')} bg-current ${config.color.replace('text-', 'bg-')}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
