import { useEffect } from 'react'
import { getStats } from '../api/dashboard'
import { getTransactions } from '../api/transactions'
import { useRecoveryStore } from '../store/recoveryStore'

export const useDashboard = () => {
  const { setStats, setTransactions, filters } = useRecoveryStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, txnsData] = await Promise.all([
          getStats(),
          getTransactions(filters)
        ])
        setStats(statsData)
        setTransactions(txnsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data', error)
      }
    }
    
    fetchData()
  }, [filters, setStats, setTransactions])
}
