"use client";
import { useState } from "react";
import { createPopup, updatePopup } from "@/server/actions/popups";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import type { PopupType, PopupTrigger, PopupFrequency } from "@prisma/client";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

type Props = {
  popup?: {
    id: string;
    name: string;
    title: string | null;
    content: unknown;
    type: PopupType;
    trigger: PopupTrigger;
    delay: number | null;
    scrollThreshold: number | null;
    pages: string[];
    frequency: PopupFrequency;
    frequencyDays: number | null;
    active: boolean;
    ctaText: string | null;
    ctaLink: string | null;
    order: number;
  };
};

const POPUP_TYPES: PopupType[] = ["BANNER", "MODAL", "SLIDE_IN", "BOTTOM_BAR"];
const POPUP_TRIGGERS: PopupTrigger[] = ["ON_LOAD", "ON_SCROLL", "ON_EXIT_INTENT", "AFTER_DELAY", "ON_CLICK"];
const POPUP_FREQUENCIES: PopupFrequency[] = ["ONCE_PER_SESSION", "ONCE_EVER", "ALWAYS", "EVERY_X_DAYS"];

export function PopupForm({ popup }: Props) {
  const [name, setName] = useState(popup?.name ?? "");
  const [title, setTitle] = useState(popup?.title ?? "");
  const [content, setContent] = useState<unknown>(popup?.content ?? EMPTY_DOC);
  const [type, setType] = useState<PopupType>(popup?.type ?? "MODAL");
  const [trigger, setTrigger] = useState<PopupTrigger>(popup?.trigger ?? "ON_LOAD");
  const [delay, setDelay] = useState(popup?.delay ?? 0);
  const [scrollThreshold, setScrollThreshold] = useState(popup?.scrollThreshold ?? 0);
  const [pages, setPages] = useState(popup?.pages.join(", ") ?? "");
  const [frequency, setFrequency] = useState<PopupFrequency>(popup?.frequency ?? "ONCE_PER_SESSION");
  const [frequencyDays, setFrequencyDays] = useState(popup?.frequencyDays ?? 0);
  const [active, setActive] = useState(popup?.active ?? true);
  const [ctaText, setCtaText] = useState(popup?.ctaText ?? "");
  const [ctaLink, setCtaLink] = useState(popup?.ctaLink ?? "");
  const [order, setOrder] = useState(popup?.order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const data = {
        name,
        title: title || undefined,
        content,
        type,
        trigger,
        delay: delay || undefined,
        scrollThreshold: scrollThreshold || undefined,
        pages: pages.split(",").map(s => s.trim()).filter(Boolean),
        frequency,
        frequencyDays: frequencyDays || undefined,
        active,
        ctaText: ctaText || undefined,
        ctaLink: ctaLink || undefined,
      };
      if (popup) await updatePopup(popup.id, data);
      else await createPopup(data);
    } catch (err) { setError(String(err)); setSaving(false); }
  }

  const inputCls = "mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)]";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <div className="rounded-lg border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 p-3 text-sm text-[var(--destructive)]">{error}</div>}

      <div><label className={labelCls}>Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputCls} /></div>
      <div><label className={labelCls}>Title (optional)</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} /></div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Type</label>
          <select value={type} onChange={e => setType(e.target.value as PopupType)} className={inputCls}>
            {POPUP_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Trigger</label>
          <select value={trigger} onChange={e => setTrigger(e.target.value as PopupTrigger)} className={inputCls}>
            {POPUP_TRIGGERS.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Frequency</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value as PopupFrequency)} className={inputCls}>
            {POPUP_FREQUENCIES.map(f => <option key={f} value={f}>{f.replace(/_/g, " ")}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div><label className={labelCls}>Delay (ms)</label><input type="number" value={delay} onChange={e => setDelay(Number(e.target.value))} className={inputCls} /></div>
        <div><label className={labelCls}>Scroll %</label><input type="number" value={scrollThreshold} onChange={e => setScrollThreshold(Number(e.target.value))} className={inputCls} /></div>
        <div><label className={labelCls}>Every X Days</label><input type="number" value={frequencyDays} onChange={e => setFrequencyDays(Number(e.target.value))} className={inputCls} /></div>
        <div><label className={labelCls}>Order</label><input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className={inputCls} /></div>
      </div>

      <div><label className={labelCls}>Pages (comma-separated route patterns)</label><input type="text" value={pages} onChange={e => setPages(e.target.value)} placeholder="/, /blog/*, /services" className={inputCls} /></div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>CTA Text</label><input type="text" value={ctaText} onChange={e => setCtaText(e.target.value)} className={inputCls} /></div>
        <div><label className={labelCls}>CTA Link</label><input type="text" value={ctaLink} onChange={e => setCtaLink(e.target.value)} className={inputCls} /></div>
      </div>

      <div><label className={labelCls}>Content</label><div className="mt-1"><TiptapEditor value={content} onChange={setContent} placeholder="Popup body..." minHeight="200px" /></div></div>

      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]"><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="rounded border-[var(--border)]" /> Active</label>

      <button type="submit" disabled={saving} className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50">{saving ? "Saving..." : popup ? "Update Popup" : "Create Popup"}</button>
    </form>
  );
}
