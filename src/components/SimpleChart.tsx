'use client'

import { useEffect, useRef } from 'react'

interface ChartData {
  date: string
  amount: number
  count: number
}

interface SimpleChartProps {
  data: ChartData[]
  title: string
  height?: number
}

export default function SimpleChart({ data, title, height = 200 }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!data.length || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = height * 2
    ctx.scale(2, 2)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, height)

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.offsetWidth - padding * 2
    const chartHeight = height - padding * 2

    // Find max value
    const maxAmount = Math.max(...data.map(d => d.amount))
    const maxCount = Math.max(...data.map(d => d.count))

    // Draw axes
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(canvas.offsetWidth - padding, height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6'
    ctx.lineWidth = 0.5
    for (let i = 1; i <= 4; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.offsetWidth - padding, y)
      ctx.stroke()
    }

    // Draw bars
    const barWidth = chartWidth / data.length * 0.8
    const barSpacing = chartWidth / data.length * 0.2

    data.forEach((item, index) => {
      const x = padding + (chartWidth / data.length) * index + barSpacing / 2
      const barHeight = (item.amount / maxAmount) * chartHeight
      const y = height - padding - barHeight

      // Draw bar
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw count indicator
      const countHeight = (item.count / maxCount) * chartHeight * 0.3
      const countY = height - padding - countHeight
      ctx.fillStyle = '#10b981'
      ctx.fillRect(x + barWidth * 0.1, countY, barWidth * 0.8, countHeight)
    })

    // Draw labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'

    // X-axis labels (dates)
    data.forEach((item, index) => {
      const x = padding + (chartWidth / data.length) * index + chartWidth / data.length / 2
      const date = new Date(item.date)
      const label = `${date.getMonth() + 1}/${date.getDate()}`
      ctx.fillText(label, x, height - padding + 15)
    })

    // Y-axis labels
    ctx.textAlign = 'right'
    for (let i = 0; i <= 4; i++) {
      const value = (maxAmount / 4) * i
      const y = height - padding - (chartHeight / 4) * i
      ctx.fillText(`$${value.toFixed(0)}`, padding - 10, y + 4)
    }

  }, [data, height])

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: `${height}px` }}
        />
        <div className="absolute top-2 right-2 flex space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
            Amount
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            Count
          </div>
        </div>
      </div>
    </div>
  )
}
