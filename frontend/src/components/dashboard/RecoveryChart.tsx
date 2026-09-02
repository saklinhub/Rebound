import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRecoveryStore } from '../../store/recoveryStore'

export const RecoveryChart: React.FC = () => {
  const { recoveryTimeline } = useRecoveryStore()

  // Ensure there's a baseline
  const data = recoveryTimeline.length > 0 ? recoveryTimeline : [
      { batch: 0, recovered: 0, time: new Date().toISOString() }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-elevated border border-border p-3 rounded-lg shadow-xl">
          <p className="text-text-secondary text-xs mb-1">Batch {label}</p>
          <p className="text-success-green font-bold font-mono">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Cumulative ₹ Recovered</h3>
        <p className="text-xs text-text-muted">Real-time batch performance</p>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252836" vertical={false} />
            <XAxis 
              dataKey="batch" 
              stroke="#52566A" 
              tick={{fill: '#8B8FA8', fontSize: 12}}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `B${v}`} 
            />
            <YAxis 
              stroke="#52566A" 
              tick={{fill: '#8B8FA8', fontSize: 12}}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="recovered" 
              stroke="#10B981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRecovered)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
