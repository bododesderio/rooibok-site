import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { TeamForm } from "../../team-form";
type Props = { params: Promise<{ id: string }> };
export default async function EditTeamMemberPage({ params }: Props) {
  const { id } = await params;
  const member = await db.teamMember.findUnique({ where: { id } });
  if (!member) notFound();
  return (<div><h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Team Member</h1><div className="mt-6"><TeamForm member={member} /></div></div>);
}
