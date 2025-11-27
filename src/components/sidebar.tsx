"use client"

type MenuItem = {
  id: string
  label: string
  icon: string
}

type SidebarProps = {
  items: MenuItem[]
  isCollapsed: boolean
  hasSession: boolean
}

export function Sidebar({ items, isCollapsed, hasSession }: Readonly<SidebarProps>) {
  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-slate-900 text-white flex flex-col transition-all duration-200 ease-in-out`}
    >
      <div className="px-6 py-5 border-b border-slate-800 text-xs uppercase tracking-[0.2em] text-slate-400">
        <span className={isCollapsed ? "sr-only" : ""}>เมนูหลัก</span>
      </div>
      <ul className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id}>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-100 hover:bg-slate-800">
              <span aria-hidden className="text-lg">
                {item.icon}
              </span>
              <span className={isCollapsed ? "hidden" : "block"}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="px-6 py-5 border-t border-slate-800 text-sm text-slate-300">
        <span className={isCollapsed ? "hidden" : "inline"}>
          {hasSession ? "พร้อมใช้งาน" : "กรุณาเข้าสู่ระบบ"}
        </span>
        {isCollapsed && <span className="font-semibold text-green-300">{hasSession ? "✓" : "!"}</span>}
      </div>
    </aside>
  )
}
