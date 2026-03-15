"use client"
import { useEffect, useState } from "react"
import StatsCard from "@/components/StatsCard"
import TrafficChart from "@/components/TrafficChart"
import { getForecast } from "@/services/api"
import ConfidenceCard from "@/components/ConfidenceCard"

export default function Home() {
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState([])

  useEffect(() => {
    getForecast().then(data => {
      setForecast(data.forecast || [])
      setHistory(data.history || [])
      setLoading(false)
    })
  }, [])

  const avgTraffic = forecast.length > 0
    ? Math.round(forecast.reduce((a, b) => a + b, 0) / forecast.length) : 0
  const totalTraffic =
  forecast.length > 0
    ? forecast.reduce((a, b) => a + b, 0)
    : 0

    const confidence = (() => {
    if (forecast.length === 0) return 0
      const mean = forecast.reduce((a, b) => a + b, 0) / forecast.length
      const variance = forecast.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / forecast.length
      const stdDev = Math.sqrt(variance)
      const cv = stdDev / mean
      const raw = Math.round((1 - Math.min(cv, 1)) * 100)
      return Math.max(0, Math.min(100, raw))
    })()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1117]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading forecast...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117] px-8 py-8">
      <div className="max-w-6xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-medium tracking-tight"
                style={{ background: "linear-gradient(90deg, #f1f5f9 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Traffic Forecast Dashboard
              </h1>
              <p className="text-xs text-slate-500 tracking-wide">
                Real-time analysis with ARIMA
              </p>
            </div>
                <span className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                30-day forecast
              </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatsCard title="Predicted visitors (tomorrow)" value={forecast[0] || 0} trend={12.4} />
          <StatsCard title="Average predicted traffic" value={avgTraffic} trend={-3.1} />
          <StatsCard title="Total predicted visitors (30 days)" value={totalTraffic} trend={8.7} />
          <ConfidenceCard confidence={confidence} />
        </div>

        <div className="bg-[#151b27] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-200 mb-6">
            30-day website traffic forecast
          </h2>
          <TrafficChart forecast={forecast} history={history} />
        </div>

      </div>
    </div>
  )
}