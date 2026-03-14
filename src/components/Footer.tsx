import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                MedFlow <span className="text-blue-500">Pro</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              AI-powered medication management and e-prescribing platform for modern healthcare providers.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Live on Vercel</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Doctor Dashboard", href: "/dashboard" },
                { label: "Patient Portal", href: "/patient/dashboard" },
                { label: "Prescriptions", href: "/prescriptions" },
                { label: "Patient Records", href: "/patients" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-[var(--text-muted)] hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">Documentation</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Product Overview", href: "/docs#overview" },
                { label: "Key Features & Demo", href: "/docs#demo" },
                { label: "Tech Stack", href: "/docs#tech-stack" },
                { label: "AI Integration", href: "/docs#ai" },
                { label: "Why MedFlow Pro", href: "/docs#why" },
                { label: "Competitors", href: "/docs#competitors" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-[var(--text-muted)] hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Built By */}
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 mb-5">
              <li>
                <a href="https://www.bacancytechnology.com" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[var(--text-muted)] hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  bacancytechnology.com
                </a>
              </li>
              <li>
                <a href="mailto:info@bacancytechnology.com"
                  className="text-xs text-[var(--text-muted)] hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@bacancytechnology.com
                </a>
              </li>
              <li>
                <Link href="/docs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Full Documentation
                </Link>
              </li>
            </ul>

            {/* Powered by badge */}
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-2.5 py-1.5">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-[8px]">G</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">Groq <span className="text-[var(--text-secondary)]">llama-3.3-70b</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 MedFlow Pro · Built by{" "}
            <a href="https://www.bacancytechnology.com" target="_blank" rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Bacancy Technology
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">Docs</Link>
            <Link href="/docs#tech-stack" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">Tech Stack</Link>
            <Link href="/docs#why" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">Why Us</Link>
            <span className="text-xs text-[var(--text-muted)]">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
