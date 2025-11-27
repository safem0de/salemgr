"use client"

import Image from "next/image"
import { Handle, Position, type NodeTypes } from "reactflow"

const DEFAULT_AVATAR = "/avatars/default.png"

export type OrgNodeData = {
  label: string
  avatar?: string
}

export function OrgNode({ data }: Readonly<{ data: OrgNodeData }>) {
  return (
    <div className="relative flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <Handle type="target" position={Position.Top} className="h-1.5! w-1.5! bg-blue-400!" />
      <Image
        src={data.avatar ?? DEFAULT_AVATAR}
        alt={data.label}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full border border-white shadow object-cover"
      />
      <span className="text-sm font-semibold text-slate-900">{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="h-1.5! w-1.5! bg-blue-400!" />
    </div>
  )
}

export const nodeTypes: NodeTypes = {
  default: OrgNode,
}
