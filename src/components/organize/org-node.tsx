"use client"

import Image from "next/image"
import { useState } from "react"
import { Handle, Position, type NodeTypes } from "reactflow"

const DEFAULT_AVATAR = "/avatars/default.png"

export type OrgNodeData = {
  label: string
  avatar?: string
}

export function OrgNode({ data }: Readonly<{ data: OrgNodeData }>) {
  const [src, setSrc] = useState(data.avatar ?? DEFAULT_AVATAR)

  return (
    <div className="relative flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Handle type="target" position={Position.Top} className="h-1.5! w-1.5! bg-blue-400!" />
      <Image
        src={src}
        alt={data.label}
        width={56}
        height={56}
        onError={() => setSrc(DEFAULT_AVATAR)}
        className="h-14 w-14 rounded-full border-2 border-white shadow object-cover"
      />
      <span className="text-sm font-semibold text-slate-900">{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="h-1.5! w-1.5! bg-blue-400!" />
    </div>
  )
}

export const nodeTypes: NodeTypes = {
  default: OrgNode,
}
