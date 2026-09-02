import { useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useRecoveryStore } from '../store/recoveryStore'
import { WebSocketEvent } from '../types'
import { getStats } from '../api/dashboard'

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false)
  
  // Get stable function references
  const { updateTransaction, addTimelinePoint, addToast, setStats, updateAgentStatus } = useRecoveryStore()

  useEffect(() => {
    const socket = new SockJS('/ws')
    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      onConnect: () => {
        setConnected(true)
        stompClient.subscribe('/topic/agent-events', async (message) => {
          const event: WebSocketEvent = JSON.parse(message.body)
          
          if (event.type === 'TRANSACTION_UPDATE' && event.transactionId) {
            updateTransaction({
              id: event.transactionId,
              status: event.status,
              outcome: event.outcome,
              agentIntervention: event.intervention
            } as any)
            updateAgentStatus({
              processedCount: event.processedCount,
              totalRecovered: event.totalRecovered
            })
            // Fetch updated stats
            const newStats = await getStats()
            setStats(newStats)
          } 
          else if (event.type === 'BATCH_COMPLETE' && event.batchNumber) {
            const freshState = useRecoveryStore.getState()
            addTimelinePoint({
              batch: event.batchNumber,
              recovered: freshState.agentStatus.totalRecovered,
              time: event.timestamp
            })
            addToast(`Batch ${event.batchNumber} complete`, 'info')
          }
          else if (event.type === 'AGENT_COMPLETE') {
            updateAgentStatus({ running: false })
            const newStats = await getStats()
            setStats(newStats)
            addToast(`Agent complete! Recovered ₹${newStats.totalRecovered.toFixed(2)}`, 'success', 5000)
          }
          else if (event.type === 'AGENT_STARTED') {
            updateAgentStatus({ running: true, startedAt: event.timestamp })
            addToast('Agent started processing', 'info')
          }
          else if (event.type === 'NEW_TRANSACTION_DETECTED') {
            addToast('New failed transaction detected via Razorpay Webhook', 'info')
            const newStats = await getStats()
            setStats(newStats)
          }
        })
      },
      onDisconnect: () => {
        setConnected(false)
      }
    })

    stompClient.activate()

    return () => {
      stompClient.deactivate()
    }
  }, [updateTransaction, addTimelinePoint, addToast, setStats, updateAgentStatus])

  return { connected }
}
