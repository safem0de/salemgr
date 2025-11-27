export type Member = {
  id: string
  name: string
  email: string
  role: "Supervisor" | "Sale Representative"
  region: string
  teams: string[]
  active: boolean
}

export const organizeMock = {
  supervisors: [
    {
      id: "sup-01",
      name: "สุภาพร วิริยะ",
      email: "supaporn@company.com",
      role: "Supervisor",
      region: "North",
      teams: ["Team A", "Team B"],
      active: true,
    },
    {
      id: "sup-02",
      name: "นฤมล ชื่นภพ",
      email: "narumol@company.com",
      role: "Supervisor",
      region: "Central",
      teams: ["Team C"],
      active: true,
    },
  ] satisfies Member[],
  representatives: [
    {
      id: "rep-01",
      name: "กิตติพงษ์ สวัสดี",
      email: "kittipong@company.com",
      role: "Sale Representative",
      region: "North",
      teams: ["Team A"],
      active: true,
    },
    {
      id: "rep-02",
      name: "ศิรินาถ เตชะ",
      email: "sirinart@company.com",
      role: "Sale Representative",
      region: "North",
      teams: ["Team A"],
      active: false,
    },
    {
      id: "rep-03",
      name: "ทวีป บุณยศ",
      email: "thaweep@company.com",
      role: "Sale Representative",
      region: "Central",
      teams: ["Team C"],
      active: true,
    },
  ] satisfies Member[],
}

export type PermissionMatrixRow = {
  module: string
  supervisor: string
  representative: string
}

export const permissionMatrix: PermissionMatrixRow[] = [
  { module: "Sale Planner", supervisor: "Full Access", representative: "View & Update" },
  { module: "Customer Data", supervisor: "Full Access", representative: "View Only" },
  { module: "Sale Organize", supervisor: "Full Access", representative: "No Access" },
  { module: "Reports & Insights", supervisor: "Full Access", representative: "Dashboard" },
]
