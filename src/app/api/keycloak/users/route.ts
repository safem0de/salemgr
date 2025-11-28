"use server"

import { NextResponse } from "next/server"
import KeycloakAdminClient from "@keycloak/keycloak-admin-client"

async function getClient() {
  const { KEYCLOAK_BASE_URL, KEYCLOAK_REALM, KEYCLOAK_ADMIN_CLIENT_ID, KEYCLOAK_ADMIN_CLIENT_SECRET } = process.env

  if (!KEYCLOAK_BASE_URL || !KEYCLOAK_REALM || !KEYCLOAK_ADMIN_CLIENT_ID || !KEYCLOAK_ADMIN_CLIENT_SECRET) {
    throw new Error("Missing Keycloak ENV")
  }

  const client = new KeycloakAdminClient({
    baseUrl: KEYCLOAK_BASE_URL,
    realmName: KEYCLOAK_REALM,
  })

  await client.auth({
    grantType: "client_credentials",
    clientId: KEYCLOAK_ADMIN_CLIENT_ID,
    clientSecret: KEYCLOAK_ADMIN_CLIENT_SECRET,
  })

  return client
}

export async function GET() {
  try {
    const client = await getClient()
    const users = await client.users.find()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users", error)
    return NextResponse.json({ error: "Failed to connect Keycloak" }, { status: 500 })
  }
}
