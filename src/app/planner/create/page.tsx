"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { sidebarMenu } from "@/lib/sidebar-menu"

export default function PlannerCreatePage() {
  const { data: session } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
            <div className="space-y-8 max-w-4xl">
              <div>
                <p className="text-3xl font-semibold text-slate-900">สร้างแผนการขายใหม่</p>
                <p className="text-slate-600 mt-2">
                  กรอกรายละเอียดของแผนเพื่อประสานงานกับทีมและกำหนดเป้าหมายที่ชัดเจน
                </p>
              </div>

              <form className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="planName">
                    ชื่อแผน
                  </label>
                  <input
                    id="planName"
                    type="text"
                    placeholder="เช่น แผนกระตุ้นยอด Q2"
                    className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="timeframe">
                      ช่วงเวลา
                    </label>
                    <select
                      id="timeframe"
                      className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Q1 2025</option>
                      <option>Q2 2025</option>
                      <option>Q3 2025</option>
                      <option>Q4 2025</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="target">
                      เป้าหมายยอดขาย
                    </label>
                    <input
                      id="target"
                      type="number"
                      placeholder="เช่น 1,000,000"
                      className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="channels">
                    ช่องทางหลัก
                  </label>
                  <input
                    id="channels"
                    type="text"
                    placeholder="ระบุช่องทาง เช่น ออนไลน์, หน้าร้าน, พาร์ทเนอร์"
                    className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="description">
                    รายละเอียด
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="อธิบายกิจกรรม โปรโมชั่น หรือทรัพยากรที่ต้องใช้"
                    className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    type="button"
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500"
                    type="submit"
                  >
                    บันทึกแผน
                  </button>
                </div>
              </form>

              <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
                <p className="font-semibold">หมายเหตุ</p>
                <p className="mt-1">
                  คุณสามารถกลับมาแก้ไขแผนได้จากเมนู Sale Planner &gt; แก้ไขแผน (Edit) หลังจากบันทึกแล้ว
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-3xl font-semibold text-slate-900">เข้าสู่ระบบเพื่อสร้างแผนการขาย</p>
              <p className="mt-3 text-slate-600 max-w-lg">
                ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถสร้างและจัดการ Sale Planner
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
