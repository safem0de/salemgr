"use client"

import { useMemo, useState } from "react"
import ReactFlow, { Background, Controls, Edge, Node, Position } from "reactflow"
import "reactflow/dist/style.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { sidebarMenu } from "@/lib/sidebar-menu"
import { organizeMock } from "@/mocks/organize"

export default function OrganizeChartPage() {
  const { data: session } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const { nodes, edges } = useMemo(() => {
    const supervisorNodes: Node[] = organizeMock.supervisors.map((sup, index) => ({
      id: sup.id,
      data: { label: sup.name },
      position: { x: 150 + index * 300, y: 50 },
      style: {
        border: "1px solid #cbd5f5",
        background: "#e0edff",
        borderRadius: 8,
        padding: 10,
        fontWeight: 600,
      },
      sourcePosition: Position.Bottom,
    }))

    const repNodes: Node[] = organizeMock.representatives.map((rep, index) => ({
      id: rep.id,
      data: { label: rep.name },
      position: { x: 80 + index * 200, y: 200 },
      style: {
        border: "1px solid #d1d5db",
        background: "#fff",
        borderRadius: 8,
        padding: 8,
        fontSize: 12,
      },
      targetPosition: Position.Top,
    }))

    const repEdges: Edge[] = organizeMock.representatives.map((rep) => {
      const supervisor = organizeMock.supervisors.find((sup) => sup.region === rep.region)
      return {
        id: `${rep.id}-${supervisor?.id ?? "unknown"}`,
        source: supervisor?.id ?? "",
        target: rep.id,
        animated: true,
        style: { stroke: "#93c5fd" },
      }
    })

    return {
      nodes: [...supervisorNodes, ...repNodes],
      edges: repEdges,
    }
  }, [])

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
              <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold text-slate-900">Team Organize Chart</h1>
                <p className="text-slate-600">
                  ภาพรวมโครงสร้างทีมในแต่ละภูมิภาค แสดงความเชื่อมโยงระหว่าง Supervisor และ Sale Representative
                </p>
              </header>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-[600px]">
                <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={false} nodesConnectable={false} zoomOnScroll={false}>
                  <Background gap={24} />
                  <Controls />
                </ReactFlow>
              </div>
            </section>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-3xl font-semibold text-slate-900">เข้าสู่ระบบเพื่อดู Organize Chart</p>
              <p className="mt-3 text-slate-600 max-w-lg">
                ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถดูความสัมพันธ์ของ Supervisor และ Sale
                Rep ได้
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
