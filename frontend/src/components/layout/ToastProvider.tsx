import React from 'react'
import { useRecoveryStore } from '../../store/recoveryStore'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

export const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useRecoveryStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'pointer-events-auto flex items-center w-full rounded-lg shadow-lg ring-1 ring-black/5 p-4 transition-all duration-300 transform translate-y-0 opacity-100',
            toast.type === 'success' ? 'bg-[#0f2e1b] ring-success-green/30 text-success-green' :
            toast.type === 'error' ? 'bg-[#351010] ring-danger-red/30 text-danger-red' :
            'bg-surface-elevated ring-border text-text-primary'
          )}
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-accent-blue" />}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black/10"
              onClick={() => removeToast(toast.id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
