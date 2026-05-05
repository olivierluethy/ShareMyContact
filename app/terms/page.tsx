import { Scale, ShieldCheck, FileText, AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  const lastUpdated = "February 19, 2026"

  return (
    <main className="min-h-screen bg-gray-950 text-gray-300 py-12 px-4 sm:py-16 sm:px-6 md:py-20">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-6 sm:mb-16 sm:pb-8">
          <div className="flex items-center gap-3 mb-3 sm:mb-4 text-indigo-400">
            <Scale className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-mono text-xs sm:text-sm tracking-widest uppercase">Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-gray-500 italic text-sm">Last updated: {lastUpdated}</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 sm:space-y-12">

          {/* Section 1: Agreement */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold">1. Acceptance of Terms</h2>
            </div>
            <p className="leading-relaxed text-sm sm:text-base">
              By accessing <span className="text-white font-medium">ShareMyContact</span>, you agree to be bound by these Terms of Service.
              Olivier Lüthy reserves the right to optimize and update these terms at any time following the principle:
              <span className="italic text-indigo-400"> "Better, faster, and more secure."</span>
            </p>
          </section>

          {/* Section 2: Zero Knowledge & Security */}
          <section className="space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner sm:space-y-4 sm:p-6">
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck className="w-5 h-5 text-purple-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold">2. Usage & Security Architecture</h2>
            </div>
            <p className="leading-relaxed text-sm sm:text-base">
              Our service is engineered to share contact data efficiently. We guarantee a
              <span className="text-white font-semibold"> Zero-Knowledge Architecture</span>:
              your contact data is encoded directly into the link you share and never touches our databases.
              You are solely responsible for the accuracy of the data you share.
            </p>
          </section>

          {/* Section 3: Disclaimer */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 text-white">
              <AlertCircle className="w-5 h-5 text-pink-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold">3. Limitation of Liability</h2>
            </div>
            <p className="leading-relaxed text-sm sm:text-base">
              While we strive for engineering excellence (inspired by the agility of high-speed systems like Facebook's),
              this service is provided "as is". Olivier Lüthy shall not be liable for any indirect damages arising
              from the use or inability to use the service.
            </p>
          </section>

          {/* Section 4: Contact */}
          <section className="space-y-3 border-t border-white/10 pt-6 sm:space-y-4 sm:pt-8">
            <h2 className="text-lg sm:text-xl font-bold text-white">4. Contact & Jurisdiction</h2>
            <p className="leading-relaxed text-sm sm:text-base">
              Questions regarding these terms? Feel free to reach out via the
              <Link href="/contact" className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
                Contact Form <ExternalLink className="w-3 h-3" />
              </Link>.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-4">
              Place of jurisdiction: Meggen/Lucerne, Switzerland.
            </p>
          </section>

        </div>

        {/* Footer Brand Note */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center text-xs sm:text-sm text-gray-600 sm:mt-20 sm:pt-8">
          "Pragmatic legal terms for a pragmatic developer."
        </div>
      </div>
    </main>
  )
}
