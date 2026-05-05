import Image from "next/image"
import Link from "next/link"
import { Shield, Zap, Target, Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden sm:py-16 sm:px-6 md:py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-4 inline-block px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs sm:text-sm font-medium sm:mb-6 sm:px-4">
            Our Mission
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            Privacy-First Connectivity.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            We believe sharing contact details should be <span className="text-indigo-400">instant</span>,
            <span className="text-indigo-400"> secure</span>, and remarkably simple.
            No apps, no friction—just seamless connection.
          </p>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-10 px-4 bg-black/30 border-y border-white/5 sm:py-14 sm:px-6 md:py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12">

          {/* Avatar Container */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden bg-gray-900 border border-white/10">
              <Image
                src="https://api.dicebear.com/9.x/pixel-art/svg?seed=puppy"
                alt="Olivier Lüthy"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />

            </div>
          </div>

          {/* Bio Content */}
          <div className="flex-1 space-y-4 sm:space-y-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Olivier Lüthy</h2>
              <p className="text-indigo-400 font-medium text-base sm:text-lg italic">Application Specialist & Pragmatic Programmer</p>
            </div>

            <div className="space-y-3 sm:space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base text-left">
              <p>
                As an Application Specialist focused on functionality and security analysis, Olivier approaches
                coding with a clear philosophy: <span className="font-semibold text-white">Efficiency is key.</span>
                Having participated in global hackathons and built solutions for AI startups,
                he knows that a tool is only as good as the problem it solves.
              </p>
              <p>
                Inspired by the engineering agility of tech giants like Facebook, he believes in
                optimizing for speed and purpose. Perfection is a moving target, but
                <span className="italic text-gray-100"> "Done is better than perfect"</span> when it
                comes to delivering secure, high-performance software.
              </p>
            </div>

            <div className="pt-2 sm:pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-900/20 text-sm sm:text-base sm:px-6"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                Work with Olivier
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
