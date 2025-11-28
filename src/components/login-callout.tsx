"use client"

import { signIn } from "next-auth/react"

type LoginCalloutProps = {
  title?: string
  description?: string
  buttonLabel?: string
  provider?: string
}

export function LoginCallout({
  title = "เข้าสู่ระบบเพื่อใช้งาน Sale Manager",
  description = "ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถใช้งานโมดูลต่าง ๆ ได้",
  buttonLabel = "Login with Keycloak",
  provider = "keycloak",
}: Readonly<LoginCalloutProps>) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="text-3xl font-semibold text-slate-900">{title}</p>
      <p className="mt-3 text-slate-600 max-w-lg">{description}</p>
      <button
        className="mt-8 rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-blue-500"
        onClick={() => signIn(provider)}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
