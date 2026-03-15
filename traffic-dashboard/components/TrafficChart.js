"use client"
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Legend, Tooltip, Filler
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler)

const todayDividerPlugin = {
  id: "todayDivider",
  afterDraw(chart) {
    const { ctx, chartArea, scales } = chart
    const meta = chart.getDatasetMeta(0)
    const lastValidIndex = meta.data.reduce((acc, pt, i) => {
      return chart.data.datasets[0].data[i] !== null ? i : acc
    }, 0)
    const x = meta.data[lastValidIndex]?.x
    if (!x) return
    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = "#475569"
    ctx.lineWidth = 1
    ctx.moveTo(x, chartArea.top)
    ctx.lineTo(x, chartArea.bottom)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.font = "11px sans-serif"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"
    ctx.fillText("today", x, chartArea.top - 6)
    ctx.restore()
  }
}

const dotGridPlugin = {
  id: "dotGrid",
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart
    const xTicks = scales.x.ticks
    const yTicks = scales.y.ticks
    ctx.save()
    xTicks.forEach((_, xi) => {
      const x = scales.x.getPixelForTick(xi)
      yTicks.forEach((_, yi) => {
        const y = scales.y.getPixelForTick(yi)
        if (x >= chartArea.left && x <= chartArea.right && y >= chartArea.top && y <= chartArea.bottom) {
          ctx.beginPath()
          ctx.arc(x, y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = "#1e3a5f"
          ctx.fill()
        }
      })
    })
    ctx.restore()
  }
}

export default function TrafficChart({ history = [], forecast = [] }) {
  if (history.length === 0 && forecast.length === 0) {
    return <p className="text-slate-500 text-sm">No data available.</p>
  }

  const labels = [
    ...history.map((_, i) => `D-${history.length - i}`),
    ...forecast.map((_, i) => `D+${i + 1}`)
  ]

  const forecastWithJoin = [...Array(history.length - 1).fill(null), history[history.length - 1], ...forecast]
  const historyData = [...history, ...Array(forecast.length).fill(null)]

  const chartData = {
    labels,
    datasets: [
      {
        label: "Historical Traffic",
        data: historyData,
        borderColor: "#1D9E75",
        backgroundColor: "rgba(29,158,117,0.08)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
      },
      {
        label: "Predicted Traffic",
        data: forecastWithJoin,
        borderColor: "#7F77DD",
        backgroundColor: "rgba(127,119,221,0.08)",
        borderWidth: 2,
        borderDash: [6, 3],
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#94a3b8",
        bodyColor: "#f1f1f1",
        borderColor: "#334155",
        borderWidth: 0.5,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#475569", font: { size: 11 }, maxTicksLimit: 12, maxRotation: 0 }
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#475569",
          font: { size: 11 },
          callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
        }
      }
    },
    interaction: { mode: "index", intersect: false }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {[{ color: "#1D9E75", label: "Historical" }, { color: "#7F77DD", label: "Predicted", dashed: true }].map(l => (
          <div key={l.label} className="flex items-center gap-2 text-xs text-slate-400">
            {l.dashed
              ? <svg width="14" height="10"><line x1="0" y1="5" x2="14" y2="5" stroke={l.color} strokeWidth="2" strokeDasharray="4 2"/></svg>
              : <span className="w-3 h-3 rounded-sm inline-block" style={{ background: l.color }} />
            }
            {l.label}
          </div>
        ))}
      </div>
      <div style={{ position: "relative", height: "280px" }}>
        <Line data={chartData} options={options} plugins={[todayDividerPlugin, dotGridPlugin]} />
      </div>
    </div>
  )
}