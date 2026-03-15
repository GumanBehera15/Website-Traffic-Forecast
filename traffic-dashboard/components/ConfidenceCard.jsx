"use client"
import { useEffect, useState } from "react"

export default function ConfidenceCard({ confidence = 0 }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let start = 0
    const step = confidence / (1200 / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= confidence) { setDisplayed(confidence); clearInterval(timer) }
      else setDisplayed(Math.round(start))
    }, 16)
    return () => clearInterval(timer)
  }, [confidence])

  const size = 80
  const stroke = 6
  const r = (size - stroke) / 2
  const circ = Math.PI * r
  const offset = circ - (displayed / 100) * circ

  const color =
    confidence >= 75 ? "#1D9E75" :
    confidence >= 50 ? "#EF9F27" : "#E24B4A"

  const label =
    confidence >= 75 ? "High" :
    confidence >= 50 ? "Medium" : "Low"

  const labelColor =
    confidence >= 75 ? "text-emerald-400" :
    confidence >= 50 ? "text-amber-400" : "text-red-400"

  const badgeBg =
    confidence >= 75 ? "bg-emerald-900/40" :
    confidence >= 50 ? "bg-amber-900/40" : "bg-red-900/40"

  return (
    <div className="bg-[#151b27] border border-slate-800 rounded-xl p-5 h-full">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Forecast confidence</p>
      <div className="flex items-center gap-4">
        <svg width={size} height={size / 2 + stroke} viewBox={`0 0 ${size} ${size / 2 + stroke}`}>
          <path
            d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div>
          <p className="text-3xl font-medium text-slate-100">{displayed}%</p>
          <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${badgeBg} ${labelColor}`}>
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}