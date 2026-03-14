import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Documentation — MedFlow Pro",
  description: "Full product documentation, tech stack, and pitch deck for MedFlow Pro.",
};

const competitors = [
  {
    name: "DrFirst",
    features: ["E-prescribing", "Drug database", "EHR integration"],
    cons: "Enterprise-only, expensive licensing, no real-time AI analysis",
    price: "$500+/mo",
    ai: false,
    patientPortal: false,
  },
  {
    name: "Surescripts",
    features: ["Pharmacy network", "Prescription routing", "Basic interaction checks"],
    cons: "Pharmacy-centric, no patient-facing portal, rule-based checks only",
    price: "Per-transaction",
    ai: false,
    patientPortal: false,
  },
  {
    name: "Epic Systems",
    features: ["Full EHR", "E-prescribing", "Patient portal"],
    cons: "Multi-million dollar implementation, 12–24 month rollout, locked vendor",
    price: "$1M+",
    ai: false,
    patientPortal: true,
  },
  {
    name: "Allscripts",
    features: ["Practice management", "E-prescribing", "Scheduling"],
    cons: "Legacy UI, slow support, no AI features, complex setup",
    price: "$300+/mo",
    ai: false,
    patientPortal: false,
  },
  {
    name: "MedFlow Pro",
    features: ["AI drug interaction (Groq)", "E-prescribing", "Patient portal", "Real-time alerts", "Modern UI", "Instant setup"],
    cons: "—",
    price: "Free / Open",
    ai: true,
    patientPortal: true,
    highlight: true,
  },
];

const techStack = [
  {
    category: "Frontend",
    color: "blue",
    items: [
      { name: "Next.js 15", desc: "App Router, server components, streaming SSR" },
      { name: "TypeScript", desc: "Type-safe codebase end-to-end" },
      { name: "TailwindCSS v4", desc: "Custom design system, dark/light theme" },
      { name: "Manrope", desc: "Modern variable font via Google Fonts" },
    ],
  },
  {
    category: "Backend & Database",
    color: "emerald",
    items: [
      { name: "Supabase", desc: "PostgreSQL database, Row Level Security, real-time" },
      { name: "Supabase Auth", desc: "JWT-based auth, role metadata, session management" },
      { name: "PostgreSQL Triggers", desc: "Auto-create user profiles on signup" },
      { name: "RLS Policies", desc: "Doctor-scoped data isolation using auth.uid()" },
    ],
  },
  {
    category: "AI Layer",
    color: "orange",
    items: [
      { name: "Groq API", desc: "Ultra-fast LLM inference, <500ms response time" },
      { name: "llama-3.3-70b-versatile", desc: "Open-source 70B model for clinical reasoning" },
      { name: "Structured JSON Prompting", desc: "Deterministic output with temp=0.1" },
      { name: "Server-side API Routes", desc: "API key never exposed to the client" },
    ],
  },
  {
    category: "Deployment & DevOps",
    color: "violet",
    items: [
      { name: "Vercel", desc: "Edge network deployment, automatic CI/CD from GitHub" },
      { name: "GitHub", desc: "Source control, auto-deploy on push to main" },
      { name: "Claude Code", desc: "Anthropic's AI CLI — entire app built with AI assistance" },
      { name: "Next.js Middleware", desc: "Auth-guarded routes, role-based redirects" },
    ],
  },
];

