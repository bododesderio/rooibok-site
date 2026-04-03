import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">New Project</h1>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
