import React from 'react'

export const WorkflowRulesPanel: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      
      {/* Overview */}
      <div className="bg-surface-elevated border border-border p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Agent Bounding & Compliance</h2>
        <p className="text-text-secondary text-sm">
          Unlike pure conversational bots, the Revenue Recovery Agent operates within strict bounds. Gemini 2.5 Pro acts as a <strong>diagnostic reasoning engine</strong> to choose the best path, but it can only select from predefined safe ladders. All rule violations immediately escalate to humans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Payment Degradation */}
        <div className="bg-surface-elevated border border-accent-blue/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(59,110,234,0.05)]">
            <div className="bg-[#1e3a5f] border-b border-accent-blue/30 p-4">
                <h3 className="font-bold text-accent-blue">Payment Degradation</h3>
                <p className="text-accent-blue/70 text-xs mt-1">Live transaction rescue</p>
            </div>
            <div className="p-5 space-y-4">
                <h4 className="text-sm font-semibold text-text-primary">Allowed Interventions (Ladder)</h4>
                <table className="w-full text-left text-sm border border-border rounded-lg overflow-hidden">
                    <thead className="bg-surface">
                        <tr><th className="p-2 border-b border-border">Intervention</th><th className="p-2 border-b border-border text-right">Success Rate (Hist)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border text-text-secondary">
                        <tr><td className="p-2 bg-accent-blue/5 text-accent-blue font-medium">ROUTE_TO_UPI</td><td className="p-2 text-right">74%</td></tr>
                        <tr><td className="p-2">ROUTE_TO_NETBANKING</td><td className="p-2 text-right">68%</td></tr>
                        <tr><td className="p-2 text-text-primary">RETRY_SAME_METHOD</td><td className="p-2 text-right">58%</td></tr>
                        <tr><td className="p-2">REQUEST_NEW_CARD</td><td className="p-2 text-right">38%</td></tr>
                    </tbody>
                </table>
                <div className="bg-danger-red/10 border border-danger-red/20 p-3 rounded-lg flex items-start gap-3 mt-4">
                    <span className="text-danger-red font-bold text-lg leading-none">!</span>
                    <div className="text-xs text-danger-red/90 leading-relaxed">
                        <strong>Stopping / Escalation Rules:</strong> Max 3 retries. <code className="bg-danger-red/20 px-1 rounded">DO_NOT_HONOR</code> and <code className="bg-danger-red/20 px-1 rounded">RISK_BREACH</code> skip AI and go to humans immediately.
                    </div>
                </div>
            </div>
        </div>

        {/* Checkout Recovery */}
        <div className="bg-surface-elevated border border-accent-purple/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(124,58,237,0.05)]">
            <div className="bg-[#2d1b69] border-b border-accent-purple/30 p-4">
                <h3 className="font-bold text-accent-purple">Checkout Recovery</h3>
                <p className="text-accent-purple/70 text-xs mt-1">Abandoned cart reactivation</p>
            </div>
            <div className="p-5 space-y-4">
                <h4 className="text-sm font-semibold text-text-primary">Allowed Interventions (Ladder)</h4>
                <table className="w-full text-left text-sm border border-border rounded-lg overflow-hidden">
                    <thead className="bg-surface">
                        <tr><th className="p-2 border-b border-border">Intervention</th><th className="p-2 border-b border-border text-right">Success Rate (Hist)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border text-text-secondary">
                        <tr><td className="p-2 text-text-primary">SEND_CART_LINK</td><td className="p-2 text-right">33%</td></tr>
                        <tr><td className="p-2 bg-accent-purple/5 text-accent-purple font-medium">SEND_OFFER (Dynamic)</td><td className="p-2 text-right">27%</td></tr>
                        <tr><td className="p-2 italic text-border">MARK_LOST (Terminal)</td><td className="p-2 text-right">—</td></tr>
                    </tbody>
                </table>
                <div className="bg-warning-amber/10 border border-warning-amber/20 p-3 rounded-lg flex items-start gap-3 mt-4">
                    <span className="text-warning-amber font-bold text-lg leading-none">!</span>
                    <div className="text-xs text-warning-amber/90 leading-relaxed">
                        <strong>Stopping / Escalation Rules:</strong> Max 2 touches per customer. Offers are ONLY authorized if estimated LTV &gt; ₹5,000. MARK_LOST permanently stops automation for this transaction.
                    </div>
                </div>
            </div>
        </div>

        {/* Subscription Recovery */}
        <div className="bg-surface-elevated border border-accent-teal/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(13,148,136,0.05)]">
            <div className="bg-[#0f3430] border-b border-accent-teal/30 p-4">
                <h3 className="font-bold text-accent-teal">Subscription Recovery</h3>
                <p className="text-accent-teal/70 text-xs mt-1">Churn prevention & dunning</p>
            </div>
            <div className="p-5 space-y-4">
                <div className="bg-surface border border-border rounded-lg p-4 mb-4 text-sm text-text-secondary">
                    Uses a progressive escalation ladder based on days passed and failure reason, terminating in <span className="bg-surface-elevated px-1 border border-border rounded">GRACEFUL_DOWNGRADE</span> to preserve the customer relationship for future win-back, rather than harsh cancellations.
                </div>
                <ul className="text-sm space-y-2 text-text-primary">
                    <li className="flex gap-2"><span className="text-text-muted w-4">1.</span> SOFT_RETRY (Immediate)</li>
                    <li className="flex gap-2"><span className="text-text-muted w-4">2.</span> ALTERNATE_METHOD (If multi-card file)</li>
                    <li className="flex gap-2"><span className="text-text-muted w-4">3.</span> SEND_UPDATE_LINK (Email/SMS)</li>
                    <li className="flex gap-2"><span className="text-text-muted w-4">4.</span> FINAL_NOTICE</li>
                    <li className="flex gap-2"><span className="text-danger-red w-4">5.</span> GRACEFUL_DOWNGRADE (Terminal)</li>
                </ul>
            </div>
        </div>

        {/* Receivables Chaser */}
        <div className="bg-surface-elevated border border-accent-amber/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(217,119,6,0.05)]">
            <div className="bg-[#3d2200] border-b border-accent-amber/30 p-4">
                <h3 className="font-bold text-accent-amber">Receivables Chaser</h3>
                <p className="text-accent-amber/70 text-xs mt-1">B2B Overdue Invoice Follow-up</p>
            </div>
            <div className="p-5 space-y-4">
                <ul className="text-sm space-y-3 text-text-secondary w-full">
                    <li className="p-3 border border-border rounded flex justify-between items-center bg-surface hover:bg-surface-elevated transition-colors"><span>FRIENDLY_REMINDER</span> <span className="text-text-muted">Day 1 - 14</span></li>
                    <li className="p-3 border border-border rounded flex justify-between items-center bg-surface hover:bg-surface-elevated transition-colors border-l-4 border-l-accent-amber"><span>FORMAL_NOTICE</span> <span className="text-accent-amber">Day 15 - 29</span></li>
                    <li className="p-3 border border-danger-red/30 rounded flex justify-between items-center bg-danger-red/10 border-l-4 border-l-danger-red text-danger-red font-medium"><span>ESCALATE_TO_HUMAN</span> <span>Day 30+</span></li>
                </ul>
                <div className="bg-danger-red/10 border border-danger-red/20 p-3 rounded-lg flex items-start gap-3 mt-4">
                    <span className="text-danger-red font-bold text-lg leading-none">!</span>
                    <div className="text-xs text-danger-red/90 leading-relaxed">
                        <strong>Hard Limit:</strong> Any invoice exceeding ₹50,000 immediately bypasses automated chasers and routes to Account Manager.
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}
