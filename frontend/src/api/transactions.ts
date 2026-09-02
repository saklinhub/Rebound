import axios from 'axios'
import { Transaction, AuditEntry } from '../types'

const api = axios.create({ baseURL: '/api' })

export const getTransactions = async (filters?: { workflow?: string, status?: string, riskFlag?: boolean }): Promise<Transaction[]> => {
  const cleanFilters: any = {}
  if (filters?.workflow) cleanFilters.workflow = filters.workflow
  if (filters?.status) cleanFilters.status = filters.status
  if (filters?.riskFlag) cleanFilters.riskFlag = true // Only send if we want strictly flagged
  
  const { data } = await api.get('/transactions', { params: cleanFilters })
  return data
}

export const getTransaction = async (id: string): Promise<Transaction> => {
  const { data } = await api.get(`/transactions/${id}`)
  return data
}

export const getAuditLog = async (id: string): Promise<AuditEntry[]> => {
  const { data } = await api.get(`/transactions/${id}/audit`)
  return data
}
