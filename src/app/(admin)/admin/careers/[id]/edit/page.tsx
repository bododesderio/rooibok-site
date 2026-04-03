import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JobForm } from "../../job-form";
type Props = { params: Promise<{ id: string }> };
export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const job = await db.job.findUnique({ where: { id } });
  if (!job) notFound();
  return (<div><h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Job Listing</h1><div className="mt-6"><JobForm job={job} /></div></div>);
}
