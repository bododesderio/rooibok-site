"use client";

import { useState, useEffect } from "react";
import { updateSiteSettings } from "@/server/actions/settings";

export default function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [x, setX] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [navCtaText, setNavCtaText] = useState("");
  const [navCtaLink, setNavCtaLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s) => {
        if (!s) return;
        setCompanyName(s.companyName ?? "");
        setTagline(s.tagline ?? "");
        setEmail(s.email ?? "");
        setPhone(s.phone ?? "");
        setAddress(s.address ?? "");
        const social = (s.socialLinks ?? {}) as Record<string, string>;
        setInstagram(social.instagram ?? "");
        setFacebook(social.facebook ?? "");
        setLinkedin(social.linkedin ?? "");
        setX(social.x ?? "");
        setTiktok(social.tiktok ?? "");
        const nav = (s.navConfig ?? {}) as Record<string, string>;
        setNavCtaText(nav.ctaText ?? "");
        setNavCtaLink(nav.ctaLink ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateSiteSettings({
      companyName,
      tagline,
      email,
      phone,
      address,
      socialLinks: { instagram, facebook, linkedin, x, tiktok },
      navConfig: { ctaText: navCtaText, ctaLink: navCtaLink },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";

  if (loading) return <p className="text-[var(--foreground-muted)]">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Site Settings</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-8">
        {/* General */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">General</h2>
          <div className="mt-4 space-y-4">
            <div><label className="block text-sm font-medium text-[var(--foreground)]">Company Name</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-[var(--foreground)]">Tagline</label><input type="text" value={tagline} onChange={e => setTagline(e.target.value)} className={inputClass} /></div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Contact Info</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="block text-sm font-medium text-[var(--foreground)]">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-[var(--foreground)]">Phone</label><input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} /></div>
          </div>
          <div className="mt-4"><label className="block text-sm font-medium text-[var(--foreground)]">Address</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputClass} /></div>
        </section>

        {/* Social */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Social Links</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="block text-sm font-medium text-[var(--foreground)]">Instagram</label><input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-[var(--foreground)]">Facebook</label><input type="url" value={facebook} onChange={e => setFacebook(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-[var(--foreground)]">LinkedIn</label><input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-[var(--foreground)]">X (Twitter)</label><input type="url" value={x} onChange={e => setX(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-[var(--foreground)]">TikTok</label><input type="url" value={tiktok} onChange={e => setTiktok(e.target.value)} className={inputClass} /></div>
          </div>
        </section>

        {/* Nav CTA */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Navigation CTA</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="block text-sm font-medium text-[var(--foreground)]">Button Text</label><input type="text" value={navCtaText} onChange={e => setNavCtaText(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-[var(--foreground)]">Button Link</label><input type="text" value={navCtaLink} onChange={e => setNavCtaLink(e.target.value)} className={inputClass} /></div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50">
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
