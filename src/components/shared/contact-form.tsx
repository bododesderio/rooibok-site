"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { submitInquiry } from "@/server/actions/inquiries";
import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type ServiceOption = {
  value: string;
  label: string;
};

type ContactFormProps = {
  services: ServiceOption[];
  successMessage: string;
};

const BUDGET_RANGES = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $15,000",
  "$15,000 - $50,000",
  "$50,000+",
];

export function ContactForm({ services, successMessage }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setServerError(null);

    try {
      const formData = new FormData();
      formData.set("fullName", data.fullName);
      formData.set("email", data.email);
      formData.set("phone", data.phone ?? "");
      formData.set("service", data.service ?? "");
      formData.set("budget", data.budget ?? "");
      formData.set("message", data.message);
      formData.set("honeypot", data.honeypot ?? "");

      const result = await submitInquiry(formData);

      if (!result.success) {
        setServerError("Something went wrong. Please try again.");
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
          Message Sent!
        </h3>
        <p className="mt-2 max-w-md text-sm text-[var(--foreground-muted)]">
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      {/* Honeypot - visually hidden */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      {/* Full Name & Email */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Full Name <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="John Doe"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]/50 transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Email <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="john@example.com"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]/50 transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone & Service */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Phone <span className="text-xs text-[var(--foreground-muted)]">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="+256 700 000 000"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]/50 transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            {...register("phone")}
          />
        </div>

        <div>
          <label
            htmlFor="service"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Service{" "}
            <span className="text-xs text-[var(--foreground-muted)]">(optional)</span>
          </label>
          <select
            id="service"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            defaultValue=""
            {...register("service")}
          >
            <option value="" disabled>
              Select a service...
            </option>
            {services.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget */}
      <div>
        <label
          htmlFor="budget"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Budget Range{" "}
          <span className="text-xs text-[var(--foreground-muted)]">(optional)</span>
        </label>
        <select
          id="budget"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          defaultValue=""
          {...register("budget")}
        >
          <option value="" disabled>
            Select a budget range...
          </option>
          {BUDGET_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Message <span className="text-[var(--accent)]">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your project..."
          className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--input)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]/50 transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-[var(--accent)]/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
