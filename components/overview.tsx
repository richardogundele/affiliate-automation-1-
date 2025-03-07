"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data: Array<{
    date: string
    [key: string]: string | number
  }>
}

export function Overview({ data }: OverviewProps) {
  if (!data || data.length === 0) {
    return <div>No data available</div>
  }

  const keys = Object.keys(data[0]).filter((key) => key !== "date")

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9370DB" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#9370DB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        {keys.map((key, index) => (
          <Area key={key} type="monotone" dataKey={key} stroke="#9370DB" fillOpacity={1} fill="url(#colorGradient)" />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

