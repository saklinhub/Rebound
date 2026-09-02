import axios from 'axios'
import { DashboardStats } from '../types'

const api = axios.create({ baseURL: '/api' })

export const getStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/dashboard/stats')
  return data
}
