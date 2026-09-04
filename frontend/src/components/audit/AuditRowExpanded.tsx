import React, { useEffect, useState } from 'react'
import { Transaction } from '../../types'
import { Clock, BrainCircuit, MessageSquare, Code, Cpu } from 'lucide-react'
import { getTransaction } from '../../api/transactions'

export const AuditRowExpanded: React.FC<{ transaction: Transaction }> = ({ transaction: initialTxn }) => {
  const [t, setT] = useState<Transaction>(initialTxn)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const loadFullTxn = async () => {
      try {
        const fullTxn = await getTransaction(initialTxn.id)
        if (mounted) setT(fullTxn)
      } catch (error) {
        console.error("Failed to load full audit details", error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadFullTxn()
    
    return () => { mounted = false }
  }, [initialTxn.id])

  if (loading) {
    return <div className="p-6 text-center text-accent-blue/70 text-sm animate-pulse">Retrieving full AI telemetry...</div>
  }

  // Safe parsing of audit log to find processor time
  const agentAudit = t.auditLog?.find(a => a.action === 'AGENT_PROCESSED')

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* AI Reasoning Panel */}
      <div className="space-y-4 rounded-lg bg-surface border border-border p-4 flex flex-col h-full justify-between">
        <h4 className="flex items-center gap-2 text-accent-blue font-semibold text-sm">
          <BrainCircuit className="w-4 h-4" /> AI Diagnostics & Reasoning
        </h4>
        
        <div>
          <div className="text-xs text-text-muted uppercase mb-1">Root Cause Diagnosis</div>
          <p className="text-sm text-text-primary bg-background p-3 rounded rounded-l-none border-l-2 border-accent-blue">
            {t.agentDiagnosis || "N/A"}
          </p>
        </div>

        <div>
          <div className="text-xs text-text-muted uppercase mb-1">Intervention Strategy</div>
          <p className="text-sm text-text-secondary bg-background p-3 rounded rounded-l-none border-l-2 border-border">
            {t.agentReasoning || "N/A"}
          </p>
        </div>

        <div className="flex gap-4 border-t border-border pt-3">
          <div>
            <div className="text-[10px] text-text-muted uppercase">Confidence</div>
            <div className="font-mono font-bold text-sm text-text-primary">{t.agentConfidence || 0}%</div>
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase">Fallback Applied</div>
            <div className="text-sm text-text-secondary font-medium">{agentAudit?.apiFallback ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Customer Message Pane */}
        {t.agentMessage && (
          <div className="rounded-lg bg-surface border border-border p-4">
            <h4 className="flex items-center gap-2 text-text-primary font-semibold text-sm mb-3">
              <MessageSquare className="w-4 h-4" /> Dynamic Customer Message
            </h4>
            <div className="bg-[#1e1e24] text-[#e5e5e5] p-3 rounded-lg text-sm rounded-bl-none shadow-inner border border-border relative">
               {t.agentMessage}
               {/* Arrow for speech bubble effect */}
               <div className="absolute -left-1.5 bottom-0 w-3 h-3 bg-[#1e1e24] border-b border-l border-border transform rotate-45"></div>
            </div>
          </div>
        )}

        {/* Technical Data Pane */}
        <div className="rounded-lg bg-surface border border-border p-4 flex flex-col">
            <h4 className="flex items-center gap-2 text-text-primary font-semibold text-sm mb-3">
              <Cpu className="w-4 h-4" /> Execution Trace
            </h4>
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-2 text-xs text-text-secondary bg-background px-2 py-1 rounded">
                <Clock className="w-3 h-3" /> 
                {agentAudit?.processingTimeMs}ms processing time
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary bg-background px-2 py-1 rounded">
                <Code className="w-3 h-3" /> 
                Model: gemini-2.5-pro
              </div>
            </div>
            
            <div className="mt-auto">
                <details className="text-xs group">
                    <summary className="text-accent-blue cursor-pointer font-medium hover:underline flex items-center mb-2">View Raw Raw JSON Response</summary>
                    <pre className="mt-2 bg-[#0d0d12] text-accent-blue/70 p-3 rounded border border-accent-blue/10 overflow-x-auto font-mono text-[10px] max-h-32 custom-scrollbar">
                        {agentAudit?.geminiRawResponse 
                            ? JSON.stringify(JSON.parse(agentAudit.geminiRawResponse), null, 2)
                            : '// No raw output recorded'}
                    </pre>
                </details>
            </div>
        </div>
      </div>
      
    </div>
  )
}
