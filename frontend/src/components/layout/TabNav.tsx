import React from 'react'
import { useRecoveryStore } from '../../store/recoveryStore'
import { LayoutDashboard, KanbanSquare, FileClock, ShieldCheck, Webhook } from 'lucide-react'
import { clsx } from 'clsx'

export const TabNav: React.FC = () => {
  const { activeTab, setActiveTab } = useRecoveryStore()

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'pipeline', name: 'Pipeline', icon: KanbanSquare },
    { id: 'audit', name: 'Audit Log', icon: FileClock },
    { id: 'rules', name: 'Workflow Rules', icon: ShieldCheck },
    { id: 'webhook', name: 'Webhook Demo', icon: Webhook },
  ] as const

  return (
    <div className="border-b border-border bg-surface-elevated/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  isActive
                    ? 'border-accent-blue text-accent-blue'
                    : 'border-transparent text-text-secondary hover:border-border hover:text-text-primary',
                  'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors'
                )}
              >
                <Icon
                  className={clsx(
                    isActive ? 'text-accent-blue' : 'text-text-muted group-hover:text-text-secondary',
                    '-ml-0.5 mr-2 h-4 w-4 transition-colors'
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
