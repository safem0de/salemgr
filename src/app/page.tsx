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

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Access Token</p>
                <code className="mt-2 block break-all rounded bg-slate-900/90 px-4 py-3 text-xs text-green-300">
                  {session?.accessToken ?? "ไม่มี token"}
                </code>
              </div>
            </div>
          </ProtectedShell>
        </main>
      </div>
    </div>
  )
}
