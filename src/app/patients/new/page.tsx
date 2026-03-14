"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Footer from "@/components/Footer";

export default function NewPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("patients")
      .insert({
        doctor_id: user.id,
        name: formData.name,
        dob: formData.dob || null,
        email: formData.email || null,
        phone: formData.phone || null,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/patients/${data.id}`);
  };

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link href="/patients" className="back-link mb-6 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to patients
        </Link>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <p className="eyebrow mb-2">Create patient</p>
            <h1 className="page-title">Add New Patient</h1>
            <p className="page-copy mt-1">Fill in the patient&apos;s details below</p>
          </div>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">
                  Full Name <span className="text-rose-300">*</span>
                </label>
                <input id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="John Doe" required />
              </div>

              <div>
                <label className="label" htmlFor="dob">Date of Birth</label>
                <input id="dob" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="input-field" />
              </div>

              <div>
                <label className="label" htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" placeholder="+1 (555) 000-0000" />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="email">Email Address</label>
                <input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="patient@example.com" />
                <p className="mt-1.5 text-xs text-slate-500">
                  Used to link the patient portal account to the correct record.
                </p>
              </div>
            </div>

            <div className="divider" />

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 text-sm">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Adding patient...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Add Patient
                  </>
                )}
              </button>
              <Link href="/patients" className="btn-secondary px-5 py-2.5 text-sm">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
