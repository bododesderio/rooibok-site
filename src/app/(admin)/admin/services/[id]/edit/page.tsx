import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ServiceForm } from "../../service-form";

type Props = { params: Promise<{ id: string }> };
export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id } });
  if (!service) notFound();
  return (<div><h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Service</h1><div className="mt-6"><ServiceForm service={service} /></div></div>);
}
