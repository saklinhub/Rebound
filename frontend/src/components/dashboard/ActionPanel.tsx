import React from 'react'
import { Play, RotateCcw, Webhook } from 'lucide-react'
import { useAgentRunner } from '../../hooks/useAgentRunner'
import { useRecoveryStore } from '../../store/recoveryStore'

export const ActionPanel: React.FC = () => {
  const { startAgent, stopResetAgent, isRunning } = useAgentRunner()
  const { setActiveTab } = useRecoveryStore()

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Control Panel</h3>
        <p className="text-xs text-text-muted">Agent execution & demo tools</p>
      </div>

      <div className="space-y-4 flex-1">
        <button
          onClick={startAgent}
          disabled={isRunning}
          className={`w-full py-4 px-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
            isRunning 
              ? 'bg-surface border border-accent-blue/30 text-accent-blue cursor-not-allowed opacity-80' 
              : 'bg-accent-blue hover:bg-blue-600 text-white shadow-lg shadow-accent-blue/20 transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isRunning ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Agent Processing Batch...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Run Recovery Agent
            </>
          )}
        </button>

        <button
          onClick={stopResetAgent}
          disabled={isRunning}
          className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 border transition-colors ${
            isRunning ? 'border-border text-border cursor-not-allowed' : 'border-border text-text-secondary hover:bg-surface hover:text-text-primary'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo Data
        </button>

        <div className="pt-4 border-t border-border mt-4">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Live Integration</p>
          <button
            onClick={() => setActiveTab('webhook')}
            className="w-full py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 bg-surface hover:bg-border transition-colors text-text-secondary hover:text-text-primary border border-border"
          >
            <Webhook className="w-4 h-4" />
            Simulate Webhook
          </button>
        </div>
      </div>
    </div>
  )
}
