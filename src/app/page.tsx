"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div style={{ padding: 20 }}>
      {session ? (
        <>
          <p>สวัสดี 👋 {session.user?.name}</p>
          <p>
            Access Token: <code>{session.accessToken ?? "ไม่มี token"}</code>
          </p>

          <button
            onClick={() => signOut()}
            style={{ marginTop: 10, padding: "8px 16px", background: "red", color: "white" }}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn("keycloak")}
          style={{ padding: "8px 16px", background: "#4D7CFE", color: "white" }}
        >
          Login with Keycloak
        </button>
      )}
    </div>
  )
}
