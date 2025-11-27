"use client"

import "react-big-calendar/lib/css/react-big-calendar.css"

import { useMemo, useState } from "react"
import { Calendar, type ToolbarProps, View, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek as startOfWeekFn, getDay, addDays, addHours } from "date-fns"
import { th } from "date-fns/locale"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { sidebarMenu } from "@/lib/sidebar-menu"

const locales = {
  th,
}

const localizer = dateFnsLocalizer({
  format,
  parse: (dateString, formatString) => parse(dateString, formatString, new Date(), { locale: th }),
  startOfWeek: (date) => startOfWeekFn(date, { locale: th }),
  getDay,
  locales,
})

type PlannerEvent = {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  color: string
}

const eventColors = ["bg-blue-100 border-blue-200 text-blue-900", "bg-rose-100 border-rose-200 text-rose-900", "bg-emerald-100 border-emerald-200 text-emerald-900"]

function PlannerToolbar({ label, onNavigate, onView, view }: ToolbarProps) {
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
          value={view}
          onChange={(event) => onView(event.target.value as View)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="month">มุมมองเดือน</option>
          <option value="week">มุมมองสัปดาห์</option>
          <option value="day">มุมมองวัน</option>
          <option value="agenda">มุมมองรายการ</option>
        </select>
      </div>
      <p className="w-full text-center text-lg font-semibold text-slate-800">{label}</p>
    </div>
  )
}

export default function PlannerCalendarPage() {
  const { data: session } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [view, setView] = useState<View>("month")

  const plannerEvents: PlannerEvent[] = useMemo(() => {
    const base = new Date()
    base.setHours(9, 0, 0, 0)

    const createEvent = (offsetDays: number, durationHours: number, title: string): PlannerEvent => {
      const start = addDays(base, offsetDays)
      const end = addHours(start, durationHours)
      const color = eventColors[offsetDays % eventColors.length]
      return {
        id: `${offsetDays}-${title}`,
        title,
        start,
        end,
        color,
      }
    }

    return [
      createEvent(0, 2, "Kickoff แคมเปญ"),
      createEvent(1, 1, "ทีมเซลล์ Training"),
      createEvent(3, 3, "ประชุมพาร์ทเนอร์"),
      createEvent(5, 1, "เปิดตัวโปรโมชัน"),
      createEvent(8, 2, "Roadshow หน้าร้าน"),
      createEvent(10, 4, "Review แนวทาง"),
      createEvent(15, 1, "สรุปรายงานกลางเดือน"),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar
        session={session}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogin={() => signIn("keycloak")}
        onLogout={() => signOut()}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={sidebarMenu} isCollapsed={isSidebarCollapsed} hasSession={Boolean(session)} />

        <main className="flex-1 p-8 overflow-y-auto">
          {session ? (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <Calendar
                view={view}
                onView={(next) => setView(next)}
                localizer={localizer}
                culture="th"
                events={plannerEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ minHeight: 650 }}
                components={{
                  toolbar: (props) => <PlannerToolbar {...props} view={view} />,
                }}
                popup
                selectable
                longPressThreshold={50}
                eventPropGetter={(event) => ({
                  className: `border ${event.color} rounded-md px-2`,
                })}
                formats={{
                  agendaDateFormat: (date) => format(date, "EEE d MMM", { locale: th }),
                  dayHeaderFormat: (date) => format(date, "EEE d MMM", { locale: th }),
                  dayRangeHeaderFormat: ({ start, end }) =>
                    `${format(start, "d MMM", { locale: th })} - ${format(end, "d MMM yyyy", { locale: th })}`,
                }}
                messages={{
                  next: "ถัดไป",
                  previous: "ก่อนหน้า",
                  today: "วันนี้",
                  month: "เดือน",
                  week: "สัปดาห์",
                  day: "วัน",
                  agenda: "รายการ",
                }}
              />
            </section>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-3xl font-semibold text-slate-900">เข้าสู่ระบบเพื่อดูปฏิทินแผนการขาย</p>
              <p className="mt-3 text-slate-600 max-w-lg">
                ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถดูและจัดการ Sale Planner
                ได้
              </p>
              <button
                className="mt-8 rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-blue-500"
                onClick={() => signIn("keycloak")}
              >
                Login with Keycloak
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
