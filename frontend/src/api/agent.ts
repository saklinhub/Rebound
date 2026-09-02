import axios from 'axios'
import { AgentStatus } from '../types'

const api = axios.create({ baseURL: '/api' })

export const runAgent = async (geminiApiKey: string): Promise<{ message: string, totalTransactions: number }> => {
  const { data } = await api.post('/agent/run', {}, {
    headers: { 'X-Gemini-Key': geminiApiKey }
  })
  return data
}

export const resetAgent = async (): Promise<{ message: string }> => {
  const { data } = await api.post('/agent/reset')
  return data
}

export const getAgentStatus = async (): Promise<AgentStatus> => {
  const { data } = await api.get('/agent/status')
  return data
}
