import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json([], { status: 401 });
  }

  const blocks = await db.contentBlock.findMany({
    orderBy: [{ key: "asc" }],
  });

  return NextResponse.json(blocks);
}
