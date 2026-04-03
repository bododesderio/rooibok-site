import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Require an authenticated admin session for server actions.
 * Throws if not authenticated or not an ADMIN.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  return session;
}

/**
 * Require an authenticated session (ADMIN or EDITOR).
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  return session;
}
