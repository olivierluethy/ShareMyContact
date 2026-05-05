import { ShieldCheck, EyeOff, Database, Lock, Globe } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  const lastUpdated = "February 19, 2026"

  return (
    <main className="min-h-screen bg-gray-950 text-gray-300 py-12 px-4 sm:py-16 sm:px-6 md:py-20">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-6 text-center sm:mb-16 sm:pb-8 sm:text-left">
          <div className="flex justify-center sm:justify-start items-center gap-3 mb-3 sm:mb-4 text-emerald-400">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-mono text-xs sm:text-sm tracking-widest uppercase">Privacy Commitment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-500 italic text-sm">Last updated: {lastUpdated}</p>
        </div>

        {/* Highlight Box: Zero Knowledge */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-indigo-500/5 border border-emerald-500/20 shadow-2xl sm:mb-16 sm:p-8 sm:rounded-3xl">
          <div className="flex items-start gap-3 sm:gap-4">
            <EyeOff className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 shrink-0 mt-0.5 sm:mt-1" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Zero-Knowledge Architecture</h2>
              <p className="leading-relaxed text-emerald-100/70 text-sm sm:text-base">
                Unlike traditional services, <span className="text-white font-semibold text-emerald-400">ShareMyContact does not store your contact data.</span>
                Everything is encoded directly into the URL you share. We cannot read your contacts, because we never see them.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 sm:space-y-12">

          {/* Section 1: Data Collection */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Database className="w-5 h-5 text-indigo-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold">1. Data Collection</h2>
            </div>
            <p className="leading-relaxed text-sm sm:text-base">
              We collect minimal technical data required to run this web application (e.g., your IP address for security purposes and basic analytics).
              Personal contact information you enter is processed <span className="text-white font-medium italic">client-side</span> and is not transmitted to our servers for storage.
            </p>
          </section>

          {/* Section 2: Encryption */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Lock className="w-5 h-5 text-purple-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold">2. Security & Hosting</h2>
            </div>
            <p className="leading-relaxed text-sm sm:text-base">
              Our infrastructure is optimized for speed and security. We use industry-standard encryption for data in transit (SSL/TLS).
              Our servers are located in highly secure data centers, following strict compliance standards.
            </p>
          </section>

          {/* Section 3: Cookies & Tracking */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Globe className="w-5 h-5 text-pink-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold">3. Analytics</h2>
            </div>
            <p className="leading-relaxed text-sm sm:text-base">
              We use lightweight analytics (like Google Analytics with anonymized IPs) to understand how our service is used.
              This helps us optimize performance and fulfill our mission of providing a fast user experience.
            </p>
          </section>

          {/* Contact Link */}
          <section className="pt-6 sm:pt-8 border-t border-white/10 text-center sm:text-left">
            <p className="text-gray-400 text-sm sm:text-base">
              For any privacy-related inquiries, please reach out via the
              <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 ml-1 font-medium transition-colors">
                Contact Form
              </Link>.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
