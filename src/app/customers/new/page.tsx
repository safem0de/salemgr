"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { sidebarMenu } from "@/lib/sidebar-menu"

export default function NewCustomerPage() {
  const { data: session } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
            <section className="mx-auto max-w-3xl space-y-8">
              <header>
                <p className="text-sm font-semibold uppercase text-slate-500">Customers</p>
                <h1 className="text-3xl font-semibold text-slate-900">Add New Customer</h1>
                <p className="text-slate-600">กรอกข้อมูลลูกค้าใหม่สำหรับทีมขาย ตรวจสอบข้อมูลก่อนบันทึกทุกครั้ง</p>
              </header>

              <form className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="shopName">
                    ชื่อร้านค้า (Shop Name)
                  </label>
                  <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น ร้านกาแฟ ABC"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="address1">
                      Address 1
                    </label>
                    <input
                      id="address1"
                      name="address1"
                      type="text"
                      className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="บ้านเลขที่ / หมู่บ้าน"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="address2">
                      Address 2
                    </label>
                    <input
                      id="address2"
                      name="address2"
                      type="text"
                      className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="ตำบล / เขต / จังหวัด"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="postcode">
                      Postcode
                    </label>
                    <input
                      id="postcode"
                      name="postcode"
                      type="text"
                      className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="10500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="mobile">
                      เบอร์โทร (Mobile)
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="081-xxx-xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="cusName">
                      ชื่อลูกค้า (Customer Name)
                    </label>
                    <input
                      id="cusName"
                      name="cusName"
                      type="text"
                      className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="ชื่อผู้ติดต่อหลัก"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="interest">
                    ความสนใจ (Interest In)
                  </label>
                  <textarea
                    id="interest"
                    name="interest"
                    rows={3}
                    className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="สินค้าหรือบริการที่ลูกค้าสนใจ"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="objective">
                    วัตถุประสงค์ของการพบ (Objective of meeting)
                  </label>
                  <textarea
                    id="objective"
                    name="objective"
                    rows={3}
                    className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="พูดคุยเพื่อเสนอโปรโมชั่นใหม่ ประเมินความต้องการ ฯลฯ"
                  />
                </div>

                <div className="space-y-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                  <p className="text-sm font-medium text-slate-700">รูปภาพสถานที่ / ใบเสนอราคา</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
                      อัปโหลดรูปภาพ
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-100"
                    >
                      เปิดกล้อง
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button type="button" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    ยกเลิก
                  </button>
                  <button type="submit" className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500">
                    บันทึกลูกค้า
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-3xl font-semibold text-slate-900">เข้าสู่ระบบเพื่อเพิ่มลูกค้าใหม่</p>
              <p className="mt-3 text-slate-600 max-w-lg">
                ระบบจะเชื่อมต่อกับ Keycloak เพื่อยืนยันตัวตน เมื่อเข้าสู่ระบบแล้วคุณจะสามารถบันทึกข้อมูลลูกค้าใหม่ได้
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
