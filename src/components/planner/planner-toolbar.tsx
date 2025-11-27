"use client"

import { View } from "react-big-calendar"
import { format, parse } from "date-fns"
import { th } from "date-fns/locale"

type PlannerToolbarProps = {
  label: string
  currentDate: Date
  currentView: View
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
  onViewChange: (view: View) => void
  onJumpToDate: (date: Date) => void
}

export function PlannerToolbar({
  label,
  onNavigate,
  onViewChange,
  currentDate,
  onJumpToDate,
  currentView,
}: Readonly<PlannerToolbarProps>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-3xl font-semibold text-slate-900">ปฏิทินแผนการขาย</p>
        <p className="text-slate-600">ดูรายการแผนในเดือนหรือสัปดาห์ พร้อมจัดการตารางให้เหมือน Google Calendar</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-md border border-slate-200 bg-white shadow-sm">
          <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => onNavigate("PREV")}>
            ← ก่อนหน้า
          </button>
          <button className="border-x border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => onNavigate("TODAY")}>
            วันนี้
          </button>
          <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => onNavigate("NEXT")}>
            ถัดไป →
          </button>
        </div>
        <select
          value={currentView}
          onChange={(event) => onViewChange(event.target.value as View)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="month">มุมมองเดือน</option>
          <option value="week">มุมมองสัปดาห์</option>
          <option value="day">มุมมองวัน</option>
          <option value="agenda">มุมมองรายการ</option>
        </select>
        <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <span>ไปยังเดือน</span>
          <input
            type="month"
            value={format(currentDate, "yyyy-MM")}
            onChange={(event) => {
              if (!event.target.value) return
              const newDate = parse(event.target.value, "yyyy-MM", new Date(), { locale: th })
              onJumpToDate(newDate)
            }}
            className="rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </div>
      <p className="w-full text-center text-lg font-semibold text-slate-800">{label}</p>
    </div>
  )
}
