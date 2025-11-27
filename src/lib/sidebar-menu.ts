import type { SidebarMenuItem } from "@/types/sidebar"

export const sidebarMenu: SidebarMenuItem[] = [
  { id: "dashboard", label: "แดชบอร์ด", icon: "📊" },
  { id: "customers", label: "ลูกค้า", icon: "👥" },
  { id: "orders", label: "คำสั่งซื้อ", icon: "🧾" },
  {
    id: "planner",
    label: "Sale Planner",
    icon: "🗂️",
    children: [
      {
        id: "planner-view",
        label: "ดูแผน (Calendar)",
        href: "/planner",
      },
      {
        id: "planner-create",
        label: "สร้างแผน (Create)",
        href: "/planner/create"
      },
      {
        id: "planner-edit",
        label: "แก้ไขแผน (Edit)"
      },
    ],
  },
  { id: "reports", label: "รายงาน", icon: "📈" },
  { id: "settings", label: "ตั้งค่า", icon: "⚙️" },
]
