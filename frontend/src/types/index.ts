export type WorkflowType =
  | 'PAYMENT_DEGRADATION'
  | 'CHECKOUT_RECOVERY'
  | 'SUBSCRIPTION_RECOVERY'
  | 'RECEIVABLES_CHASER'

export type TransactionStatus =
  | 'AT_RISK' | 'DIAGNOSING' | 'INTERVENING'
  | 'RECOVERED' | 'FAILED' | 'ESCALATED'

export interface AuditEntry {
  id: number
  timestamp: string
  action: string
  detail: string
  intervention: string | null
  confidence: number | null
  outcome: string | null
  apiFallback: boolean
  geminiRawResponse?: string
  processingTimeMs: number | null
}

export interface Transaction {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
  paymentMethod: string
  failureReason: string
  workflow: WorkflowType
  status: TransactionStatus
  recurring: boolean
  b2b: boolean
  daysOverdue: number | null
  dropStep: string | null
  retryCount: number
  touches: number
  agentDiagnosis: string | null
  agentIntervention: string | null
  agentConfidence: number | null
  agentMessage: string | null
  agentReasoning: string | null
  riskFlag: boolean
  outcome: string | null
  createdAt: string
  processedAt: string | null
  auditLog: AuditEntry[]
}

export interface DashboardStats {
  totalAtRisk: number
  totalRecovered: number
  totalFailed: number
  totalEscalated: number
  recoveryRate: number
  countByStatus: Record<string, number>
  countByWorkflow: Record<string, number>
  recoveredByWorkflow: Record<string, number>
  atRiskByWorkflow: Record<string, number>
  riskFlagCount: number
  totalProcessed: number
  recoveryTimeline: Array<{
    batchNumber: number
    cumulativeRecovered: number
    timestamp: string
  }>
}

export interface WebSocketEvent {
  type: 'TRANSACTION_UPDATE' | 'BATCH_COMPLETE' | 'AGENT_COMPLETE' | 'AGENT_STARTED' | 'NEW_TRANSACTION_DETECTED'
  transactionId?: string
  status?: TransactionStatus
  workflow?: WorkflowType
  amount?: number
  intervention?: string
  outcome?: string
  totalRecovered?: number
  processedCount?: number
  timestamp: string
  batchNumber?: number
  summary?: DashboardStats
}

export interface AgentStatus {
  running: boolean
  processedCount: number
  totalTransactions: number
  totalRecovered: number
  startedAt: string | null
}
