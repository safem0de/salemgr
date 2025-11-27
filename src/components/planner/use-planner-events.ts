"use client"

import { useMemo } from "react"
import { addDays, addHours, addMonths, startOfMonth } from "date-fns"

const eventColors = ["bg-blue-100 border-blue-200 text-blue-900", "bg-rose-100 border-rose-200 text-rose-900", "bg-emerald-100 border-emerald-200 text-emerald-900"]

export type PlannerEvent = {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  color: string
}

export function usePlannerEvents(): PlannerEvent[] {
  return useMemo(() => {
    const templates = [
      { offset: 1, duration: 2, title: "Kickoff แคมเปญ" },
      { offset: 3, duration: 1, title: "ทีมเซลล์ Training" },
      { offset: 7, duration: 3, title: "ประชุมพาร์ทเนอร์" },
      { offset: 9, duration: 1, title: "เปิดตัวโปรโมชัน" },
      { offset: 12, duration: 2, title: "Roadshow หน้าร้าน" },
      { offset: 15, duration: 4, title: "Review แนวทาง" },
      { offset: 20, duration: 1, title: "สรุปรายงาน" },
    ]

    const events: PlannerEvent[] = []
    const startMonth = startOfMonth(new Date())

    for (let monthOffset = -2; monthOffset <= 2; monthOffset += 1) {
      const monthBase = addMonths(startMonth, monthOffset)
      let index = 0
      for (const template of templates) {
        const start = addDays(monthBase, template.offset + index)
        start.setHours(9 + (index % 4) * 2, 0, 0, 0)
        const end = addHours(new Date(start), template.duration)
        const color = eventColors[(monthOffset + index + eventColors.length) % eventColors.length]

        events.push({
          id: `${monthOffset}-${template.title}-${index}`,
          title: template.title,
          start: new Date(start),
          end,
          color,
        })
        index += 1
      }
    }

    return events
  }, [])
}
