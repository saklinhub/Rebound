import React, { useState } from 'react'
import { Zap, KeyRound, ShieldAlert } from 'lucide-react'
import { useRecoveryStore } from '../../store/recoveryStore'

export const ApiKeySetup: React.FC = () => {
  const [inputKey, setInputKey] = useState('')
  const [error, setError] = useState('')
  const { setApiKey } = useRecoveryStore()

  const handleLaunch = () => {
    if (inputKey.length < 20) {
      setError('Invalid API Key format. Key is too short.')
      return
    }
    setApiKey(inputKey)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-surface-elevated rounded-2xl shadow-2xl p-8 border border-border relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-accent-blue/10 rounded-xl flex items-center justify-center mb-4 border border-accent-blue/20">
            <Zap className="w-8 h-8 text-accent-blue fill-accent-blue" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">Revenue Recovery Agent</h1>
          <p className="text-text-secondary text-sm">Razorpay Buildathon — Track 3</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Paste Gemini API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value)
                setError('')
              }}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
              placeholder="AIzaSy..."
            />
            {error && (
              <p className="mt-2 text-sm text-danger-red flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> {error}
              </p>
            )}
            <p className="mt-3 text-xs text-text-muted">
              Free at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-accent-blue hover:underline">aistudio.google.com/apikey</a> — no credit card needed.
            </p>
          </div>

          <button
            onClick={handleLaunch}
            className="w-full bg-accent-blue hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-accent-blue/20"
          >
            Launch Agent Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
