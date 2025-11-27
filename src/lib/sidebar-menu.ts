import type { SidebarMenuItem } from "@/types/sidebar"

export const sidebarMenu: SidebarMenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "customers", label: "Customers", icon: "👥" },
  { id: "orders", label: "Orders", icon: "🧾" },
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
  {
    id: "organize",
    label: "Sale Organize",
    icon: "🧩",
    children: [
      {
        id: "organize-supervisor",
        label: "Supervisor & Sale-Rep",
        href: "/organize",
      },
      {
        id: "organize-chart",
        label: "Organize Chart",
        href: "/organize/chart",
      },
      {
        id: "organize-permission",
        label: "จัดการสิทธิ (Permissions)",
      },
    ],
  },
  { id: "reports", label: "รายงาน", icon: "📈" },
  { id: "settings", label: "ตั้งค่า", icon: "⚙️" },
]
