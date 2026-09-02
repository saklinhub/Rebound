import React, { useEffect, useRef, useState } from 'react'
import { useRecoveryStore } from '../../store/recoveryStore'

// Simple animation hook for numbers
function useAnimatedNumber(value: number, duration = 600) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    if (value === prevValue.current) return
    let startTimestamp: number | null = null
    const startValue = prevValue.current
    const endValue = value

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const current = Math.floor(startValue + progress * (endValue - startValue))
      setDisplayValue(current)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        prevValue.current = endValue
      }
    }
    window.requestAnimationFrame(step)
  }, [value, duration])

  return displayValue
}

export const HeroStats: React.FC = () => {
  const { stats, agentStatus } = useRecoveryStore()

  const safeStats = stats || {
    totalAtRisk: 0,
    totalRecovered: 0,
    recoveryRate: 0,
    totalProcessed: 0
  }

  const animatedRecovered = useAnimatedNumber(safeStats.totalRecovered)
  
  // Custom circular progress SVG
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference - (safeStats.recoveryRate / 100) * circumference

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-surface-elevated rounded-xl p-5 border flex flex-col justify-between border-border shadow-sm transform transition-all hover:scale-[1.01]">
        <div className="text-text-secondary text-sm font-medium mb-1">Total At Risk</div>
        <div className="text-3xl font-bold text-danger-red font-mono">
          ₹{safeStats.totalAtRisk.toLocaleString('en-IN')}
        </div>
        <div className="text-text-muted text-xs mt-2">{agentStatus.totalTransactions} pending transactions</div>
      </div>

      <div className="bg-surface-elevated rounded-xl p-5 border border-success-green/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex flex-col justify-between transform transition-all hover:scale-[1.01]">
        <div className="text-success-green flex items-center gap-2 text-sm font-medium mb-1">
          <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
          Recovered Live
        </div>
        <div className="text-4xl font-bold text-success-green font-mono">
          ₹{animatedRecovered.toLocaleString('en-IN')}
        </div>
        <div className="text-text-muted text-xs mt-2">{safeStats.totalProcessed} transactions recovered</div>
      </div>

      <div className="bg-surface-elevated rounded-xl p-5 border border-border shadow-sm flex items-center justify-between transform transition-all hover:scale-[1.01]">
        <div>
          <div className="text-text-secondary text-sm font-medium mb-1">Recovery Rate</div>
          <div className="text-3xl font-bold text-text-primary">{safeStats.recoveryRate.toFixed(1)}%</div>
          <div className="text-text-muted text-xs mt-2">of processed volume</div>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={radius} fill="none" className="stroke-surface" strokeWidth="6" />
            <circle 
              cx="32" cy="32" r={radius} fill="none" 
              className="stroke-accent-blue transition-all duration-1000 ease-in-out" 
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
            />
          </svg>
        </div>
      </div>

      <div className="bg-surface-elevated rounded-xl p-5 border border-border shadow-sm flex flex-col justify-between transform transition-all hover:scale-[1.01]">
        <div className="text-text-secondary text-sm font-medium mb-1">Agent Status</div>
        <div className="flex items-center gap-3">
          {agentStatus.running ? (
            <>
              <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-blue animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-accent-blue">Processing...</div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-border">
                <div className="w-4 h-4 rounded-full bg-text-muted" />
              </div>
              <div className="text-xl font-bold text-text-primary">Idle</div>
            </>
          )}
        </div>
        <div className="text-text-muted text-xs mt-2">
          {agentStatus.running ? `Batch tracking live...` : `Ready to launch via Action Panel.`}
        </div>
      </div>
    </div>
  )
}
