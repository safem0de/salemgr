"use client"

import { useMemo, useState } from "react"
import ReactFlow, { Background, Controls, Edge, Node, Position, ReactFlowProvider, Handle, type NodeTypes } from "reactflow"
import "reactflow/dist/style.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { sidebarMenu } from "@/lib/sidebar-menu"
import { organizeMock } from "@/mocks/organize"

type NodeData = {
  label: string
  avatar?: string
}

const DEFAULT_AVATAR = "/avatars/default.png"
const teamOptions = ["ทั้งหมด", ...new Set(organizeMock.representatives.map((rep) => rep.region))]

const OrgNode = ({ data }: { data: NodeData }) => (
  <div className="relative flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
    <Handle type="target" position={Position.Top} className="!h-1.5 !w-1.5 !bg-blue-400" />
    <img src={data.avatar ?? DEFAULT_AVATAR} alt={data.label} className="h-10 w-10 rounded-full border border-white shadow object-cover" />
    <span className="text-sm font-semibold text-slate-900">{data.label}</span>
    <Handle type="source" position={Position.Bottom} className="!h-1.5 !w-1.5 !bg-blue-400" />
  </div>
)

const nodeTypes: NodeTypes = { default: OrgNode }

export default function OrganizeChartPage() {
  const { data: session } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string>(teamOptions[0])

  const { nodes, edges } = useMemo(() => {
    const reps = organizeMock.representatives.filter((rep) => selectedTeam === "ทั้งหมด" || rep.region === selectedTeam)
    const supervisors = organizeMock.supervisors.filter(
      (sup) => selectedTeam === "ทั้งหมด" || sup.region === selectedTeam
    )

    const supervisorNodes: Node<NodeData>[] = supervisors.map((sup, index) => ({
      id: sup.id,
      data: { label: sup.name, avatar: sup.avatar },
      position: { x: 250 + index * 320, y: 60 },
      style: {
        border: "1px solid #cbd5f5",
        background: "#e0edff",
        borderRadius: 8,
        padding: 10,
        fontWeight: 600,
      },
      sourcePosition: Position.Bottom,
    }))

    const repNodes: Node<NodeData>[] = reps.map((rep, index) => ({
      id: rep.id,
      data: { label: rep.name, avatar: rep.avatar },
      position: { x: 150 + index * 220, y: 230 },
      style: {
        border: "1px solid #d1d5db",
        background: "#fff",
        borderRadius: 8,
        padding: 8,
        fontSize: 12,
      },
      targetPosition: Position.Top,
    }))

    const repEdges = reps.reduce<Edge[]>((acc, rep) => {
      const supervisor = organizeMock.supervisors.find((sup) => sup.region === rep.region)
      if (supervisor) {
        acc.push({
          id: `${rep.id}-${supervisor.id}`,
          source: supervisor.id,
          target: rep.id,
          animated: true,
          style: { stroke: "#93c5fd" },
        })
      }
      return acc
    }, [])

    return {
      nodes: [...supervisorNodes, ...repNodes],
      edges: repEdges,
    }
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
                  เลือกทีม / ภูมิภาค
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
