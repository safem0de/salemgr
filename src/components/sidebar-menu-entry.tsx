"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import type { SidebarMenuItem } from "@/types/sidebar"

type SidebarMenuEntryProps = {
  item: SidebarMenuItem
  isCollapsed: boolean
}

export function SidebarMenuEntry({ item, isCollapsed }: Readonly<SidebarMenuEntryProps>) {
  const pathname = usePathname()
  const hasChildren = Boolean(item.children?.length)
  const isActiveGroup = hasChildren && item.children!.some((child) => child.href === pathname)
  const [isManuallyOpen, setIsManuallyOpen] = useState(false)
  const isOpen = isActiveGroup || isManuallyOpen

  const handleClick = () => {
    if (hasChildren && !isCollapsed && !isActiveGroup) {
      setIsManuallyOpen((prev) => !prev)
    }
  }

  return (
    <li>
      <button
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-100 hover:bg-slate-800"
        onClick={handleClick}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <span aria-hidden className="text-lg">{item.icon}</span>
        <span className={isCollapsed ? "hidden" : "block"}>{item.label}</span>
        {hasChildren && !isCollapsed && (
          <span className="ml-auto text-xs text-slate-300">{isOpen ? "▾" : "▸"}</span>
        )}
      </button>
      {hasChildren && isOpen && !isCollapsed && (
        <ul className="mt-2 space-y-2 pl-10">
          {item.children!.map((child) => {
            const isActive = child.href ? pathname === child.href : false

            if (child.href) {
              return (
                <li key={child.id}>
                  <Link
                    href={child.href}
                    className={`block rounded px-3 py-2 text-xs font-medium ${
                      isActive ? "bg-blue-600 text-white" : "text-slate-200 hover:text-white"
                    }`}
                  >
                    {child.label}
                  </Link>
                </li>
              )
            }

            return (
              <li key={child.id}>
                <button className="w-full text-left rounded px-3 py-2 text-xs font-medium text-slate-200 hover:text-white">
                  {child.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
