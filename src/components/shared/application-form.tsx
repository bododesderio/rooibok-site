"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/lib/validations/application";
import { submitApplication } from "@/server/actions/applications";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type Props = {
  jobId: string;
  jobTitle: string;
};

const ALLOWED_RESUME_TYPES = ".pdf,.doc,.docx";
const MAX_RESUME_MB = 5;

export function ApplicationForm({ jobId, jobTitle }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setResumeError(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_RESUME_MB * 1024 * 1024) {
      setResumeError(`File too large (max ${MAX_RESUME_MB}MB)`);
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  }

  async function onSubmit(data: ApplicationFormData) {
    setServerError(null);
    setResumeError(null);

    if (!resumeFile) {
      setResumeError("Resume is required");
      return;
    }

    const formData = new FormData();
    formData.set("fullName", data.fullName);
    formData.set("email", data.email);
    formData.set("phone", data.phone);
    formData.set("coverLetter", data.coverLetter ?? "");
    formData.set("portfolioUrl", data.portfolioUrl ?? "");
    formData.set("linkedinUrl", data.linkedinUrl ?? "");
    formData.set("referralSource", data.referralSource ?? "");
    formData.set("honeypot", data.honeypot ?? "");
    formData.set("resume", resumeFile);

    try {
      const result = await submitApplication(jobId, formData);
      if (!result.success) {
        setServerError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
          Application Received
        </h3>
        <p className="mt-2 max-w-md text-sm text-[var(--foreground-muted)]">
          Thanks for applying to <strong>{jobTitle}</strong>. We&apos;ll review your
          application and get back to you soon.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]/50 transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";
  const labelCls = "mb-1.5 block text-sm font-medium text-[var(--foreground)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      {/* Honeypot */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelCls}>
            Full Name <span className="text-[var(--accent)]">*</span>
          </label>
          <input id="fullName" type="text" placeholder="Jane Doe" className={inputCls} {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email <span className="text-[var(--accent)]">*</span>
          </label>
          <input id="email" type="email" placeholder="jane@example.com" className={inputCls} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelCls}>
          Phone <span className="text-[var(--accent)]">*</span>
        </label>
        <input id="phone" type="tel" placeholder="+256 700 000 000" className={inputCls} {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="resume" className={labelCls}>
          Resume <span className="text-[var(--accent)]">*</span>{" "}
          <span className="text-xs text-[var(--foreground-muted)]">(PDF, DOC, DOCX — max {MAX_RESUME_MB}MB)</span>
        </label>
        <input
          id="resume"
          type="file"
          accept={ALLOWED_RESUME_TYPES}
          onChange={handleResumeChange}
          className="block w-full text-sm text-[var(--foreground)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--accent-foreground)] hover:file:bg-[var(--accent-hover)]"
        />
        {resumeFile && (
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
          </p>
        )}
        {resumeError && <p className="mt-1 text-xs text-red-500">{resumeError}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="portfolioUrl" className={labelCls}>
            Portfolio URL <span className="text-xs text-[var(--foreground-muted)]">(optional)</span>
          </label>
          <input id="portfolioUrl" type="url" placeholder="https://" className={inputCls} {...register("portfolioUrl")} />
          {errors.portfolioUrl && <p className="mt-1 text-xs text-red-500">{errors.portfolioUrl.message}</p>}
        </div>
        <div>
          <label htmlFor="linkedinUrl" className={labelCls}>
            LinkedIn <span className="text-xs text-[var(--foreground-muted)]">(optional)</span>
          </label>
          <input id="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." className={inputCls} {...register("linkedinUrl")} />
          {errors.linkedinUrl && <p className="mt-1 text-xs text-red-500">{errors.linkedinUrl.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="referralSource" className={labelCls}>
          How did you hear about us? <span className="text-xs text-[var(--foreground-muted)]">(optional)</span>
        </label>
        <input id="referralSource" type="text" className={inputCls} {...register("referralSource")} />
      </div>

      <div>
        <label htmlFor="coverLetter" className={labelCls}>
          Cover Letter <span className="text-xs text-[var(--foreground-muted)]">(optional)</span>
        </label>
        <textarea
          id="coverLetter"
          rows={6}
          placeholder="Tell us why you're a great fit..."
          className={`${inputCls} resize-y`}
          {...register("coverLetter")}
        />
        {errors.coverLetter && <p className="mt-1 text-xs text-red-500">{errors.coverLetter.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-[var(--accent)]/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}
