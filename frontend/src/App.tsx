import { Header } from './components/layout/Header'
import { TabNav } from './components/layout/TabNav'
import { ToastProvider } from './components/layout/ToastProvider'
import { ApiKeySetup } from './components/setup/ApiKeySetup'
import { HeroStats } from './components/dashboard/HeroStats'
import { WorkflowCards } from './components/dashboard/WorkflowCards'
import { RecoveryChart } from './components/dashboard/RecoveryChart'
import { ActionPanel } from './components/dashboard/ActionPanel'
import { KanbanBoard } from './components/pipeline/KanbanBoard'
import { AuditTable } from './components/audit/AuditTable'
import { AuditFilters } from './components/audit/AuditFilters'
import { RiskFlagBanner } from './components/audit/RiskFlagBanner'
import { WorkflowRulesPanel } from './components/rules/WorkflowRulesPanel'
import { useRecoveryStore } from './store/recoveryStore'
import { useWebSocket } from './hooks/useWebSocket'
import { useDashboard } from './hooks/useDashboard'
import { simulateWebhook } from './api/webhook'

function App() {
  const { geminiApiKey, activeTab } = useRecoveryStore()

  // Initialize network listeners
  useWebSocket()
  useDashboard()

  if (!geminiApiKey) {
    return <ApiKeySetup />
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col pt-0 pb-10">
      
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-[120px]" />
      </div>

      <Header />
      <TabNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <HeroStats />
            <WorkflowCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecoveryChart />
              </div>
              <div className="lg:col-span-1">
                <ActionPanel />
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KanbanBoard />
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RiskFlagBanner />
            <AuditFilters />
            <AuditTable />
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === 'rules' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <WorkflowRulesPanel />
          </div>
        )}

        {/* WEBHOOK DEMO TAB */}
        {activeTab === 'webhook' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="max-w-2xl mx-auto bg-surface-elevated border border-border rounded-xl p-8 shadow-2xl">
               <div className="mb-6 border-b border-border pb-6">
                  <h2 className="text-2xl font-bold mb-2">Simulate Live Webhook</h2>
                  <p className="text-text-secondary text-sm">
                    Send a mock <code className="bg-background px-1 rounded text-accent-blue">payment.failed</code> webhook to the ingestion API. You will see it appear in the pipeline instantly via WebSocket.
                  </p>
               </div>
               
               <form className="space-y-4" onSubmit={(e) => {
                 e.preventDefault();
                 simulateWebhook({});
                 useRecoveryStore.getState().addToast('Payment webhook sent to API!', 'success');
               }}>
                 <div>
                   <label className="block text-sm font-medium text-text-secondary mb-1">Select Scenario</label>
                   <select className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary">
                     <option>High value checkout abandonment</option>
                     <option>UPI network timeout</option>
                     <option>B2B invoice overdue (large)</option>
                     <option>Card expired on subscription</option>
                   </select>
                 </div>
                 
                 <button type="submit" className="w-full bg-text-primary text-background font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                    Send Webhook to Agent
                 </button>
               </form>

             </div>
          </div>
        )}

      </main>

      <ToastProvider />
    </div>
  )
}

export default App
