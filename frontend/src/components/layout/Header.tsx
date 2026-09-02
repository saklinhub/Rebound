import React from 'react'
import { Zap } from 'lucide-react'
import { useRecoveryStore } from '../../store/recoveryStore'

export const Header: React.FC = () => {
  const { stats, agentStatus } = useRecoveryStore()

  return (
    <header className="border-b border-border bg-surface-elevated/50 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-accent-blue fill-accent-blue" />
          <h1 className="text-xl font-semibold tracking-tight">Rebound - Revenue Recovery Agent</h1>
        </div>

        <div className="flex items-center gap-3">
          {stats && (
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-success-green/10 text-success-green border border-success-green/20 text-sm font-medium flex items-center gap-2 animate-number">
                <span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
                ₹{stats.totalRecovered.toLocaleString('en-IN', { maximumFractionDigits: 0 })} recovered
              </span>
              <span className="px-3 py-1 rounded-full bg-escalated-orange/10 text-escalated-orange border border-escalated-orange/20 text-sm font-medium">
                {stats.totalEscalated} escalated
              </span>
            </div>
          )}
          {agentStatus.running && (
            <span className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 text-sm font-medium flex items-center gap-2">
              <svg className="animate-spin h-3 w-3 text-accent-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {agentStatus.processedCount} / {agentStatus.totalTransactions} processed
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-text-muted hidden md:flex">
          <span>Powered by <span className="font-medium text-text-primary">Gemini 2.5 Pro</span></span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span>Razorpay Buildathon</span>
        </div>
      </div>
      
      {agentStatus.running && (
        <div className="h-0.5 w-full bg-surface">
          <div 
            className="h-full bg-accent-blue transition-all duration-500 ease-out"
            style={{ width: `${(agentStatus.processedCount / agentStatus.totalTransactions) * 100}%` }}
          />
        </div>
      )}
    </header>
  )
}
