import React, { useState } from 'react'
import { useRecoveryStore } from '../../store/recoveryStore'
import { AuditRowExpanded } from './AuditRowExpanded'
import { ChevronDown, ChevronRight, AlertTriangle, Download } from 'lucide-react'

export const AuditTable: React.FC = () => {
  const { transactions, filters } = useRecoveryStore()
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // Filter local store just for view
  let displayTxns = [...transactions]
  if (filters.workflow) displayTxns = displayTxns.filter(t => t.workflow === filters.workflow)
  if (filters.status) displayTxns = displayTxns.filter(t => t.status === filters.status)
  if (filters.riskFlag) displayTxns = displayTxns.filter(t => t.riskFlag === true)
  
  // Sort by process time or creation if not processed
  displayTxns.sort((a, b) => {
    const timeA = a.processedAt ? new Date(a.processedAt).getTime() : new Date(a.createdAt).getTime()
    const timeB = b.processedAt ? new Date(b.processedAt).getTime() : new Date(b.createdAt).getTime()
    return timeB - timeA
  })

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(displayTxns, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href",     dataStr)
    downloadAnchorNode.setAttribute("download", "audit_export.json")
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <div className="bg-surface-elevated border border-border rounded-xl shadow-sm flex flex-col h-[calc(100vh-14rem)] min-h-[600px]">
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h3 className="font-semibold text-text-primary text-lg">System Audit Log</h3>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary bg-surface py-1.5 px-3 rounded-lg border border-border transition-colors"
        >
          <Download className="w-4 h-4" /> Export JSON
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-surface/50 border-b border-border sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="py-3 px-4 font-medium text-text-muted font-mono uppercase text-[10px]">Time</th>
              <th className="py-3 px-4 font-medium text-text-muted font-mono uppercase text-[10px]">TXN ID</th>
              <th className="py-3 px-4 font-medium text-text-muted font-mono uppercase text-[10px]">Customer</th>
              <th className="py-3 px-4 font-medium text-text-muted font-mono uppercase text-[10px] text-right">Amount</th>
              <th className="py-3 px-4 font-medium text-text-muted font-mono uppercase text-[10px]">AI Intervention</th>
              <th className="py-3 px-4 font-medium text-text-muted font-mono uppercase text-[10px]">Outcome</th>
              <th className="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayTxns.map((txn) => (
              <React.Fragment key={txn.id}>
                <tr 
                  className={`hover:bg-surface/30 cursor-pointer transition-colors ${expandedRow === txn.id ? 'bg-surface/50' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === txn.id ? null : txn.id)}
                >
                  <td className="py-3 px-4 whitespace-nowrap text-text-secondary text-xs">
                    {txn.processedAt ? new Date(txn.processedAt).toLocaleTimeString() : new Date(txn.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-text-primary">{txn.id}</td>
                  <td className="py-3 px-4 text-text-primary font-medium">
                    {txn.customerName} {txn.riskFlag && <AlertTriangle className="inline w-3 h-3 text-danger-red ml-1 mb-0.5" />}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-text-primary">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    {txn.agentIntervention ? (
                      <span className="bg-accent-blue/10 text-accent-blue px-2 py-1 rounded text-[10px] font-bold border border-accent-blue/20">
                        {txn.agentIntervention}
                      </span>
                    ) : (
                      <span className="text-text-muted text-xs italic">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase border ${
                      txn.status === 'RECOVERED' ? 'bg-success-green/10 text-success-green border-success-green/20' :
                      txn.status === 'ESCALATED' || txn.status === 'FAILED' ? 'bg-danger-red/10 text-danger-red border-danger-red/20' :
                      'bg-surface-elevated text-text-muted border-border'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {expandedRow === txn.id ? <ChevronDown className="w-5 h-5 mx-auto" /> : <ChevronRight className="w-5 h-5 mx-auto" />}
                  </td>
                </tr>
                {expandedRow === txn.id && (
                  <tr>
                    <td colSpan={7} className="p-0 border-b border-border bg-black/20">
                      <AuditRowExpanded transaction={txn} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
