"use client"

import type { Edge, Node } from "reactflow"
import { Position } from "reactflow"
import { organizeMock } from "@/mocks/organize"
import type { OrgNodeData } from "@/components/organize/org-node"

export const teamOptions = ["ทั้งหมด", ...new Set(organizeMock.representatives.map((rep) => rep.region))]

export function buildOrganizeGraph(selectedTeam: string) {
  const reps = organizeMock.representatives.filter((rep) => selectedTeam === "ทั้งหมด" || rep.region === selectedTeam)
  const supervisors = organizeMock.supervisors.filter((sup) => selectedTeam === "ทั้งหมด" || sup.region === selectedTeam)

  const supervisorNodes: Node<OrgNodeData>[] = supervisors.map((sup, index) => ({
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

  const repNodes: Node<OrgNodeData>[] = reps.map((rep, index) => ({
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
}
