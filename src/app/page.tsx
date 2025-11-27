"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

const sidebarMenu = [
  { id: "dashboard", label: "แดชบอร์ด", icon: "📊" },
  { id: "customers", label: "ลูกค้า", icon: "👥" },
  { id: "orders", label: "คำสั่งซื้อ", icon: "🧾" },
  { id: "reports", label: "รายงาน", icon: "📈" },
  { id: "settings", label: "ตั้งค่า", icon: "⚙️" },
]

export default function Home() {
  const { data: session } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle sidebar"
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            {isSidebarCollapsed ? "☰" : "⟡"}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xl">
              SM
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Sale Manager</p>
              <p className="text-sm text-slate-500">Backoffice Control Panel</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{session.user?.name}</p>
                <p className="text-xs text-slate-500">{session.user?.email ?? "ไม่มีอีเมล"}</p>
              </div>
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500"
              onClick={() => signIn("keycloak")}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`${
            isSidebarCollapsed ? "w-20" : "w-64"
          } bg-slate-900 text-white flex flex-col transition-all duration-200 ease-in-out`}
        >
          <div className="px-6 py-5 border-b border-slate-800 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span className={isSidebarCollapsed ? "sr-only" : ""}>เมนูหลัก</span>
          </div>
          <ul className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {sidebarMenu.map((item) => (
              <li key={item.id}>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-100 hover:bg-slate-800">
                  <span aria-hidden className="text-lg">{item.icon}</span>
                  <span className={isSidebarCollapsed ? "hidden" : "block"}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-6 py-5 border-t border-slate-800 text-sm text-slate-300">
            <span className={isSidebarCollapsed ? "hidden" : "inline"}>
              {session ? "พร้อมใช้งาน" : "กรุณาเข้าสู่ระบบ"}
            </span>
            {isSidebarCollapsed && <span className="font-semibold text-green-300">{session ? "✓" : "!"}</span>}
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {session ? (
            <div className="space-y-6">
              <div>
                <p className="text-2xl font-semibold text-slate-900">สวัสดี 👋 {session.user?.name}</p>
                <p className="text-slate-600 mt-1">
                  เข้าสู่ระบบเรียบร้อยแล้ว สามารถเลือกเมนูทางซ้ายเพื่อเริ่มทำงานได้เลย
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Access Token</p>
                <code className="mt-2 block break-all rounded bg-slate-900/90 px-4 py-3 text-xs text-green-300">
                  {session.accessToken ?? "ไม่มี token"}
                </code>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-3xl font-semibold text-slate-900">เข้าสู่ระบบเพื่อใช้งาน Sale Manager</p>
              <p className="mt-3 text-slate-600 max-w-lg">
                ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถจัดการข้อมูลจากเมนูด้านซ้ายได้
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
