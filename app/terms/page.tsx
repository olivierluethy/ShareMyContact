import { Scale, ShieldCheck, FileText, AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  const lastUpdated = "February 19, 2026"

  return (
    <main className="min-h-screen bg-gray-950 text-gray-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <div className="flex items-center gap-3 mb-4 text-indigo-400">
            <Scale className="w-8 h-8" />
            <span className="font-mono text-sm tracking-widest uppercase">Legal Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 italic">Last updated: {lastUpdated}</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          
          {/* Section 1: Agreement */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
            </div>
            <p className="leading-relaxed">
              By accessing <span className="text-white font-medium">ShareMyContact</span>, you agree to be bound by these Terms of Service. 
              Olivier Lüthy reserves the right to optimize and update these terms at any time following the principle: 
              <span className="italic text-indigo-400"> "Better, faster, and more secure."</span>
            </p>
          </section>

          {/* Section 2: Zero Knowledge & Security */}
          <section className="space-y-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              <h2 className="text-2xl font-bold">2. Usage & Security Architecture</h2>
            </div>
            <p className="leading-relaxed">
              Our service is engineered to share contact data efficiently. We guarantee a
              <span className="text-white font-semibold"> Zero-Knowledge Architecture</span>:
              your contact data is encoded directly into the link you share and never touches our databases.
              You are solely responsible for the accuracy of the data you share.
            </p>
          </section>

          {/* Section 3: Disclaimer */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <AlertCircle className="w-5 h-5 text-pink-500" />
              <h2 className="text-2xl font-bold">3. Limitation of Liability</h2>
            </div>
            <p className="leading-relaxed">
              While we strive for engineering excellence (inspired by the agility of high-speed systems like Facebook’s), 
              this service is provided "as is". Olivier Lüthy shall not be liable for any indirect damages arising 
              from the use or inability to use the service.
            </p>
          </section>

          {/* Section 4: Contact */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold text-white">4. Contact & Jurisdiction</h2>
            <p className="leading-relaxed">
              Questions regarding these terms? Feel free to reach out via the 
              <Link href="/contact" className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
                Contact Form <ExternalLink className="w-3 h-3" />
              </Link>.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Place of jurisdiction: Meggen/Lucerne, Switzerland.
            </p>
          </section>

        </div>

        {/* Footer Brand Note */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
          "Pragmatic legal terms for a pragmatic developer."
        </div>
      </div>
    </main>
  )
}
