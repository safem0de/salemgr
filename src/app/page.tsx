"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ProtectedShell, SessionLoading } from "@/components/session-loading"
import { LoginCallout } from "@/components/login-callout"
import { sidebarMenu } from "@/lib/sidebar-menu"

export default function Home() {
  const { data: session, status } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [roles, setRoles] = useState<string[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState<string | null>(null)

  const loadRoles = async () => {
    try {
      setRolesLoading(true)
      setRolesError(null)
      const response = await fetch("/api/keycloak/roles")
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load roles")
      }
      setRoles(data.roles?.map((role: { name: string }) => role.name) ?? [])
    } catch (error) {
      setRoles([])
      setRolesError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setRolesLoading(false)
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
              <LoginCallout description="ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถจัดการข้อมูลจากเมนูด้านซ้ายได้" />
            }
          >
            <div className="space-y-6">
              <div>
                <p className="text-2xl font-semibold text-slate-900">สวัสดี 👋 {session?.user?.name}</p>
                <p className="text-slate-600 mt-1">
                  เข้าสู่ระบบเรียบร้อยแล้ว สามารถเลือกเมนูทางซ้ายเพื่อเริ่มทำงานได้เลย
                </p>
              </div>

              <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Access Token</p>
                  <code className="mt-2 block break-all rounded bg-slate-900/90 px-4 py-3 text-xs text-green-300">
                    {session?.accessToken ?? "ไม่มี token"}
                  </code>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">ทดสอบเชื่อมต่อ Keycloak API (Roles)</p>
                    <button
                      className="rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-100 disabled:opacity-60"
                      onClick={loadRoles}
                      disabled={rolesLoading}
                    >
                      {rolesLoading ? "Loading..." : "Load Roles"}
                    </button>
                  </div>
                  {rolesError && <p className="mt-2 text-sm text-rose-600">{rolesError}</p>}
                  {!rolesError && roles.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {roles.map((role) => (
                        <li key={role}>{role}</li>
                      ))}
                    </ul>
                  )}
                  {!rolesError && !roles.length && !rolesLoading && (
                    <p className="mt-3 text-sm text-slate-500">ยังไม่ได้ดึงข้อมูล roles</p>
                  )}
                </div>
              </div>
            </div>
          </ProtectedShell>
        </main>
      </div>
    </div>
  )
}
