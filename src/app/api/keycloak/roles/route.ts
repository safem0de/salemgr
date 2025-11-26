import { NextResponse } from "next/server";
import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

export async function GET() {
    try {
        const {
            KEYCLOAK_BASE_URL,
            KEYCLOAK_REALM,
            KEYCLOAK_CLIENT_ID,
            KEYCLOAK_CLIENT_SECRET,
        } = process.env;

        if (!KEYCLOAK_BASE_URL || !KEYCLOAK_REALM || !KEYCLOAK_CLIENT_ID || !KEYCLOAK_CLIENT_SECRET) {
            return NextResponse.json({ error: "Missing Keycloak ENV" }, { status: 500 });
        }

        const client = new KeycloakAdminClient({
            baseUrl: KEYCLOAK_BASE_URL,
            realmName: KEYCLOAK_REALM,
        });

        await client.auth({
            grantType: "client_credentials",
            clientId: KEYCLOAK_CLIENT_ID,
            clientSecret: KEYCLOAK_CLIENT_SECRET,
        });

        const roles = await client.roles.find();

        return NextResponse.json({ roles });
    } catch (error) {
        console.error("Error fetching roles", error);
        return NextResponse.json({ error: "Failed to connect Keycloak" }, { status: 500 });
    }
}