const demoFlows = [
  {
    step: "01",
    role: "Doctor",
    title: "Sign up & set up practice",
    desc: "Doctor registers, selects the Doctor role. A PostgreSQL trigger auto-creates their profile. Redirected to the dashboard instantly.",
    color: "blue",
  },
  {
    step: "02",
    role: "Doctor",
    title: "Add a patient",
    desc: "Register patient with name, DOB, email, and phone. Patient records are scoped by RLS to the creating doctor only.",
    color: "blue",
  },
  {
    step: "03",
    role: "Doctor",
    title: "Create a prescription + AI check",
    desc: "Select patient → pick medication → instantly triggers Groq AI analysis. The AI checks against all active medications, returns severity rating (high/medium/low), clinical summary, and suggested alternatives in real-time.",
    color: "orange",
    highlight: true,
  },
  {
    step: "04",
    role: "System",
    title: "Drug interaction alert saved",
    desc: "If the AI flags an interaction, the alert is saved to the database and appears on the dashboard and patient profile for future reference.",
    color: "red",
  },
  {
    step: "05",
    role: "Patient",
    title: "Patient portal",
    desc: "Patient logs in with the Patient role. Sees their active medications, prescription history, doses, frequencies, and doctor notes — all in real-time.",
    color: "emerald",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[var(--text-primary)]">MedFlow <span className="text-blue-500">Pro</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1">
              {["#overview","#demo","#tech-stack","#ai","#why","#competitors","#cta"].map((href) => (
                <a key={href} href={href}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-all capitalize">
                  {href.replace("#","").replace("-"," ")}
                </a>
              ))}
            </nav>
            <Link href="/login" className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* ── HERO ── */}
        <section id="overview" className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Hackathon Demo · MedFlow Pro v1.0
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight mb-5">
            AI-Powered Medication<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Management & E-Prescribing
            </span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-8">
            Every year, <strong className="text-red-400">7,000+ patients die</strong> from preventable medication errors in the US alone.
            MedFlow Pro gives doctors a real-time AI co-pilot that catches dangerous drug interactions
            before a prescription is ever issued.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Try the Live Demo
            </Link>
            <a href="#demo" className="inline-flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-semibold text-sm px-5 py-2.5 rounded-xl hover:border-blue-500/40 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Read the Docs
            </a>
          </div>

          {/* Problem stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14">
            {[
              { value: "7,000+", label: "Patients die annually from medication errors (US)", color: "red" },
              { value: "1.3M", label: "Adverse drug events occur each year in the US", color: "amber" },
              { value: "$21B", label: "Annual healthcare cost of preventable drug errors", color: "blue" },
            ].map((stat) => (
              <div key={stat.value} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5">
                <p className={`text-3xl font-extrabold mb-1 ${
                  stat.color === "red" ? "text-red-400" :
                  stat.color === "amber" ? "text-amber-400" : "text-blue-400"
                }`}>{stat.value}</p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOOK ── */}
        <section>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-slate-600" />
            Hook · 0:00 – 0:30
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">The Problem</h2>
                <div className="space-y-3">
                  {[
                    "Doctors prescribe 4+ medications to 40% of patients over 65",
                    "Drug interaction databases are static, rule-based, and often missed",
                    "Legacy EHR systems are expensive, slow, and lack AI capabilities",
                    "Small clinics & solo practitioners can't afford $500+/mo enterprise tools",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">The Solution</h2>
                <div className="space-y-3">
                  {[
                    "Real-time AI drug interaction analysis powered by Groq + Llama 3.3",
                    "Instant e-prescribing with patient-specific safety checks",
                    "Patient portal for medication transparency and history",
                    "Modern SaaS — deploy in minutes, not months",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Target Users</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Independent physicians, small clinics, telemedicine providers, and hospital departments seeking a modern, AI-first alternative to legacy EHR medication modules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DEMO ── */}
        <section id="demo">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-slate-600" />
            Product Demo · 0:30 – 2:30
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Key User Flows</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8">End-to-end walkthrough of the main features in MedFlow Pro.</p>

          <div className="space-y-4">
            {demoFlows.map((flow) => (
              <div key={flow.step}
                className={`relative bg-[var(--bg-secondary)] border rounded-2xl p-6 ${
                  flow.highlight
                    ? "border-orange-500/30 shadow-lg shadow-orange-500/5"
                    : "border-[var(--border)]"
                }`}
              >
                {flow.highlight && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full">
                      AI Feature
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${
                    flow.color === "blue" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    flow.color === "orange" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                    flow.color === "red" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {flow.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-[var(--text-primary)]">{flow.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        flow.role === "Doctor" ? "bg-blue-500/10 text-blue-400" :
                        flow.role === "Patient" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-slate-500/10 text-slate-400"
                      }`}>
                        {flow.role}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{flow.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo credentials */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-secondary)] border border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-blue-400">Doctor Login</span>
              </div>
              <p className="font-mono text-xs text-[var(--text-secondary)]">dr.smith@medflow.com</p>
              <p className="font-mono text-xs text-[var(--text-muted)]">password123</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-emerald-400">Patient Login</span>
              </div>
              <p className="font-mono text-xs text-[var(--text-secondary)]">john.doe@email.com</p>
              <p className="font-mono text-xs text-[var(--text-muted)]">password123</p>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section id="tech-stack">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-slate-600" />
            Tech Stack · 2:30 – 3:30
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Built on Modern Infrastructure</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8">Production-grade stack from day one — no shortcuts.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {techStack.map((section) => (
              <div key={section.category} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${
                    section.color === "blue" ? "bg-blue-500" :
                    section.color === "emerald" ? "bg-emerald-500" :
                    section.color === "orange" ? "bg-orange-500" :
                    "bg-violet-500"
                  }`} />
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">{section.category}</h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${
                        section.color === "blue" ? "bg-blue-500/10 text-blue-400" :
                        section.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                        section.color === "orange" ? "bg-orange-500/10 text-orange-400" :
                        "bg-violet-500/10 text-violet-400"
                      }`}>{item.name}</span>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI INTEGRATION ── */}
        <section id="ai">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-slate-600" />
            AI Integration
          </div>
          <div className="bg-gradient-to-br from-orange-500/5 via-[var(--bg-secondary)] to-blue-500/5 border border-orange-500/20 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Groq AI — Real-time Drug Interaction Engine</h2>
                <p className="text-sm text-[var(--text-muted)]">Powered by <code className="text-orange-400">llama-3.3-70b-versatile</code> via Groq's ultra-fast inference API (&lt;500ms)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Input", desc: "New medication + patient's existing active prescriptions + age", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
                { label: "Analysis", desc: "Llama 3.3 70B reasons through pharmacological interactions with clinical context", icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" },
                { label: "Output", desc: "Structured JSON: severity level, interaction list, alternatives, clinical summary", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              ].map((item) => (
                <div key={item.label} className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-4 font-mono text-xs overflow-x-auto">
              <p className="text-slate-500 mb-1">// API route: /api/check-interactions</p>
              <p className="text-emerald-400">{"// Response structure from Groq"}</p>
              <p className="text-slate-300">{"{"}</p>
              <p className="text-slate-300 pl-4"><span className="text-blue-400">&quot;overallRisk&quot;</span><span className="text-slate-500">:</span> <span className="text-amber-400">&quot;high&quot;</span><span className="text-slate-500">,  // high | medium | low | none</span></p>
              <p className="text-slate-300 pl-4"><span className="text-blue-400">&quot;clinicalSummary&quot;</span><span className="text-slate-500">:</span> <span className="text-amber-400">&quot;Warfarin + Aspirin significantly increases bleeding risk...&quot;</span><span className="text-slate-500">,</span></p>
              <p className="text-slate-300 pl-4"><span className="text-blue-400">&quot;interactions&quot;</span><span className="text-slate-500">: [</span></p>
              <p className="text-slate-300 pl-8"><span className="text-slate-500">{"{ "}</span><span className="text-blue-400">&quot;drug1&quot;</span><span className="text-slate-500">:</span> <span className="text-amber-400">&quot;Warfarin&quot;</span><span className="text-slate-500">, </span><span className="text-blue-400">&quot;severity&quot;</span><span className="text-slate-500">:</span> <span className="text-amber-400">&quot;high&quot;</span><span className="text-slate-500">, </span><span className="text-blue-400">&quot;effect&quot;</span><span className="text-slate-500">:</span> <span className="text-amber-400">&quot;...&quot;</span><span className="text-slate-500"> {"}"}</span></p>
              <p className="text-slate-300 pl-4"><span className="text-slate-500">],</span></p>
              <p className="text-slate-300 pl-4"><span className="text-blue-400">&quot;alternatives&quot;</span><span className="text-slate-500">: [{"{ "}</span><span className="text-blue-400">&quot;medication&quot;</span><span className="text-slate-500">:</span> <span className="text-amber-400">&quot;Clopidogrel&quot;</span><span className="text-slate-500">, </span><span className="text-blue-400">&quot;reason&quot;</span><span className="text-slate-500">:</span> <span className="text-amber-400">&quot;Safer choice&quot;</span><span className="text-slate-500"> {"}"}]</span></p>
              <p className="text-slate-300">{"}"}</p>
            </div>

            <div className="mt-4 p-3 bg-violet-500/5 border border-violet-500/20 rounded-xl">
              <p className="text-xs text-violet-300 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>Built with Claude Code</strong> — Anthropic&apos;s AI CLI tool was used to architect, write, and debug the entire application. From database schema to API routes to UI components — all AI-assisted.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHY BETTER ── */}
        <section id="why">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-slate-600" />
            Why Better · 3:30 – 4:30
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">What Makes MedFlow Pro Different</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8">Compared to every existing solution on the market.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Real-time LLM Analysis",
                desc: "Competitors use static drug interaction databases. We use live LLM reasoning — catching complex multi-drug interactions that rule-based systems miss.",
                color: "orange",
              },
              {
                icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                title: "Patient Portal Included",
                desc: "Most e-prescribing tools are doctor-only. MedFlow Pro gives patients full visibility into their medications, doses, and history.",
                color: "blue",
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Zero Enterprise Overhead",
                desc: "No 12-month sales cycles, no $1M implementations. Sign up, add patients, prescribe — all in under 5 minutes.",
                color: "emerald",
              },
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Row-Level Security",
                desc: "Each doctor only sees their own patients via Supabase RLS policies. HIPAA-conscious design with auth.uid() scoped data isolation.",
                color: "violet",
              },
              {
                icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
                title: "Modern Stack, Modern UX",
                desc: "Next.js 15 + Supabase + Vercel = instant global deployment. Dark/light theme, mobile-first, skeleton loading states throughout.",
                color: "indigo",
              },
              {
                icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
                title: "Open & Extensible",
                desc: "Built on open standards — swap LLM providers, add new medication databases, integrate with any EHR via API. No vendor lock-in.",
                color: "teal",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5 hover:border-blue-500/30 transition-colors group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  item.color === "orange" ? "bg-orange-500/10" :
                  item.color === "blue" ? "bg-blue-500/10" :
                  item.color === "emerald" ? "bg-emerald-500/10" :
                  item.color === "violet" ? "bg-violet-500/10" :
                  item.color === "indigo" ? "bg-indigo-500/10" :
                  "bg-teal-500/10"
                }`}>
                  <svg className={`w-5 h-5 ${
                    item.color === "orange" ? "text-orange-400" :
                    item.color === "blue" ? "text-blue-400" :
                    item.color === "emerald" ? "text-emerald-400" :
                    item.color === "violet" ? "text-violet-400" :
                    item.color === "indigo" ? "text-indigo-400" :
                    "text-teal-400"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPETITORS ── */}
        <section id="competitors">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-slate-600" />
            Competitive Landscape
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">MedFlow Pro vs The Market</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8">How we stack up against every major e-prescribing solution.</p>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
                  <th className="text-left px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Product</th>
                  <th className="text-center px-4 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">AI Interactions</th>
                  <th className="text-center px-4 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Patient Portal</th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Pricing</th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Main Limitation</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr key={c.name}
                    className={`border-b border-[var(--border)] last:border-0 ${
                      c.highlight
                        ? "bg-blue-500/5"
                        : i % 2 === 0 ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-primary)]"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${c.highlight ? "text-blue-400" : "text-[var(--text-primary)]"}`}>
                          {c.name}
                        </span>
                        {c.highlight && (
                          <span className="text-[10px] font-black bg-blue-500 text-white px-1.5 py-0.5 rounded">US</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {c.ai ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10">
                          <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {c.patientPortal ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10">
                          <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold ${c.highlight ? "text-emerald-400" : "text-[var(--text-secondary)]"}`}>
                        {c.price}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs ${c.highlight ? "text-[var(--text-muted)] italic" : "text-[var(--text-muted)]"}`}>
                        {c.cons}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="cta">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-slate-600" />
            Built By · 4:30 – 5:00
          </div>

          <div className="relative bg-gradient-to-br from-blue-600/10 via-[var(--bg-secondary)] to-indigo-600/10 border border-blue-500/20 rounded-3xl p-8 sm:p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-semibold text-blue-400">Bacancy Technology · Hackathon 2026</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
                Ready to Transform<br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Healthcare Prescribing?
                </span>
              </h2>
              <p className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                MedFlow Pro was designed, architected, and built using <strong className="text-violet-400">Claude Code</strong> —
                Anthropic&apos;s AI CLI tool — as a demonstration of how AI can accelerate
                full-stack SaaS development in a single hackathon session.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link href="/login"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xl shadow-blue-500/20 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Launch Live Demo
                </Link>
                <a href="https://www.bacancytechnology.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-blue-500/40 text-[var(--text-secondary)] font-semibold text-sm px-6 py-3 rounded-xl transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  Visit Bacancy Technology
                </a>
              </div>

              {/* Tech badges */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { label: "Next.js 15", color: "slate" },
                  { label: "Supabase", color: "emerald" },
                  { label: "Groq AI", color: "orange" },
                  { label: "llama-3.3-70b", color: "orange" },
                  { label: "Vercel", color: "slate" },
                  { label: "Claude Code", color: "violet" },
                  { label: "TypeScript", color: "blue" },
                  { label: "TailwindCSS", color: "cyan" },
                ].map((badge) => (
                  <span key={badge.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                    badge.color === "emerald" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                    badge.color === "orange" ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                    badge.color === "violet" ? "bg-violet-500/10 border-violet-500/20 text-violet-400" :
                    badge.color === "blue" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                    badge.color === "cyan" ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" :
                    "bg-slate-500/10 border-slate-500/20 text-slate-400"
                  }`}>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
