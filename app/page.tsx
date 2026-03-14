import Link from "next/link";

const features = [
  {
    title: "Safe Prescribing",
    description: "Detect interactions and allergy conflicts before sending prescriptions."
  },
  {
    title: "Medication Intelligence",
    description: "Surface medication history, adherence signals, and clinical guidance in one view."
  },
  {
    title: "Workflow Automation",
    description: "Route prescriptions to pharmacies with audit-ready tracking."
  }
];

const steps = [
  "Search Patient",
  "Create Prescription",
  "Check Interactions",
  "Send to Pharmacy"
];

const securityItems = [
  "HIPAA-ready architecture",
  "Role-based access control",
  "Audit logging for every prescription",
  "Secure pharmacy routing"
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-primary-700">
            <span className="h-9 w-9 rounded-full bg-primary-100 text-center text-sm font-bold leading-9">MF</span>
            MedFlow Pro
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-primary-700">Features</a>
            <a href="#how" className="hover:text-primary-700">How it Works</a>
            <a href="#security" className="hover:text-primary-700">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-700">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">MedFlow Pro</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">
              Smarter Prescribing. Safer Patient Care.
            </h1>
            <p className="mt-4 text-base text-slate-600">
              MedFlow Pro brings medication intelligence, clinical safety checks, and automated workflows to every
              prescription.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-500"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-primary-200 hover:text-primary-700"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-primary-100 blur-3xl" />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Provider Dashboard</p>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">Live</span>
              </div>
              <div className="mt-4 space-y-3">
                {["Active Prescriptions", "Interaction Alerts", "AI Insights"].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{item}</p>
                    <p className="text-xs text-slate-500">Updated just now</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-primary-50 p-4">
                <p className="text-xs text-primary-700">Clinical workflow automation enabled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Features</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Medication intelligence, end to end.</h2>
          <p className="mt-3 text-slate-600">
            Designed for providers, patients, pharmacies, and administrators in one platform.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">How it Works</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Built for high-velocity clinical teams.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold text-primary-600">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Security</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Compliance-ready by design.</h2>
          <p className="mt-3 text-slate-600">Trusted workflows built for healthcare teams.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {securityItems.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{item}</p>
              <p className="text-xs text-slate-500">Security and governance built-in.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Start Using MedFlow Pro Today</h2>
            <p className="mt-2 text-slate-600">Launch safer prescribing workflows in days, not months.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-500"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-primary-200 px-5 py-3 text-sm font-semibold text-primary-700 hover:border-primary-400"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row">
          <p>MedFlow Pro. Secure prescribing for modern care teams.</p>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-primary-700">Features</a>
            <a href="#security" className="hover:text-primary-700">Security</a>
            <a href="#" className="hover:text-primary-700">Documentation</a>
            <a href="#" className="hover:text-primary-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}