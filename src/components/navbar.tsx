"use client"

import type { Session } from "next-auth"

type NavbarProps = {
  session: Session | null
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
  onLogin: () => void
  onLogout: () => void
}

export function Navbar({
  session,
  isSidebarCollapsed,
  onToggleSidebar,
  onLogin,
  onLogout,
}: Readonly<NavbarProps>) {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle sidebar"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onClick={onToggleSidebar}
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
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500"
            onClick={onLogin}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  )
}
