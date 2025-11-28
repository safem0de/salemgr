"use client"

import { useEffect, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ProtectedShell, SessionLoading } from "@/components/session-loading"
import { LoginCallout } from "@/components/login-callout"
import { sidebarMenu } from "@/lib/sidebar-menu"

type KeycloakUser = {
  id: string
  username: string
  firstName?: string
  lastName?: string
  email?: string
  enabled?: boolean
}

export default function CustomersPage() {
  const { data: session, status } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [users, setUsers] = useState<KeycloakUser[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      loadUsers()
    }
  }, [status])

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true)
      setUsersError(null)
      const response = await fetch("/api/keycloak/users")
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load users")
      }
      setUsers(data.users ?? [])
    } catch (error) {
      setUsers([])
      setUsersError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsLoadingUsers(false)
    }
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
          <ProtectedShell
            isLoading={status === "loading"}
            isAuthenticated={Boolean(session)}
            loadingView={<SessionLoading />}
            unauthenticatedView={
              <LoginCallout
                title="เข้าสู่ระบบเพื่อดูรายชื่อผู้ใช้"
                description="ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถดูข้อมูลผู้ใช้ได้"
              />
            }
          >
            <section className="space-y-6">
              <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase text-slate-500">Users</p>
                  <h1 className="text-3xl font-semibold text-slate-900">Keycloak Users</h1>
                  <p className="text-slate-600">
                    รายชื่อผู้ใช้ที่ดึงมาจาก Keycloak เพื่อใช้ตรวจสอบหรือเชื่อมโยงข้อมูลในระบบ
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    onClick={loadUsers}
                    disabled={isLoadingUsers}
                  >
                    {isLoadingUsers ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </header>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-3 text-sm font-semibold text-slate-600">Users</div>
                <div className="p-6">
                  {usersError && <p className="text-sm text-rose-600">{usersError}</p>}
                  {!usersError && (
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="text-left text-slate-500">
                          <th className="border-b border-slate-100 px-4 pb-3 font-medium">Name</th>
                          <th className="border-b border-slate-100 px-4 pb-3 font-medium">Username</th>
                          <th className="border-b border-slate-100 px-4 pb-3 font-medium">Email</th>
                          <th className="border-b border-slate-100 px-4 pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                              {isLoadingUsers ? "กำลังโหลดข้อมูล..." : "ไม่มีข้อมูลผู้ใช้"}
                            </td>
                          </tr>
                        )}
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-slate-50 text-slate-700">
                            <td className="px-4 py-3">
                              <p className="font-medium">{`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "-"}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{user.username}</td>
                            <td className="px-4 py-3 text-slate-500">{user.email || "-"}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                  user.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {user.enabled ? "Active" : "Disabled"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>
          </ProtectedShell>
        </main>
      </div>
    </div>
  )
}
