"use client"

import { useMemo, useState } from "react"
import ReactFlow, { Background, Controls, ReactFlowProvider } from "reactflow"
import "reactflow/dist/style.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { sidebarMenu } from "@/lib/sidebar-menu"
import { nodeTypes } from "@/components/organize/org-node"
import { buildOrganizeGraph, teamOptions } from "@/services/organize-graph"

export default function OrganizeChartPage() {
  const { data: session } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string>(teamOptions[0])

  const { nodes, edges } = useMemo(() => {
    return buildOrganizeGraph(selectedTeam)
  }, [selectedTeam])

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
          {session ? (
            <section className="space-y-6">
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900">Team Organize Chart</h1>
                  <p className="text-slate-600">
                    ภาพรวมโครงสร้างทีมในแต่ละภูมิภาค แสดงความเชื่อมโยงระหว่าง Supervisor และ Sale Representative
                  </p>
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                  <span>เลือกทีม / ภูมิภาค</span>
                  <select
                    value={selectedTeam}
                    onChange={(event) => setSelectedTeam(event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {teamOptions.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </label>
              </header>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-[600px]">
                <ReactFlowProvider>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={false}
                    zoomOnScroll={false}
                  >
                    <Background gap={24} />
                    <Controls />
                  </ReactFlow>
                </ReactFlowProvider>
              </div>
            </section>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-3xl font-semibold text-slate-900">เข้าสู่ระบบเพื่อดู Organize Chart</p>
              <p className="mt-3 text-slate-600 max-w-lg">
                ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถดูความสัมพันธ์ของ Supervisor และ Sale Rep
                ได้
              </p>
              <button
                className="mt-8 rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-blue-500"
                onClick={() => signIn("keycloak")}
              >
                Login with Keycloak
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
