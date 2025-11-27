export type SidebarMenuItem = {
  id: string
  label: string
  icon: string
  children?: { id: string; label: string; href?: string }[]
}
