import { create } from 'zustand'
import { Transaction, DashboardStats, AgentStatus } from '../types'

interface RecoveryStore {
  geminiApiKey: string | null
  transactions: Transaction[]
  stats: DashboardStats | null
  agentStatus: AgentStatus
  recoveryTimeline: Array<{ batch: number; recovered: number; time: string }>
  activeTab: 'overview' | 'pipeline' | 'audit' | 'rules' | 'webhook'
  filters: { workflow: string; status: string; riskFlag: boolean }
  toasts: Array<{ id: string; message: string; type: 'info' | 'success' | 'error'; duration: number }>
  
  setApiKey: (key: string) => void
  setTransactions: (txns: Transaction[]) => void
  updateTransaction: (txn: Transaction) => void
  setStats: (stats: DashboardStats) => void
  updateAgentStatus: (status: Partial<AgentStatus>) => void
  addTimelinePoint: (point: { batch: number; recovered: number; time: string }) => void
  setActiveTab: (tab: 'overview' | 'pipeline' | 'audit' | 'rules' | 'webhook') => void
  setFilters: (filters: { workflow: string; status: string; riskFlag: boolean }) => void
  addToast: (message: string, type: 'info' | 'success' | 'error', duration?: number) => void
  removeToast: (id: string) => void
  resetAll: () => void
}

export const useRecoveryStore = create<RecoveryStore>((set) => ({
  geminiApiKey: null,
  transactions: [],
  stats: null,
  agentStatus: {
    running: false,
    processedCount: 0,
    totalTransactions: 200,
    totalRecovered: 0,
    startedAt: null
  },
  recoveryTimeline: [],
  activeTab: 'overview',
  filters: { workflow: '', status: '', riskFlag: false },
  toasts: [],

  setApiKey: (key) => set({ geminiApiKey: key }),
  
  setTransactions: (txns) => set({ transactions: txns }),
  
  updateTransaction: (txn) => set((state) => ({
    transactions: state.transactions.map(t => t.id === txn.id ? { ...t, ...txn } : t)
  })),
  
  setStats: (stats) => set({ stats }),
  
  updateAgentStatus: (updates) => set((state) => ({
    agentStatus: { ...state.agentStatus, ...updates }
  })),
  
  addTimelinePoint: (point) => set((state) => ({
    recoveryTimeline: [...state.recoveryTimeline, point]
  })),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setFilters: (filters) => set({ filters }),
  
  addToast: (message, type, duration = 3000) => {
    const id = Math.random().toString(36).substring(7)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }))
    }, duration)
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
  
  resetAll: () => set(() => ({
    transactions: [],
    stats: null,
    agentStatus: { running: false, processedCount: 0, totalTransactions: 200, totalRecovered: 0, startedAt: null },
    recoveryTimeline: []
  }))
}))
