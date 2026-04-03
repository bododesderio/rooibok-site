import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(null, { status: 401 });
  const settings = await db.siteSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json(settings);
}
