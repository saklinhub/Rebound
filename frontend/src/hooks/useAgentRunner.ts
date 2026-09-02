import { runAgent, resetAgent } from '../api/agent'
import { useRecoveryStore } from '../store/recoveryStore'

export const useAgentRunner = () => {
  const { geminiApiKey, agentStatus, addToast, updateAgentStatus } = useRecoveryStore()

  const startAgent = async () => {
    if (!geminiApiKey) {
      addToast('Gemini API Key is missing. Please set it up first.', 'error')
      return
    }
    
    if (agentStatus.running) return

    try {
      updateAgentStatus({ running: true })
      await runAgent(geminiApiKey)
      addToast('Agent sequence initiated', 'info')
    } catch (error: any) {
      updateAgentStatus({ running: false })
      addToast(error.response?.data?.error || 'Failed to start agent', 'error')
    }
  }

  const stopResetAgent = async () => {
    try {
      await resetAgent()
      addToast('Agent reset successfully', 'success')
      // force reload to clear UI state cleanly for demo
      window.location.reload()
    } catch (error) {
      addToast('Failed to reset agent', 'error')
    }
  }

  return { startAgent, stopResetAgent, isRunning: agentStatus.running }
}
