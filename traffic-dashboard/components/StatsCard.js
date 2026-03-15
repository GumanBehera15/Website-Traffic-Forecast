"use client"
import { useEffect, useRef, useState } from "react"

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.round(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return value
}

export default function StatsCard({ title, value, trend }) {
  const displayed = useCountUp(value)
  const isPositive = trend >= 0

  return (
    <div className="bg-[#151b27] border border-slate-800 rounded-xl p-5 h-full">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-3xl font-medium text-slate-100">
        {displayed.toLocaleString()}
      </p>
      {trend !== undefined && (
        <div className={`inline-flex items-center gap-1 mt-3 text-xs font-medium px-2 py-1 rounded-full
          ${isPositive ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            {isPositive
              ? <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            }
          </svg>
          {isPositive ? "+" : ""}{trend}% vs last period
        </div>
      )}
    </div>
  )
}