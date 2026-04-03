import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "../../project-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Project</h1>
      <div className="mt-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
