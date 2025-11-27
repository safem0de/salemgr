"use client"

import "react-big-calendar/lib/css/react-big-calendar.css"

import { useMemo, useState } from "react"
import { Calendar, type Components, View, dateFnsLocalizer } from "react-big-calendar"
import {
  format,
  parse,
  startOfWeek as startOfWeekFn,
  endOfWeek,
  getDay,
  addDays,
  addHours,
  addMonths,
  startOfMonth,
} from "date-fns"
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
  parse: (dateString: string, formatString: string) => parse(dateString, formatString, new Date(), { locale: th }),
  startOfWeek: (date: Date) => startOfWeekFn(date, { locale: th }),
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

type PlannerToolbarProps = {
  label: string
  currentDate: Date
  currentView: View
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
  onViewChange: (view: View) => void
  onJumpToDate: (date: Date) => void
}

function PlannerToolbar({ label, onNavigate, onViewChange, currentDate, onJumpToDate, currentView }: Readonly<PlannerToolbarProps>) {
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
              const newDate = parse(event.target.value, "yyyy-MM", new Date())
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

const hiddenToolbar = () => null

function getViewLabel(currentDate: Date, view: View) {
  if (view === "month") {
    return format(currentDate, "MMMM yyyy", { locale: th })
  }
  if (view === "week" || view === "agenda") {
    const start = startOfWeekFn(currentDate, { locale: th })
    const end = endOfWeek(currentDate, { locale: th })
    return `${format(start, "d MMM", { locale: th })} - ${format(end, "d MMM yyyy", { locale: th })}`
  }
  return format(currentDate, "EEE d MMM yyyy", { locale: th })
}

export default function PlannerCalendarPage() {
  const { data: session } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [view, setView] = useState<View>("month")
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [label, setLabel] = useState(() => getViewLabel(new Date(), "month"))

  const handleToolbarNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    setCurrentDate((prev) => {
      let nextDate: Date

      if (action === "TODAY") {
        nextDate = new Date()
      } else if (view === "month") {
        nextDate = addMonths(prev, action === "NEXT" ? 1 : -1)
      } else {
        const deltaDays = view === "week" || view === "agenda" ? 7 : 1
        nextDate = addDays(prev, action === "NEXT" ? deltaDays : -deltaDays)
      }

      setLabel(getViewLabel(nextDate, view))
      return nextDate
    })
  }

  const handleJumpToDate = (date: Date) => {
    setCurrentDate(date)
    setLabel(getViewLabel(date, view))
  }

  const plannerEvents: PlannerEvent[] = useMemo(() => {
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

  const calendarComponents = useMemo<Components<PlannerEvent>>(
    () => ({
      toolbar: hiddenToolbar,
    }),
    []
  )

  const updateLabel = (date: Date, nextView: View) => {
    setLabel(getViewLabel(date, nextView))
  }

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
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <PlannerToolbar
                label={label}
                currentDate={currentDate}
                currentView={view}
                onNavigate={(action) => {
                  handleToolbarNavigate(action)
                }}
                onViewChange={(nextView) => {
                  setView(nextView)
                  updateLabel(currentDate, nextView)
                }}
                onJumpToDate={(date) => {
                  handleJumpToDate(date)
                  updateLabel(date, view)
                }}
              />
              <Calendar
                date={currentDate}
                onNavigate={(newDate) => {
                  setCurrentDate(newDate)
                  updateLabel(newDate, view)
                }}
                view={view}
                onView={(next) => {
                  setView(next)
                  updateLabel(currentDate, next)
                }}
                localizer={localizer}
                culture="th"
                events={plannerEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ minHeight: 650 }}
                popup
                selectable
                toolbar={false}
                components={calendarComponents}
                longPressThreshold={50}
                eventPropGetter={(event: PlannerEvent) => ({
                  className: `border ${event.color} rounded-md px-2`,
                })}
                formats={{
                  agendaDateFormat: (date: Date) => format(date, "EEE d MMM", { locale: th }),
                  dayHeaderFormat: (date: Date) => format(date, "EEE d MMM", { locale: th }),
                  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
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
