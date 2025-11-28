"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ProtectedShell, SessionLoading } from "@/components/session-loading"
import { LoginCallout } from "@/components/login-callout"
import { sidebarMenu } from "@/lib/sidebar-menu"
import { organizeMock, permissionMatrix } from "@/mocks/organize"

export default function SaleOrganizePage() {
  const { data: session, status } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<"supervisor" | "representative">("supervisor")

  const showList = activeTab === "supervisor" ? organizeMock.supervisors : organizeMock.representatives

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
          <ProtectedShell
            isLoading={status === "loading"}
            isAuthenticated={Boolean(session)}
            loadingView={<SessionLoading />}
            unauthenticatedView={
              <LoginCallout
                title="เข้าสู่ระบบเพื่อจัดการ Sale Organize"
                description="ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถบริหาร Supervisor และ Sale Rep ได้"
              />
            }
          >
            <section className="space-y-6">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900">Sale Organize</h1>
                  <p className="text-slate-600">จัดการผู้ใช้งาน แบ่งทีม และกำหนดสิทธิพิเศษสำหรับ Supervisor และ Sale Rep</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                    ตั้งค่ากฎสิทธิ์
                  </button>
                  <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500">
                    + เพิ่มสมาชิก
                  </button>
                </div>
              </header>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <nav className="flex">
                  <button
                    className={`flex-1 border-b px-4 py-3 text-sm font-semibold ${
                      activeTab === "supervisor" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500"
                    }`}
                    onClick={() => setActiveTab("supervisor")}
                  >
                    Supervisor ({organizeMock.supervisors.length})
                  </button>
                  <button
                    className={`flex-1 border-b px-4 py-3 text-sm font-semibold ${
                      activeTab === "representative" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500"
                    }`}
                    onClick={() => setActiveTab("representative")}
                  >
                    Sale Representatives ({organizeMock.representatives.length})
                  </button>
                </nav>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <input
                      className="w-full max-w-xs rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="ค้นหาชื่อหรืออีเมล..."
                    />
                    <div className="flex gap-2">
                      <select className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>ทุกภูมิภาค</option>
                        <option>North</option>
                        <option>Central</option>
                      </select>
                      <select className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>สถานะทั้งหมด</option>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>

                  <table className="mt-6 w-full border-collapse text-sm">
                    <thead>
                      <tr className="text-left text-slate-500">
                        <th className="border-b border-slate-100 px-4 pb-3 font-medium">ชื่อ</th>
                        <th className="border-b border-slate-100 px-4 pb-3 font-medium">อีเมล</th>
                        <th className="border-b border-slate-100 px-4 pb-3 font-medium">พื้นที่</th>
                        <th className="border-b border-slate-100 px-4 pb-3 font-medium">ทีม</th>
                        <th className="border-b border-slate-100 px-4 pb-3 font-medium">สถานะ</th>
                        <th className="border-b border-slate-100 px-4 pb-3 font-medium text-right">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showList.map((member) => (
                        <tr key={member.id} className="border-b border-slate-50 text-slate-700">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.role}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{member.email}</td>
                          <td className="px-4 py-3">{member.region}</td>
                          <td className="px-4 py-3 text-slate-500">{member.teams.join(", ")}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                member.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {member.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2 text-xs">
                              <button className="rounded border border-slate-200 px-3 py-1 text-slate-600 hover:border-blue-500 hover:text-blue-600">
                                ปรับสิทธิ์
                              </button>
                              <button className="rounded border border-slate-200 px-3 py-1 text-slate-600 hover:border-blue-500 hover:text-blue-600">
                                แก้ไข
                              </button>
                              <button className="rounded border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50">พักใช้งาน</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">สิทธิ์การเข้าถึง (Permission Matrix)</h2>
                <p className="text-sm text-slate-500">
                  กำหนดสิทธิ์ให้ Supervisor และ Sale Rep สามารถใช้งานโมดูลต่าง ๆ ตามที่กำหนดได้
                </p>
                <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">โมดูล</th>
                        <th className="px-4 py-3 font-medium">Supervisor</th>
                        <th className="px-4 py-3 font-medium">Sale Representative</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionMatrix.map((row) => (
                        <tr key={row.module} className="border-t border-slate-100">
                          <td className="px-4 py-3 font-medium text-slate-700">{row.module}</td>
                          <td className="px-4 py-3 text-slate-600">{row.supervisor}</td>
                          <td className="px-4 py-3 text-slate-600">{row.representative}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </ProtectedShell>
        </main>
      </div>
    </div>
  )
}
